// src/components/admin/product-dialog.tsx
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { MultipleImageUpload } from "@/components/ui/multiple-image-upload"
import { useToast } from "@/hooks/use-toast"

const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be positive"),
  salePrice: z.number().optional(),
  sku: z.string().min(1, "SKU is required"),
  stock: z.number().int().min(0, "Stock must be non-negative"),
  categoryId: z.string().min(1, "Category is required"),
  images: z.array(z.string()).min(1, "At least one image is required"),
  tags: z.array(z.string()).optional(),
  weight: z.number().min(0).optional(),
  dimensions: z.string().optional(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
})

type ProductFormValues = z.infer<typeof productFormSchema>

interface Product {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  salePrice?: number
  sku: string
  stock: number
  categoryId: string
  images: string[]
  tags?: string[]
  weight?: number
  dimensions?: string
  isActive: boolean
  isFeatured: boolean
}

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

interface ProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Product | null
  categories: Category[]
  onSaved: () => void
}

export function ProductDialog({
  open,
  onOpenChange,
  product,
  categories,
  onSaved,
}: ProductDialogProps) {
  const [loading, setLoading] = useState(false)
  const [tagInput, setTagInput] = useState("")
  const { toast } = useToast()

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      price: 0,
      salePrice: undefined,
      sku: "",
      stock: 0,
      categoryId: "",
      images: [],
      tags: [],
      weight: undefined,
      dimensions: "",
      isActive: true,
      isFeatured: false,
    },
  })

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        slug: product.slug,
        description: product.description || "",
        price: product.price,
        salePrice: product.salePrice,
        sku: product.sku,
        stock: product.stock,
        categoryId: product.categoryId,
        images: product.images || [],
        tags: product.tags || [],
        weight: product.weight,
        dimensions: product.dimensions || "",
        isActive: product.isActive,
        isFeatured: product.isFeatured,
      })
    } else {
      form.reset({
        name: "",
        slug: "",
        description: "",
        price: 0,
        salePrice: undefined,
        sku: "",
        stock: 0,
        categoryId: "",
        images: [],
        tags: [],
        weight: undefined,
        dimensions: "",
        isActive: true,
        isFeatured: false,
      })
    }
  }, [product, form])

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "")
  }

  const generateSKU = (name: string) => {
    const timestamp = Date.now().toString().slice(-4)
    const nameCode = name
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 4)
      .padEnd(4, "X")
    return `${nameCode}-${timestamp}`
  }

  const addTag = () => {
    if (tagInput.trim() && !form.getValues("tags")?.includes(tagInput.trim())) {
      const currentTags = form.getValues("tags") || []
      form.setValue("tags", [...currentTags, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues("tags") || []
    form.setValue("tags", currentTags.filter(tag => tag !== tagToRemove))
  }

  const onSubmit = async (data: ProductFormValues) => {
    setLoading(true)
    try {
      const url = product ? `/api/products/${product.id}` : "/api/products"
      const method = product ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Product ${product ? "updated" : "created"} successfully`,
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? "Edit Product" : "Add New Product"}
          </DialogTitle>
          <DialogDescription>
            {product
              ? "Update the product information below."
              : "Fill in the product information below."}
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
                    <FormLabel>Product Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter product name"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          if (!product) {
                            form.setValue("slug", generateSlug(e.target.value))
                            form.setValue("sku", generateSKU(e.target.value))
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
                      <Input placeholder="product-slug" {...field} />
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
                      placeholder="Enter product description"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Images */}
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Images *</FormLabel>
                  <FormControl>
                    <MultipleImageUpload
                      value={field.value || []}
                      onChange={field.onChange}
                      maxImages={5}
                      maxSizePerImage={5}
                    />
                  </FormControl>
                  <FormDescription>
                    Upload up to 5 images. The first image will be the main product image.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price and Stock */}
            <div className="grid grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (Rp) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="salePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sale Price (Rp)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormDescription>Optional</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU *</FormLabel>
                    <FormControl>
                      <Input placeholder="PROD-0001" {...field} />
                    </FormControl>
                    <FormDescription>
                      Unique product identifier
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Additional Fields */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.5"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormDescription>For shipping calculation</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dimensions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dimensions</FormLabel>
                    <FormControl>
                      <Input placeholder="L x W x H (cm)" {...field} />
                    </FormControl>
                    <FormDescription>Length x Width x Height</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Tags */}
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a tag"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addTag()
                          }
                        }}
                      />
                      <Button type="button" onClick={addTag} size="sm">
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {field.value?.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                          {tag} ×
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <FormDescription>
                    Tags help customers find your products
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Switches */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Active Product
                      </FormLabel>
                      <FormDescription>
                        Product will be visible to customers
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

              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Featured Product
                      </FormLabel>
                      <FormDescription>
                        Product will appear in featured section
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
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : product ? "Update Product" : "Create Product"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}