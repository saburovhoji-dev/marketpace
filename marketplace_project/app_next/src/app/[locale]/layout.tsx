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
        <style>{`body,html{background:#131313;color:#e5e2e1;margin:0;padding:0;min-height:100vh}
a{color:inherit;text-decoration:inherit}
.glass-card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1)}
.flex{display:flex}.block{display:block}.hidden{display:none}
.w-full{width:100%}.max-w-4xl{max-width:56rem}.mx-auto{margin-left:auto;margin-right:auto}
.px-4{padding-left:1rem;padding-right:1rem}.py-4{padding-top:1rem;padding-bottom:1rem}
.text-center{text-align:center}.text-white{color:#fff}
.font-bold{font-weight:700}.text-sm{font-size:.875rem}.text-2xl{font-size:1.5rem}
.items-center{align-items:center}.justify-center{justify-content:center}
.flex-col{flex-direction:column}.gap-4{gap:1rem}
.min-h-screen{min-height:100vh}.relative{position:relative}
.z-10{z-index:10}.rounded-lg{border-radius:.5rem}
.border{border:1px solid rgba(255,255,255,0.1)}
@media(min-width:768px){.md\\:flex{display:flex}.md\\:hidden{display:none}}`}</style>
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
