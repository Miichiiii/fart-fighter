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
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="theme-color" content="#000000" />
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
        <script
          src="https://telegram.org/js/telegram-web-app.js"
          async
        ></script>
      </head>
      <body
        className="bg-black min-h-screen touch-manipulation overscroll-none"
        style={{
          position: "fixed",
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SoundProvider>
            <MuteButton />
            <main
              className="flex w-full h-full flex-col items-center justify-center"
              style={{ position: "relative", overflow: "hidden" }}
            >
              {children}
            </main>
          </SoundProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
