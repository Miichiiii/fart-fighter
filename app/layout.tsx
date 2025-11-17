import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { SoundProvider } from "@/components/sound-context";
import { MuteButton } from "@/components/mute-button";

export const metadata: Metadata = {
  title: "Fart-Fighter",
  description: "Ein epischer Kampf ;-)",
  manifest: "/manifest.json",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover",
  },
  themeColor: "#000000",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Fart-Fighter",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
        <script
          src="https://telegram.org/js/telegram-web-app.js"
          async
        ></script>
      </head>
      <body className="bg-black min-h-screen touch-manipulation overscroll-none">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SoundProvider>
            <MuteButton />
            <main className="flex min-h-screen flex-col items-center justify-center">
              {children}
            </main>
          </SoundProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
