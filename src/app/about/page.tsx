import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  ShoppingCart, 
  Award, 
  Users, 
  Shield, 
  Truck, 
  Heart 
} from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Tentang Azrafqueen Store</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Menyediakan berbagai produk muslimah berkualitas tinggi sejak 2015
          </p>
        </div>

        {/* About Section */}
        <div className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Siapa Kami?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Azrafqueen Store adalah toko online yang berdedikasi menyediakan berbagai produk muslimah 
                berkualitas tinggi. Kami fokus pada kebutuhan wanita muslim modern yang mengutamakan 
                kenyamanan, kualitas, dan keanggunan dalam berbusana.
              </p>
              <p className="text-muted-foreground mb-4">
                Sejak berdiri pada tahun 2015, kami telah melayani ribuan pelanggan di seluruh Indonesia 
                dengan komitmen untuk memberikan pengalaman berbelanja terbaik dan produk yang berkualitas.
              </p>
              <p className="text-muted-foreground">
                Produk unggulan kami adalah Abaya dan Jilbab/Kerudung Pashmina yang tersedia dalam berbagai 
                model dan warna sesuai dengan tren terkini namun tetap mempertahankan nilai-nilai keislaman.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Heart className="mr-2 h-6 w-6 text-primary" />
                Misi Kami
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Memberdayakan wanita muslim dengan menyediakan busana yang elegan, nyaman, dan sesuai dengan nilai-nilai keislaman, 
                sehingga mereka dapat tampil percaya diri dalam segala aktivitas sehari-hari.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Award className="mr-2 h-6 w-6 text-primary" />
                Visi Kami
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Menjadi toko online terpercaya di Indonesia yang menyediakan berbagai produk muslimah berkualitas tinggi, 
                menjadi mitra terbaik bagi wanita muslim dalam memenuhi kebutuhan fashion mereka.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Why Choose Us */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Mengapa Memilih Kami?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-primary" />
                  Kualitas Terjamin
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Semua produk kami dipilih dengan teliti dan berkualitas tinggi, 
                  menggunakan bahan yang nyaman dan tahan lama.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="mr-2 h-5 w-5 text-primary" />
                  Pengiriman Cepat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Kami bekerja sama dengan berbagai ekspedisi terpercaya untuk memastikan 
                  pengiriman pesanan Anda cepat dan aman sampai tujuan.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-primary" />
                  Pelayanan Ramah
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Tim customer service kami siap membantu Anda 24/7 dengan pelayanan 
                  yang ramah dan profesional.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Team Introduction */}
        <div className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Tim Kami</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Azrafqueen Store dibangun dan dikelola oleh tim profesional yang berpengalaman 
                di bidang fashion muslimah. Kami terdiri dari para desainer berbakat, staf 
                operasional yang efisien, dan customer service yang ramah dan responsif.
              </p>
              <p className="text-muted-foreground">
                Kami berkomitmen untuk terus meningkatkan kualitas layanan dan produk 
                demi kepuasan pelanggan yang merupakan prioritas utama kami.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center mb-12">
          <Card className="bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="text-2xl">Siap untuk Berbelanja?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-6 text-primary-foreground/90">
                Temukan koleksi terbaru kami dan rasakan perbedaan kualitas produk Azrafqueen Store
              </p>
              <Button size="lg" variant="secondary">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Belanja Sekarang
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}