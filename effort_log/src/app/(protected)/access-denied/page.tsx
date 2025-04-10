"use client";

import Link from "next/link";

export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-4">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Acesso Negado</h1>
      <p className="text-lg text-gray-700 mb-6">
        Você não tem permissão para acessar esta página.
      </p>
      <Link
        href="/login"
        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Voltar para o Login
      </Link>
    </div>
  );
}
