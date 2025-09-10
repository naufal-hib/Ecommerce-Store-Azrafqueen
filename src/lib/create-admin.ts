import { prisma } from "./prisma"
import bcrypt from "bcryptjs"

export async function createAdminUser() {
  try {
    const existingAdmin = await prisma.user.findFirst({
      where: { role: "ADMIN" }
    })

    if (existingAdmin) {
      console.log("Admin user already exists")
      return existingAdmin
    }

    const hashedPassword = await bcrypt.hash("admin123", 12)

    const admin = await prisma.user.create({
      data: {
        name: "Admin User",
        email: "admin@example.com",
        password: hashedPassword,
        role: "ADMIN",
        emailVerified: new Date(),
      }
    })

    console.log("Admin user created:", admin.email)
    return admin
  } catch (error) {
    console.error("Error creating admin user:", error)
  }
}