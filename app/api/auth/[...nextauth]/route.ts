import NextAuth, { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { OWNERS } from "@/lib/authorizedUsers";
import { Role, RequestStatus } from "@prisma/client";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt" },
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: { params: { scope: "identify email" } },
      profile(profile) {
        return {
          id: profile.id,
          name: profile.global_name ?? profile.username,
          email: profile.email ?? `${profile.id}@discord.local`,
          image: profile.avatar
            ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
            : undefined,
        };
      },
    }),
  ],

  callbacks: {
    // ✅ تسجيل الدخول
    async signIn({ account, user }) {
      const discordId = account?.providerAccountId;
      if (!discordId) return false;

      const isOwner = OWNERS.includes(discordId);

      // 🔍 تحقق أو أنشئ المستخدم في قاعدة البيانات
      let dbUser = await prisma.user.findUnique({ where: { id: user.id } });

      if (!dbUser) {
        dbUser = await prisma.user.create({
          data: {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            role: isOwner ? Role.OWNER : Role.PENDING,
          },
        });
      }

      // 🔗 اربط حساب Discord بالمستخدم (لمنع OAuthAccountNotLinked)
      await prisma.account.upsert({
        where: {
          provider_providerAccountId: {
            provider: "discord",
            providerAccountId: discordId,
          },
        },
        update: {},
        create: {
          userId: dbUser.id,
          provider: "discord",
          providerAccountId: discordId,
          type: "oauth",
        },
      });

      // 👑 لو المستخدم Owner، تأكد إن الدور محدث
      if (isOwner && dbUser.role !== Role.OWNER) {
        await prisma.user.update({
          where: { id: dbUser.id },
          data: { role: Role.OWNER },
        });
      }

      // 🚫 لو المستخدم Pending → سجل طلب وصول إن مش موجود
      if (!isOwner && dbUser.role === Role.PENDING) {
        const existingReq = await prisma.accessRequest.findFirst({
          where: { userId: dbUser.id, status: RequestStatus.PENDING },
        });

        if (!existingReq) {
          await prisma.accessRequest.create({
            data: {
              userId: dbUser.id,
              status: RequestStatus.PENDING,
            },
          });
        }

        console.log("🕓 Pending user:", user.name);
        return "/request-pending"; // يروح لصفحة الانتظار
      }

      console.log("✅ Approved or Owner:", user.name);
      return true;
    },

    // 🧠 تحديث التوكن (JWT)
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
        });

        token.uid = user.id;
        token.role = dbUser?.role ?? Role.PENDING;
        token.banned = dbUser?.banned ?? false;
      }
      return token;
    },

    // 💾 تعديل بيانات الجلسة
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.uid;
        (session.user as any).role = token.role;
        (session.user as any).banned = token.banned;
      }
      return session;
    },
  },

  pages: {
    signIn: "/", // صفحة تسجيل الدخول
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
