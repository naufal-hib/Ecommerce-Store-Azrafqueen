import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Kebijakan Pengiriman</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Informasi lengkap mengenai pengiriman pesanan Anda
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Wilayah Pengiriman</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Kami melayani pengiriman ke seluruh wilayah Indonesia melalui berbagai ekspedisi terpercaya 
                seperti JNE, POS Indonesia, J&T Express, dan SiCepat.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Waktu Pengiriman</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Wilayah Jawa & Bali:</h3>
                <p className="text-muted-foreground">1-3 hari kerja setelah pesanan dikirim</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Luar Jawa:</h3>
                <p className="text-muted-foreground">3-7 hari kerja setelah pesanan dikirim</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Wilayah Terpencil:</h3>
                <p className="text-muted-foreground">5-14 hari kerja setelah pesanan dikirim</p>
              </div>
              <p className="text-muted-foreground text-sm mt-4">
                *Waktu pengiriman dapat berubah tergantung kondisi cuaca, libur nasional, atau kondisi darurat
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Biaya Pengiriman</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Gratis Ongkir:</h3>
                <p className="text-muted-foreground">Gratis ongkir untuk pembelian minimal Rp 150.000,-</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Biaya Pengiriman Standar:</h3>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Wilayah Jawa & Bali: Rp 15.000,-</li>
                  <li>Luar Jawa: Rp 25.000,-</li>
                  <li>Wilayah Terpencil: Rp 35.000,-</li>
                </ul>
              </div>
              <p className="text-muted-foreground text-sm mt-4">
                *Biaya pengiriman dihitung otomatis saat checkout berdasarkan berat paket dan lokasi tujuan
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Pelacakan Pesanan</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Setelah pesanan dikirim, Anda akan menerima nomor resi pengiriman melalui WhatsApp. 
                Anda dapat melacak status pengiriman melalui website ekspedisi dengan menggunakan nomor resi tersebut.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Pengemasan</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Setiap pesanan dikemas dengan rapi menggunakan kemasan berkualitas untuk menjaga kondisi 
                barang tetap aman selama pengiriman. Kami juga menambahkan pengaman tambahan untuk barang 
                yang mudah rusak atau penyok.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}