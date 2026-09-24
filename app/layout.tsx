import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Phương Đông | May đo và thiết kế vest 3D",
  description:
    "May đo cao cấp tại Việt Trì, kết hợp kỹ nghệ thủ công và trải nghiệm thiết kế vest 3D.",
  keywords: [
    "bespoke tailor",
    "luxury suit",
    "3D suit configurator",
    "Phương Đông Tailor",
    "may đo Việt Trì",
    "custom suit",
  ],
  authors: [{ name: "Phương Đông Tailor" }],
  openGraph: {
    title: "Phương Đông | May đo cao cấp tại Việt Trì",
    description:
      "Kỹ nghệ may đo, chất liệu tuyển chọn và trải nghiệm thiết kế vest 3D.",
    type: "website",
    locale: "vi_VN",
    siteName: "Phương Đông Tailor",
  },
  twitter: {
    card: "summary_large_image",
    title: "Phương Đông | May đo cao cấp",
    description: "May đo cao cấp kết hợp trải nghiệm thiết kế 3D.",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#080808",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark">
      <body className="bg-atelier-bg text-atelier-text antialiased selection:bg-atelier-gold selection:text-atelier-bg">
        {children}
      </body>
    </html>
  );
}
