import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Facebook, 
  Instagram, 
  Twitter 
} from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Hubungi Kami</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Punya pertanyaan atau masukan? Jangan ragu untuk menghubungi kami!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Informasi Kontak</CardTitle>
                <CardDescription>
                  Hubungi kami melalui saluran berikut
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-primary mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold">Telepon/WA</h3>
                    <p className="text-muted-foreground">+62 895 3979 78257</p>
                    <p className="text-sm text-muted-foreground">(Senin - Minggu, 08:00 - 20:00 WIB)</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-primary mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-muted-foreground">info@azrafqueenstore.com</p>
                    <p className="text-sm text-muted-foreground">cs@azrafqueenstore.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-primary mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold">Alamat</h3>
                    <p className="text-muted-foreground">
                      Jl. Contoh Alamat No. 123<br />
                      Jakarta Selatan, DKI Jakarta 12345<br />
                      Indonesia
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="h-6 w-6 text-primary mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold">Jam Operasional</h3>
                    <p className="text-muted-foreground">
                      Senin - Jumat: 09:00 - 18:00 WIB<br />
                      Sabtu: 10:00 - 16:00 WIB<br />
                      Minggu: Tutup
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Social Media */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-2xl">Media Sosial</CardTitle>
                <CardDescription>
                  Ikuti kami di media sosial untuk update terbaru
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <Button variant="outline" size="icon">
                    <Facebook className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Instagram className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Twitter className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Kirim Pesan</CardTitle>
                <CardDescription>
                  Kirim pesan kepada kami dan kami akan merespon secepatnya
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nama Lengkap</Label>
                      <Input id="name" placeholder="Masukkan nama Anda" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="Masukkan email Anda" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subjek</Label>
                    <Input id="subject" placeholder="Masukkan subjek pesan" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Pesan</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Tulis pesan Anda di sini..." 
                      rows={5} 
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Kirim Pesan
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            {/* FAQ */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-2xl">Pertanyaan Umum</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Bagaimana cara melakukan pembayaran?</h3>
                    <p className="text-sm text-muted-foreground">
                      Kami menyediakan berbagai metode pembayaran seperti transfer bank, 
                      e-wallet, dan COD (tergantung lokasi).
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Berapa lama waktu pengiriman?</h3>
                    <p className="text-sm text-muted-foreground">
                      Waktu pengiriman biasanya 1-3 hari kerja untuk wilayah Jawa dan 
                      3-7 hari kerja untuk luar Jawa.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Apakah ada garansi produk?</h3>
                    <p className="text-sm text-muted-foreground">
                      Ya, kami menyediakan garansi 7 hari untuk produk yang cacat produksi. 
                      Silakan hubungi customer service kami untuk informasi lebih lanjut.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}