import { ShoppingCart } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t py-12 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ShoppingCart className="h-6 w-6" />
              <h3 className="text-lg font-bold">Azrafqueen Store</h3>
            </div>
            <p className="text-muted-foreground">
              Menyediakan berbagai produk muslimah berkualitas tinggi sejak 2015. Fashion yang elegan dan nyaman untuk wanita muslim modern.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Tautan Cepat</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-muted-foreground hover:text-foreground">
                  Produk
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-muted-foreground hover:text-foreground">
                  Kategori
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Kontak
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Layanan Pelanggan</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Hubungi Kami
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-muted-foreground hover:text-foreground">
                  Retur & Penukaran
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-muted-foreground hover:text-foreground">
                  Kebijakan Pengiriman
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Kebijakan Privasi
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Info Kontak</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>Email: info@azrafqueenstore.com</li>
              <li>WA: +62 895 3979 78257</li>
              <li>Alamat: Jl. Contoh Alamat No. 123, Jakarta Selatan, DKI Jakarta 12345</li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Azrafqueen Store. Hak Cipta Dilindungi.</p>
        </div>
      </div>
    </footer>
  )
}