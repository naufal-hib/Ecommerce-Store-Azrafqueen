// src/components/ui/safe-image.tsx
"use client"

import { useState } from "react"
import Image from "next/image"
import { ShoppingCart, Package } from "lucide-react"

interface SafeImageProps {
  src?: string | null
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  fallbackType?: "product" | "category" | "user"
  sizes?: string
}

export function SafeImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = "",
  fallbackType = "product",
  sizes,
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Fallback placeholder images
  const fallbackImages = {
    product: "/placeholder-product.jpg",
    category: "/placeholder-category.jpg", 
    user: "/placeholder-user.jpg"
  }

  // Default placeholder dengan icon
  const DefaultFallback = () => {
    const Icon = fallbackType === "category" ? Package : ShoppingCart
    return (
      <div className={`bg-muted flex items-center justify-center ${className}`}>
        <div className="text-center text-muted-foreground">
          <Icon className="h-8 w-8 mx-auto mb-2" />
          <p className="text-xs">No Image</p>
        </div>
      </div>
    )
  }

  // Loading placeholder
  const LoadingPlaceholder = () => (
    <div className={`bg-muted animate-pulse ${className}`}>
      <div className="w-full h-full bg-muted-foreground/20"></div>
    </div>
  )

  // Jika tidak ada src atau error
  if (!src || hasError) {
    return <DefaultFallback />
  }

  // Validate URL
  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  if (!isValidUrl(src)) {
    return <DefaultFallback />
  }

  return (
    <>
      {isLoading && <LoadingPlaceholder />}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity`}
        sizes={sizes}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true)
          setIsLoading(false)
        }}
        priority={false}
      />
    </>
  )
}