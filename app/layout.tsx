import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "在呢 ZAI NE · 记录此刻",
  description: "急急急？先别急，先记录此刻。管理待办与日程，收藏随手想法和知识笔记。",
  icons: {
    icon: "/xianbieji-app-icon-transparent.png",
    shortcut: "/xianbieji-app-icon-transparent.png",
    apple: "/xianbieji-app-icon-transparent.png",
  },
};

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
