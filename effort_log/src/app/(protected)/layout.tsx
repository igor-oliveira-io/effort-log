import "@/app/globals.css";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import NavigationBar from "@/components/NavigationBar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import QueryProvider from "@/components/queryProvider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-white text-gray-900`}>
        <QueryProvider>
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <NavigationBar />
              <main className="flex-1 w-full">{children}</main>
              <Footer />
            </div>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
