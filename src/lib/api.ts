import { Product, Category } from "@prisma/client";

export interface ProductWithCategory extends Product {
  category: Category;
}

export async function getProducts(options: {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  isActive?: boolean;
} = {}): Promise<{
  products: ProductWithCategory[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}> {
  const {
    page = 1,
    limit = 10,
    search = "",
    categoryId = "",
    isActive = true,
  } = options;

  const params = new URLSearchParams();
  if (page) params.append("page", page.toString());
  if (limit) params.append("limit", limit.toString());
  if (search) params.append("search", search);
  if (categoryId) params.append("categoryId", categoryId);
  if (isActive !== undefined) params.append("isActive", isActive.toString());

  const response = await fetch(`/api/products?${params.toString()}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
}

export async function getCategories(): Promise<Category[]> {
  const response = await fetch("/api/categories", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  return response.json();
}