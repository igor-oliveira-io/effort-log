import "@/app/globals.css";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import QueryProvider from "@/components/queryProvider";

const inter = Inter({ subsets: ["latin"] });

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-gray-100 text-gray-900`}>
        <QueryProvider>
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <main className="flex-1 flex items-center justify-center px-4">
                <div className="w-full max-w-md">{children}</div>
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
