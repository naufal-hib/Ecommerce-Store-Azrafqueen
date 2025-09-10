"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Product {
  id: string
  name: string
  price: number
  salePrice?: number
  image?: string
  categoryName?: string
  sku: string
}

interface BuyNowButtonProps {
  product: Product
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  className?: string
}

export function BuyNowButton({ 
  product, 
  variant = "default", 
  size = "default",
  className = ""
}: BuyNowButtonProps) {
  const { toast } = useToast()

  const generateWhatsAppMessage = () => {
    const price = product.salePrice || product.price
    
    let message = "🛍️ *Pesanan Langsung dari Azrafqueen Store*\n\n"
    message += "*Detail Produk:*\n"
    message += `📦 Nama: ${product.name}\n`
    message += `🏷️ SKU: ${product.sku}\n`
    if (product.categoryName) {
      message += `📂 Kategori: ${product.categoryName}\n`
    }
    message += `💰 Harga: Rp ${price.toLocaleString('id-ID')}\n`
    
    if (product.salePrice && product.salePrice < product.price) {
      message += `💸 Harga Normal: Rp ${product.price.toLocaleString('id-ID')} (HEMAT Rp ${(product.price - product.salePrice).toLocaleString('id-ID')})\n`
    }
    
    message += `📊 Jumlah: 1 pcs\n\n`
    message += `*💵 Total: Rp ${price.toLocaleString('id-ID')}*\n\n`
    message += "Saya ingin memesan produk ini. Mohon informasi lebih lanjut untuk proses pemesanan. Terima kasih! 🙏"

    return encodeURIComponent(message)
  }

  const handleBuyNow = () => {
    const whatsappMessage = generateWhatsAppMessage()
    const whatsappUrl = `https://wa.me/62895397978257?text=${whatsappMessage}`
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank')
    
    // Show success message
    toast({
      title: "Pesanan Dikirim!",
      description: `Pesanan "${product.name}" telah dikirim ke WhatsApp. Silakan lanjutkan chat dengan admin.`,
    })
  }

  return (
    <Button 
      variant={variant}
      size={size}
      className={`bg-green-600 hover:bg-green-700 text-white ${className}`}
      onClick={handleBuyNow}
    >
      <MessageCircle className="mr-2 h-4 w-4" />
      Beli Sekarang
    </Button>
  )
}