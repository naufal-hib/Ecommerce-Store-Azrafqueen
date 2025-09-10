// Mock data for top products
const products = [
  {
    name: "Wireless Headphones",
    sales: 1234,
    revenue: "$12,340",
  },
  {
    name: "Smart Watch",
    sales: 987,
    revenue: "$9,870",
  },
  {
    name: "Laptop Stand",
    sales: 743,
    revenue: "$7,430",
  },
  {
    name: "USB-C Cable",
    sales: 650,
    revenue: "$6,500",
  },
  {
    name: "Phone Case",
    sales: 543,
    revenue: "$5,430",
  },
]

export function TopProducts() {
  return (
    <div className="space-y-8">
      {products.map((product, index) => (
        <div key={product.name} className="flex items-center">
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm font-medium">
            {index + 1}
          </div>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {product.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {product.sales} sales
            </p>
          </div>
          <div className="ml-auto font-medium">
            {product.revenue}
          </div>
        </div>
      ))}
    </div>
  )
}