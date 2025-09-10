okey sekarang tolong sempurnakan dan perbaiki hal berikut :
1. tombol add to cart  pada landing page tidak berfungsi , seharusnya ketika add to cart diklik maka keranjang akan muncul angka merah jumlah produk di keranjang , dan ketika di klik keranjangnya ada beberapa produknya , tapi ini tidak semenjak dihilangkan pada sebelumnya , sebelumnya kayanya saya udah pernah buat untuk cart nya
2. ketika saya klik product untuk view detail ada issue :

## Error Type
Console Error

## Error Message
`DialogContent` requires a `DialogTitle` for the component to be accessible for screen reader users.

If you want to hide the `DialogTitle`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/dialog


    at _c1 (src/components/ui/dialog.tsx:38:5)
    at _c1 (src/components/ui/dialog.tsx:36:3)
    at ProductDetailModal (src/components/product-detail-modal.tsx:201:7)
    at ProductCard (src/components/product-card.tsx:167:7)
    at <unknown> (src/app/products/page.tsx:478:17)
    at Array.map (<anonymous>:null:null)
    at ProductsPage (src/app/products/page.tsx:477:33)

## Code Frame
  36 |   <DialogPortal>
  37 |     <DialogOverlay />
> 38 |     <DialogPrimitive.Content
     |     ^
  39 |       ref={ref}
  40 |       className={cn(
  41 |         "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",

Next.js version: 15.5.2 (Turbopack)
Lalu ketika di klik beli / buy ini tidak berfungsi seharusnya berfungsi dengan order chat ke wa dengan detail order nya
yang paling mengganggu adalah kenapa ketika saya misal pergi ke halaman produk atau kategori , memuat datanya cukup memakan waktu , apakah ada yang salah?
saya sudah mengupload beberapa yang berhubungan , oiya saya juga udah ada src\components\add-to-cart-button.tsx dan  src\components\buy-now-button.tsx

silahkan perbaiki dengan semaksimal mungkin 