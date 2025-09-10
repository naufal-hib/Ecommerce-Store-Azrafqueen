import { prisma } from "./prisma"

export async function createSampleCategories() {
  try {
    const categories = [
      {
        name: "Jilbab / Kerudung Pashmina",
        slug: "jilbab-kerudung-pashmina",
        description: "Berbagai jenis jilbab dan kerudung pashmina berkualitas tinggi",
      },
      {
        name: "Abaya",
        slug: "abaya",
        description: "Abaya dewasa dengan berbagai model dan warna elegan",
      },
      {
        name: "Kerudung Anak",
        slug: "kerudung-anak",
        description: "Kerudung khusus anak-anak dengan desain lucu dan nyaman",
      },
      {
        name: "Baju Muslim Anak Cowok",
        slug: "baju-muslim-anak-cowok",
        description: "Pakaian muslim untuk anak laki-laki dengan berbagai ukuran",
      },
      {
        name: "Baju Muslim Anak Cewek",
        slug: "baju-muslim-anak-cewek",
        description: "Pakaian muslim untuk anak perempuan dengan desain cantik",
      },
      {
        name: "Al-Quran",
        slug: "al-quran",
        description: "Al-Quran dengan terjemahan dan tafsir lengkap",
      },
    ]

    for (const category of categories) {
      await prisma.category.upsert({
        where: { slug: category.slug },
        update: {},
        create: category,
      })
    }

    console.log("Sample categories created successfully")
  } catch (error) {
    console.error("Error creating sample categories:", error)
  }
}