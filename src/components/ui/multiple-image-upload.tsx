// src/components/ui/multiple-image-upload.tsx
"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { X, Upload, Image as ImageIcon, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MultipleImageUploadProps {
  value: string[]
  onChange: (images: string[]) => void
  maxImages?: number
  maxSizePerImage?: number // in MB
  className?: string
  disabled?: boolean
}

export function MultipleImageUpload({
  value = [],
  onChange,
  maxImages = 5,
  maxSizePerImage = 5,
  className,
  disabled = false,
}: MultipleImageUploadProps) {
  const [uploadingImages, setUploadingImages] = useState<boolean[]>([])

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (disabled) return

      const remainingSlots = maxImages - value.length
      const filesToProcess = acceptedFiles.slice(0, remainingSlots)

      if (filesToProcess.length === 0) return

      // Initialize uploading states
      const newUploadingStates = Array(filesToProcess.length).fill(true)
      setUploadingImages(prev => [...prev, ...newUploadingStates])

      try {
        const uploadPromises = filesToProcess.map(async (file, index) => {
          try {
            // Validate file size
            if (file.size > maxSizePerImage * 1024 * 1024) {
              throw new Error(`File ${file.name} is too large. Maximum size is ${maxSizePerImage}MB`)
            }

            // Convert to base64 for preview (in real app, upload to cloud storage)
            const base64 = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader()
              reader.onload = () => resolve(reader.result as string)
              reader.onerror = reject
              reader.readAsDataURL(file)
            })

            // In real application, you would upload to cloud storage like AWS S3, Cloudinary, etc.
            // For demo purposes, we'll use base64 (not recommended for production)
            
            // Simulate upload delay
            await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))
            
            return base64
          } catch (error) {
            console.error(`Error uploading ${file.name}:`, error)
            return null
          }
        })

        const uploadedImages = await Promise.all(uploadPromises)
        const successfulUploads = uploadedImages.filter(Boolean) as string[]
        
        onChange([...value, ...successfulUploads])
      } catch (error) {
        console.error("Error uploading images:", error)
      } finally {
        setUploadingImages([])
      }
    },
    [value, onChange, maxImages, maxSizePerImage, disabled]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: true,
    disabled: disabled || value.length >= maxImages,
  })

  const removeImage = (index: number) => {
    if (disabled) return
    const newImages = value.filter((_, i) => i !== index)
    onChange(newImages)
  }

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (disabled) return
    const newImages = [...value]
    const [movedImage] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, movedImage)
    onChange(newImages)
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Zone */}
      {value.length < maxImages && (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
            isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
            disabled ? "opacity-50 cursor-not-allowed" : "hover:border-primary hover:bg-primary/5"
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <div className="text-sm">
              <span className="font-medium">Click to upload</span> or drag and drop
            </div>
            <div className="text-xs text-muted-foreground">
              PNG, JPG, WEBP up to {maxSizePerImage}MB ({maxImages - value.length} remaining)
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Grid */}
      {(value.length > 0 || uploadingImages.length > 0) && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Existing Images */}
          {value.map((image, index) => (
            <Card key={index} className="group relative overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-square relative">
                  <img
                    src={image}
                    alt={`Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay Actions */}
                  {!disabled && (
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeImage(index)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      
                      {index > 0 && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => moveImage(index, index - 1)}
                          className="h-8 w-8 p-0"
                        >
                          ←
                        </Button>
                      )}
                      
                      {index < value.length - 1 && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => moveImage(index, index + 1)}
                          className="h-8 w-8 p-0"
                        >
                          →
                        </Button>
                      )}
                    </div>
                  )}
                  
                  {/* Main Image Indicator */}
                  {index === 0 && (
                    <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                      Main
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Uploading Images */}
          {uploadingImages.map((_, index) => (
            <Card key={`uploading-${index}`} className="relative overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-square bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <div className="text-xs text-muted-foreground">Uploading...</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Info Text */}
      <div className="text-xs text-muted-foreground">
        {value.length > 0 && (
          <p>First image will be used as the main product image. Drag images to reorder.</p>
        )}
      </div>
    </div>
  )
}