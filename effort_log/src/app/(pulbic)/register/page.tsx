"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import Head from "next/head";
import axios from "axios";
import Image from "next/image";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    birth_date: "",
    weight: "",
    height: "",
    role: "USER",
    avatar_url: "",
  });
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const payload = {
        ...form,
        weight: parseFloat(form.weight),
        height: parseFloat(form.height),
      };

      await api.post("/auth/register", payload);
      router.push("/login");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message;
        setError(
          Array.isArray(message)
            ? message.join(", ")
            : message || "Erro ao cadastrar"
        );
      } else {
        setError("Erro inesperado ao cadastrar.");
      }
    }
  }

  return (
    <>
      <Head>
        <title>Cadastro - Effort Log</title>
      </Head>
      <div className="w-full px-4 py-10 flex justify-center">
        <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md space-y-4 text-center">
          <div className="flex justify-center items-center space-x-2">
            <Image src="/logo.png" alt="Logo" width={50} height={50} />
            <h1 className="text-2xl font-bold text-gray-800">Effort Log</h1>
          </div>

          <h2 className="text-xl font-semibold text-gray-700 mt-4">Cadastro</h2>
          {error && <p className="text-red-500">{error}</p>}

          <form onSubmit={handleRegister} className="space-y-4 text-left">
            <input
              name="name"
              placeholder="Nome"
              className="w-full border rounded p-2"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="w-full border rounded p-2"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Senha"
              className="w-full border rounded p-2"
              value={form.password}
              onChange={handleChange}
              required
            />
            <input
              name="birth_date"
              type="date"
              className="w-full border rounded p-2"
              value={form.birth_date}
              onChange={handleChange}
              required
            />
            <input
              name="weight"
              type="number"
              step="0.1"
              placeholder="Peso (kg)"
              className="w-full border rounded p-2"
              value={form.weight}
              onChange={handleChange}
              required
            />
            <input
              name="height"
              type="number"
              step="0.01"
              placeholder="Altura (m)"
              className="w-full border rounded p-2"
              value={form.height}
              onChange={handleChange}
              required
            />
            <button
              type="submit"
              className="w-full bg-green-500 text-white rounded p-2 hover:bg-green-600"
            >
              Cadastrar
            </button>
          </form>
          <p className="text-sm text-gray-600">
            Já tem conta?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Faça login
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
