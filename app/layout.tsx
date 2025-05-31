import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AnimatedCursor from "@/components/AnimatedCursor";
import CustomCursor from "@/components/CustomCursor";
import ClientLayout from "./ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shahriar | MERN & Next.js Developer",
  description: "Hi, I'm Shahriar, a passionate MERN & Next.js developer specializing in full-stack web development.",
  keywords: [
    "Shahriar",
    "MERN stack developer",
    "Next.js developer",
    "full-stack developer",
    "React.js",
    "Tailwind CSS",
    "MongoDB",
    "portfolio",
    "JavaScript",
    "web development",
  ],
  authors: [{ name: "Shahriar", url: "https://www.shahriarsany.shop/" }],
  creator: "Shahriar",
  openGraph: {
    title: "Shahriar | MERN & Next.js Developer",
    description: "Hi, I'm Shahriar, a MERN & Next.js developer with expertise in full-stack web development.",
    url: "https://www.shahriarsany.shop/",
    siteName: "Shahriar's Portfolio",
    type: "website",
    images: [
      {
        url: "https://www.shahriarsany.shop//shahriar.jpg",
        width: 1200,
        height: 630,
        alt: "Shahriar Portfolio",
      },
    ],
  },
  metadataBase: new URL("https://www.shahriarsany.shop/"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Facebook Domain Verification */}
        <meta name="facebook-domain-verification" content="8c24ptwr6d5teqt7qzorrrjuxw3vau" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <ClientLayout>
          {children}
          {/* <AnimatedCursor /> */}
          <CustomCursor />
        </ClientLayout>
      </body>
    </html>
  );
}
