import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Kebijakan Retur & Penukaran</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Kami ingin Anda puas dengan setiap pembelian. Berikut adalah kebijakan retur dan penukaran kami
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Syarat Retur & Penukaran</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Retur/penukaran dapat dilakukan dalam waktu 7 hari setelah barang diterima</li>
                <li>Barang harus dalam kondisi baru, belum digunakan, dan dalam kemasan asli</li>
                <li>Label harga dan tag masih terpasang</li>
                <li>Menyertakan bukti pembelian (nomor pesanan)</li>
                <li>Barang harus dikirim kembali dalam kondisi kemasan yang aman</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Barang yang Tidak Dapat Diretur</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Barang yang sudah digunakan atau dicuci</li>
                <li>Barang dengan aroma parfum atau bau lainnya</li>
                <li>Barang yang telah dimodifikasi atau diubah</li>
                <li>Barang intim seperti pakaian dalam</li>
                <li>Barang yang dibeli saat promo dengan syarat tidak dapat diretur</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Proses Retur & Penukaran</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                <li>Hubungi customer service kami melalui WhatsApp di +62 895 3979 78257</li>
                <li>Jelaskan alasan retur/penukaran dan sertakan foto barang</li>
                <li>Tunggu konfirmasi dan instruksi lebih lanjut dari tim kami</li>
                <li>Kirim barang kembali ke alamat yang akan diberikan</li>
                <li>Setelah barang diterima dan diperiksa, kami akan proses sesuai permintaan</li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Biaya Retur</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Biaya pengiriman retur ditanggung oleh pelanggan, kecuali dalam kasus:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Barang rusak saat pengiriman</li>
                <li>Barang tidak sesuai dengan pesanan</li>
                <li>Kesalahan dari pihak Azrafqueen Store</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Waktu Proses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Proses retur/penukaran memerlukan waktu maksimal 14 hari kerja setelah barang kami terima. 
                Kami akan menginformasikan status retur secara berkala melalui WhatsApp.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}