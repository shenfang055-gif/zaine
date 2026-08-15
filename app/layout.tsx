import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

const title = "在呢 ZAI NE · 记录此刻";
const description = "急急急？先别急，先记录此刻。管理待办与日程，收藏随手想法和知识笔记。";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const socialImage = `${protocol}://${host}/og.png`;

  return {
    title,
    description,
    icons: {
      icon: "/xianbieji-app-icon-transparent.png",
      shortcut: "/xianbieji-app-icon-transparent.png",
      apple: "/xianbieji-app-icon-transparent.png",
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale: "zh_CN",
      siteName: "在呢 ZAI NE",
      images: [{ url: socialImage, width: 1712, height: 907, alt: "在呢 ZAI NE：急急急？先别急，先记录此刻。" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
