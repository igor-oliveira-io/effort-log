import "@/app/globals.css";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className="overflow-x-hidden h-full">
      <body
        className={`${inter.className} bg-white text-gray-900 h-full overflow-x-hidden`}
      >
        <div className="flex flex-col min-h-screen">
          <main className="flex-1 flex items-center justify-center px-4">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
