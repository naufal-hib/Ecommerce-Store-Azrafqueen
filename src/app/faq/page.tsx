import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function FAQPage() {
  const faqs = [
    {
      question: "Bagaimana cara melakukan pembelian di Azrafqueen Store?",
      answer: "Anda dapat melakukan pembelian dengan mudah melalui website kami. Pilih produk yang diinginkan, tambahkan ke keranjang, lalu checkout melalui WhatsApp dengan mengirim detail pesanan ke nomor +62 895 3979 78257."
    },
    {
      question: "Apakah saya perlu membuat akun untuk berbelanja?",
      answer: "Tidak, Anda tidak perlu membuat akun untuk berbelanja. Anda bisa langsung melakukan checkout sebagai tamu. Namun, dengan membuat akun, Anda bisa melacak pesanan dan mendapatkan penawaran eksklusif."
    },
    {
      question: "Berapa lama waktu pengiriman?",
      answer: "Waktu pengiriman biasanya 1-3 hari kerja untuk wilayah Jawa dan 3-7 hari kerja untuk luar Jawa, tergantung pada lokasi tujuan dan ekspedisi yang digunakan."
    },
    {
      question: "Apakah tersedia layanan Cash on Delivery (COD)?",
      answer: "Ya, kami menyediakan layanan COD untuk wilayah tertentu. Silakan konfirmasi terlebih dahulu dengan customer service kami melalui WhatsApp."
    },
    {
      question: "Bagaimana cara melakukan retur atau penukaran barang?",
      answer: "Anda dapat melakukan retur atau penukaran dalam waktu 7 hari setelah barang diterima. Hubungi customer service kami melalui WhatsApp dengan menyertakan foto barang dan alasan retur."
    },
    {
      question: "Apakah harga sudah termasuk ongkos kirim?",
      answer: "Harga produk belum termasuk ongkos kirim. Ongkos kirim akan dihitung otomatis saat checkout berdasarkan lokasi pengiriman."
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Pertanyaan Umum (FAQ)</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Temukan jawaban atas pertanyaan yang sering diajukan oleh pelanggan kami
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{faq.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12 p-8 bg-muted rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Masih memiliki pertanyaan?</h3>
          <p className="text-muted-foreground mb-4">
            Hubungi tim customer service kami untuk bantuan lebih lanjut
          </p>
          <Link 
            href="/contact" 
            className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-colors"
          >
            Hubungi Kami
          </Link>
        </div>
      </div>
    </div>
  )
}