import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AnimatedCursor from "@/components/AnimatedCursor";
import CustomCursor from "@/components/CustomCursor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nahid | MERN & Next.js Developer",
  description: "Hi, I'm Nahid, a passionate MERN & Next.js developer specializing in full-stack web development.",
  keywords: [
    "Nahid",
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
  authors: [{ name: "Nahid", url: "https://nahiddev.vercel.app" }],
  creator: "Nahid",
  openGraph: {
    title: "Nahid | MERN & Next.js Developer",
    description: "Hi, I'm Nahid, a MERN & Next.js developer with expertise in full-stack web development.",
    url: "https://nahiddev.vercel.app",
    siteName: "Nahid's Portfolio",
    type: "website",
    images: [
      {
        url: "https://nahiddev.vercel.app/profile_pic.png",
        width: 1200,
        height: 630,
        alt: "Nahid Portfolio",
      },
    ],
  },
  metadataBase: new URL("https://nahiddev.vercel.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        {children}
        {/* <AnimatedCursor /> */}
        <CustomCursor />
      </body>
    </html>
  );
}
