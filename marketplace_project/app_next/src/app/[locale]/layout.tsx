import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, JetBrains_Mono } from "next/font/google";
import "../globals.css";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DigitalHubUz",
  description: "Next Gen Marketplace",
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}>) {
  const {locale} = await params;
  let messages;
  try {
    messages = await getMessages();
  } catch (error) {
    console.error("Error getting messages:", error);
    notFound();
  }

  return (
    <html
      lang={locale}
      className={`dark ${geistSans.variable} ${geistMono.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased bg-background text-on-background font-body-md overflow-x-hidden`}
    >
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
        <style>{`/* Critical inline fallback */
body,html{background-color:#131313;color:#e5e2e1;margin:0;padding:0;min-height:100vh}
a{color:inherit;text-decoration:inherit}
.glass-card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1)}
@supports not (aspect-ratio:1){.glass-card{background:rgba(255,255,255,0.03)}}`}</style>
      </head>
      <body className="min-h-full flex flex-col relative selection:bg-primary selection:text-on-primary">
        <NextIntlClientProvider messages={messages}>
            <Header />
            <main className="relative flex-grow">
              {children}
            </main>
            <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
