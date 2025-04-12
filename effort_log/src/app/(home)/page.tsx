"use client";

import { LogIn, UserPlus, Github } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="w-full bg-white flex flex-col items-center justify-center px-4 text-center overflow-x-hidden">
      <div className="mb-3"></div>
      <Image src="/logo.png" alt="Logo" width={120} height={120} />

      <h1 className="text-5xl font-extrabold text-gray-900 mb-4">Effort Log</h1>

      <p className="text-gray-500 max-w-2xl text-base sm:text-lg mb-8">
        Registre seus treinos, observe e mantenha sua consistência com sua meta
        semanal e contador de streak, acompanhe sua evolução e progressão de
        carga com seu diário de treinos Effort Log.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => router.push("/login")}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium text-base rounded-full shadow transition w-56"
        >
          <LogIn size={18} />
          Entrar
        </button>
        <button
          onClick={() => router.push("/register")}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-green-100 hover:bg-green-200 text-green-800 font-medium text-base rounded-full shadow transition w-56"
        >
          <UserPlus size={18} />
          Criar Conta
        </button>
      </div>

      <div className="mt-12">
        <a
          href="https://github.com/igor-oliveira-io/effort-log"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-black text-sm transition"
        >
          <Github size={16} />
          Ver repositório no GitHub
        </a>
      </div>
    </div>
  );
}
