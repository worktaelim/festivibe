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
        <meta name="theme-color" content="#0a0a0f" />
      </head>
      <body style={{ height: "100%", background: "#0a0a0f" }}>{children}</body>
    </html>
  );
}
