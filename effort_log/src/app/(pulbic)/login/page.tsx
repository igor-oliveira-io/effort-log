"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import Head from "next/head";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const { login, userId, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoading && userId) {
      router.replace("/dashboard");
    }
  }, [userId, isLoading, router]);

  if (isLoading || userId) return null;

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", { email, password });
      const { access_token } = response.data;
      if (access_token) {
        login(access_token);
      } else {
        setError("Credenciais inválidas");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.status === 401
            ? "Email ou senha incorretos"
            : "Erro ao tentar logar"
        );
      } else {
        setError("Erro ao tentar logar");
      }
    }
  }

  return (
    <>
      <Head>
        <title>Login - Effort Log</title>
      </Head>
      <div className="w-full px-4 py-10 flex justify-center">
        <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md space-y-4 text-center">
          <div className="flex justify-center items-center space-x-2">
            <Image src="/logo.png" alt="Logo" width={50} height={50} />
            <h1 className="text-2xl font-bold text-gray-800">Effort Log</h1>
          </div>

          <h2 className="text-xl font-semibold text-gray-700 mt-4">Login</h2>
          {error && <p className="text-red-500">{error}</p>}
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block mb-1 text-sm">Email</label>
              <input
                type="email"
                className="w-full border rounded p-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm">Senha</label>
              <input
                type="password"
                className="w-full border rounded p-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
            >
              Entrar
            </button>
          </form>
          <p className="text-sm text-gray-600">
            Não tem conta?{" "}
            <a href="/register" className="text-blue-500 hover:underline">
              Cadastre-se
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
