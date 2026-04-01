import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Festivibe",
  description: "Plan your festival with your crew",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Festivibe" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ height: "100%" }}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#f0ebe0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ height: "100%", background: "#f0ebe0" }}>{children}</body>
    </html>
  );
}
