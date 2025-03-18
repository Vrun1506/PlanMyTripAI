import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ChatProvider } from "@/components/ChatContext";
import { Provider } from "@/components/ui/provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Plan My Trip AI",
  description: "Your AI trip planner",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" style={{ "colorScheme": "light" }}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Provider>
          <ChatProvider>
            {children}
          </ChatProvider>
        </Provider>
      </body>
    </html>
  );
}
