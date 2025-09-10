"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Plus, Minus, Trash2, MessageCircle } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export function CartDrawer() {
  const { items, total, itemCount, removeItem, updateQuantity, clearCart } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  const generateWhatsAppMessage = () => {
    if (items.length === 0) return ""

    let message = "🛍️ *Pesanan dari Azrafqueen Store*\n\n"
    message += "*Detail Pesanan:*\n"
    
    items.forEach((item, index) => {
      const price = item.salePrice || item.price
      const subtotal = price * item.quantity
      message += `${index + 1}. ${item.name}\n`
      message += `   📦 SKU: ${item.sku}\n`
      message += `   💰 Harga: Rp ${price.toLocaleString('id-ID')}\n`
      message += `   📊 Qty: ${item.quantity}\n`
      message += `   💵 Subtotal: Rp ${subtotal.toLocaleString('id-ID')}\n\n`
    })

    message += `*📋 Total Items:* ${itemCount}\n`
    message += `*💸 Total Pembayaran:* Rp ${total.toLocaleString('id-ID')}\n\n`
    message += "Mohon konfirmasi pesanan ini. Terima kasih! 🙏"

    return encodeURIComponent(message)
  }

  const handleWhatsAppCheckout = () => {
    if (items.length === 0) {
      toast({
        title: "Keranjang Kosong",
        description: "Tambahkan produk ke keranjang terlebih dahulu",
        variant: "destructive"
      })
      return
    }

    const whatsappMessage = generateWhatsAppMessage()
    const whatsappUrl = `https://wa.me/62895397978257?text=${whatsappMessage}`
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank')
    
    // Show success message
    toast({
      title: "Pesanan Dikirim!",
      description: "Pesanan Anda telah dikirim ke WhatsApp. Mohon tunggu konfirmasi dari admin.",
    })

    // Close cart drawer
    setIsOpen(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {itemCount}
            </Badge>
          )}
          <span className="sr-only">Keranjang Belanja</span>
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Keranjang Belanja ({itemCount})
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto py-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Keranjang belanja kosong</p>
                <p className="text-sm text-muted-foreground">Tambahkan produk untuk melanjutkan</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => {
                  const price = item.salePrice || item.price
                  const subtotal = price * item.quantity

                  return (
                    <div key={item.id} className="flex gap-3 p-3 border rounded-lg">
                      <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={item.image || "/placeholder-product.jpg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div>
                          <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                          <p className="text-xs text-muted-foreground">{item.categoryName}</p>
                          <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-sm">
                            {item.salePrice ? (
                              <div className="space-y-1">
                                <span className="font-semibold text-green-600">
                                  Rp {item.salePrice.toLocaleString('id-ID')}
                                </span>
                                <div className="text-xs text-muted-foreground line-through">
                                  Rp {item.price.toLocaleString('id-ID')}
                                </div>
                              </div>
                            ) : (
                              <span className="font-semibold">
                                Rp {item.price.toLocaleString('id-ID')}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-700"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <span className="text-sm font-semibold">
                            Subtotal: Rp {subtotal.toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Footer with Total and Checkout */}
          {items.length > 0 && (
            <div className="border-t pt-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Items:</span>
                  <span>{itemCount}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>Rp {total.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700" 
                  onClick={handleWhatsAppCheckout}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Checkout via WhatsApp
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={clearCart}
                >
                  Kosongkan Keranjang
                </Button>
              </div>

              <div className="text-xs text-muted-foreground text-center">
                💬 Checkout via WhatsApp ke: +62 895 3979 78257
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}