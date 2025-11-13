import { prisma } from "@/lib/prisma";
import { OWNERS } from "@/lib/authorizedUsers";


// 🧹 دالة تمسح أي توكنات تخص يوزرز اتشالوا من authorizedUsers.ts
export async function cleanupTokens() {
  try {
    await prisma.token.deleteMany({
      where: {
        userId: {
          notIn: OWNERS,
        },
      },
    });
    console.log("🧹 تم مسح التوكنات لليوزرز الغير مصرح ليهم");
  } catch (err) {
    console.error("❌ خطأ أثناء مسح التوكنات:", err);
  }
}
