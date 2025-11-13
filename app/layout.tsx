import "./globals.css";
import Providers from "@/components/Providers";

export const metadata = {
  title: "1.drk Security Dashboard",
  description: "Secure dashboard for managing the security bot",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
