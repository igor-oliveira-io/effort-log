"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, Flame, Dumbbell, PlusCircle, Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

export default function NavigationBar() {
  const { logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: <Flame size={18} /> },
    {
      href: "/training-sessions",
      label: "Treinos",
      icon: <Dumbbell size={18} />,
    },
    {
      href: "/new-training",
      label: "Novo Treino",
      icon: <PlusCircle size={18} />,
    },
  ];

  return (
    <nav className="w-full border-b bg-white shadow-sm py-2 px-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center space-x-2">
        <Image src="/logo.png" alt="Logo" width={40} height={40} />
        <span className="font-bold text-lg text-blue-600">Effort Log</span>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-6">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-blue-600 ${
              pathname === item.href
                ? "text-blue-600 font-semibold"
                : "text-gray-600"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
        <button
          onClick={handleLogout}
          className="text-red-500 hover:text-red-600"
          title="Sair"
        >
          <LogOut size={20} />
        </button>
      </div>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden">
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md border-t py-4 px-4 md:hidden">
          <div className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 text-base font-medium ${
                  pathname === item.href ? "text-blue-600" : "text-gray-700"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
            <button
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center space-x-2 text-red-600 font-medium"
            >
              <LogOut size={18} />
              <span>Sair</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
