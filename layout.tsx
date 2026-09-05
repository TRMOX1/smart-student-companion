import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Cairo, IBM_Plex_Sans_Arabic, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["600", "700", "800"],
  variable: "--font-cairo",
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-arabic",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-mono",
});

export const metadata: Metadata = {
  title: "رفيق الطالب الذكي | Smart Student Companion (Android & Web)",
  description:
    "تطبيق رفيق الطالب الذكي — مساعدك الدراسي الذكي لتنظيم الوقت، جدول المذاكرة الذكي، الواجبات، الاختبارات، بومودورو، بطاقات التكرار المتباعد SRS، وكود تطبيق Flutter المتكامل للأندرويد.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} ${ibmPlexArabic.variable} ${ibmPlexMono.variable}`}
    >
      <body className="bg-[#F8FAFC] text-[#0F172A] antialiased selection:bg-blue-600 selection:text-white font-[family-name:var(--font-ibm-arabic)]">
        {children}
      </body>
    </html>
  );
}
