import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope, Noto_Sans_Armenian } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { I18nProvider } from "@/components/I18nProvider";
import { StoreProvider } from "@/components/StoreProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

const notoHy = Noto_Sans_Armenian({
  variable: "--font-noto-hy",
  subsets: ["armenian"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "VOSKE — gold jewelry · RU / ՀԱ / EN",
    template: "%s · VOSKE",
  },
  description:
    "VOSKE / ՈՍԿԵ — gold jewelry house for Russia and Armenia. Catalog, gold rate on tap, Telegram @themoonberry.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ru"
      className={`${manrope.variable} ${cormorant.variable} ${notoHy.variable} h-full antialiased bg-[var(--paper)]`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-[var(--paper)] text-[var(--ink)]">
        <ThemeProvider>
          <I18nProvider>
            <StoreProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </StoreProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
