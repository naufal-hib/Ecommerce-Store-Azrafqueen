import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Kebijakan Privasi</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Komitmen kami terhadap privasi dan keamanan data Anda
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Informasi yang Kami Kumpulkan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Informasi Pribadi:</h3>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Nama lengkap</li>
                  <li>Alamat email</li>
                  <li>Nomor telepon</li>
                  <li>Alamat pengiriman</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Informasi Pembayaran:</h3>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Detail pembayaran (melalui WhatsApp)</li>
                  <li>Riwayat transaksi</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Informasi Teknis:</h3>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Alamat IP</li>
                  <li>Jenis browser dan perangkat</li>
                  <li>Halaman yang dikunjungi</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Bagaimana Kami Menggunakan Informasi Anda</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Memproses dan mengirimkan pesanan Anda</li>
                <li>Menghubungi Anda terkait pesanan dan layanan pelanggan</li>
                <li>Mengirimkan informasi promosi dan penawaran khusus (dengan persetujuan)</li>
                <li>Meningkatkan pengalaman belanja Anda di website kami</li>
                <li>Menganalisis penggunaan website untuk tujuan pengembangan</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Keamanan Data</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Kami menerapkan berbagai langkah keamanan untuk melindungi informasi pribadi Anda. 
                Data Anda disimpan secara aman menggunakan enkripsi dan akses terbatas. 
                Pembayaran dilakukan melalui WhatsApp untuk menjaga keamanan data keuangan Anda.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Berbagi Informasi dengan Pihak Ketiga</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Kami tidak menjual, memperdagangkan, atau mentransfer informasi pribadi Anda kepada pihak luar 
                tanpa persetujuan Anda, kecuali dalam situasi berikut:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Penyedia layanan pengiriman untuk memfasilitasi pengiriman pesanan</li>
                <li>Penyedia layanan pembayaran (jika menggunakan metode pembayaran online)</li>
                <li>Ketika diwajibkan oleh hukum atau untuk melindungi hak-hak kami</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Hak Anda</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Mengakses informasi pribadi yang kami miliki tentang Anda</li>
                <li>Memperbaiki informasi yang tidak akurat</li>
                <li>Meminta penghapusan data pribadi Anda</li>
                <li>Menarik persetujuan untuk pemasaran langsung kapan saja</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Untuk menggunakan hak-hak ini, silakan hubungi kami melalui informasi kontak di bawah.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Perubahan pada Kebijakan Privasi</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu. 
                Setiap perubahan akan diposting di halaman ini dengan tanggal pembaruan. 
                Kami menyarankan Anda untuk meninjau kebijakan ini secara berkala.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Kontak Kami</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Jika Anda memiliki pertanyaan tentang kebijakan privasi ini atau ingin menggunakan hak privasi Anda, 
                silakan hubungi kami:
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-muted-foreground">Email: info@azrafqueenstore.com</p>
                <p className="text-muted-foreground">WA: +62 895 3979 78257</p>
                <p className="text-muted-foreground">Alamat: Jl. Contoh Alamat No. 123, Jakarta Selatan, DKI Jakarta 12345</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}