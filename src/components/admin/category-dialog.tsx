// src/components/admin/category-dialog.tsx
"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { MultipleImageUpload } from "@/components/ui/multiple-image-upload"
import { useToast } from "@/hooks/use-toast"

const categoryFormSchema = z.object({
  name: z.string().min(1, "Category name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
  isActive: z.boolean(),
})

type CategoryFormValues = z.infer<typeof categoryFormSchema>

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  images: string[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  parentId: string | null
  sortOrder: number
}

interface CategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category | null
  onSaved: () => void
}

export function CategoryDialog({
  open,
  onOpenChange,
  category,
  onSaved,
}: CategoryDialogProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      images: [],
      isActive: true,
    },
  })

  // Update form when category changes
  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        slug: category.slug,
        description: category.description || "",
        images: category.images || (category.image ? [category.image] : []),
        isActive: category.isActive,
      })
    } else {
      form.reset({
        name: "",
        slug: "",
        description: "",
        images: [],
        isActive: true,
      })
    }
  }, [category, form])

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "")
  }

  const onSubmit = async (data: CategoryFormValues) => {
    setLoading(true)
    try {
      // Transform data to match API expectations
      const apiData = {
        ...data,
        image: data.images?.[0] || null, // First image as main image
      }

      const url = category ? `/api/admin/categories/${category.id}` : "/api/admin/categories"
      const method = category ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Category ${category ? "updated" : "created"} successfully`,
        })
        onSaved()
        onOpenChange(false)
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Something went wrong",
          variant: "destructive",
        })
      }
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {category ? "Edit Category" : "Add New Category"}
          </DialogTitle>
          <DialogDescription>
            {category
              ? "Update the category information below."
              : "Fill in the category information below."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter category name"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          if (!category) {
                            form.setValue("slug", generateSlug(e.target.value))
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug *</FormLabel>
                    <FormControl>
                      <Input placeholder="category-slug" {...field} />
                    </FormControl>
                    <FormDescription>
                      URL-friendly version of the name
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter category description"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A brief description of what this category contains
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category Images */}
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Images</FormLabel>
                  <FormControl>
                    <MultipleImageUpload
                      value={field.value || []}
                      onChange={field.onChange}
                      maxImages={3}
                      maxSizePerImage={5}
                    />
                  </FormControl>
                  <FormDescription>
                    Upload up to 3 images for this category. The first image will be the main category image displayed in listings.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category Status */}
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Active Category
                    </FormLabel>
                    <FormDescription>
                      Category will be visible to customers and products can be added to it
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : category ? "Update Category" : "Create Category"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}