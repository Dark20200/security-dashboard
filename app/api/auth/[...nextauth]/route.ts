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
    /** ---------------------------------------
     *  🔥  Sign In Flow (مهم جدًا)
     * ----------------------------------------*/
    async signIn({ account, user }) {
      const discordId = account?.providerAccountId;
      if (!discordId) return false;

      const isOwner = OWNERS.includes(discordId);

      // 🟪 Check existing DB user
      let dbUser = await prisma.user.findUnique({
        where: { id: user.id },
      });

      // 🟪 Create user if not exists
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

      // 🟪 Link discord account
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

      // 🟪 Make sure OWNERS always stay OWNER
      if (isOwner && dbUser.role !== Role.OWNER) {
        await prisma.user.update({
          where: { id: dbUser.id },
          data: { role: Role.OWNER },
        });
      }

      // 🟪 Pending Users → redirect
      if (!isOwner && dbUser.role === Role.PENDING) {
        const existingReq = await prisma.accessRequest.findFirst({
          where: {
            userId: dbUser.id,
            status: RequestStatus.PENDING,
          },
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

        // ⭐ هذا الخط هو المهم → redirect صحيح 100%
        return "/request-pending";
      }

      console.log("✅ Approved or Owner:", user.name);
      return true;
    },

    /** ---------------------------------------
     *  🔥 JWT Token
     * ----------------------------------------*/
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

    /** ---------------------------------------
     *  🔥 Session Object
     * ----------------------------------------*/
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
