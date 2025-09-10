"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { CategoryDialog } from "@/components/admin/category-dialog"

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  image: string | null
  images: string[]
  parentId: string | null
  sortOrder: number
}

export function CategoryClient({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null | undefined>(null)
  const { toast } = useToast()

  const fetchCategories = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/categories")
      const data = await response.json()

      if (response.ok) {
        setCategories(data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch categories",
          variant: "destructive",
        })
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  const deleteCategory = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Category deleted successfully",
        })
        fetchCategories()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to delete category",
          variant: "destructive",
        })
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const handleAddCategory = () => {
    setEditingCategory(null)
    setIsDialogOpen(true)
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setIsDialogOpen(true)
  }

  const handleCategorySaved = () => {
    setIsDialogOpen(false)
    setEditingCategory(null)
    fetchCategories()
  }

  // Filter categories based on search term
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(search.toLowerCase()) ||
    category.slug.toLowerCase().includes(search.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Category Filters</CardTitle>
          <CardDescription>
            Search and filter your categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  placeholder="Search categories..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Button onClick={handleAddCategory}>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Category List</CardTitle>
          <CardDescription>
            {filteredCategories.length} categories found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading categories...</div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No categories found</p>
              <Button onClick={handleAddCategory}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Category
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div className="font-medium">{category.name}</div>
                      </TableCell>
                      <TableCell>{category.slug}</TableCell>
                      <TableCell>
                        {category.description && category.description.length > 0 ? category.description : (
                          <span className="text-muted-foreground">No description</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={category.isActive ? "default" : "secondary"}
                        >
                          {category.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEditCategory(category)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Category</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete &quot;{category.name}&quot;?
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteCategory(category.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <CategoryDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        category={editingCategory}
        onSaved={handleCategorySaved}
      />
    </div>
  )
}