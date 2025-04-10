/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Head from "next/head";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { PencilLine, Trash2 } from "lucide-react";

export default function TrainingSessionsPage() {
  const router = useRouter();
  const { userId } = useAuth();
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, error } = useQuery({
    queryKey: ["trainingSessions", userId, page],
    queryFn: async () => {
      const response = await api.get("/training-sessions", {
        params: {
          user_id: userId,
          page,
          limit: pageSize,
        },
      });
      return response.data;
    },
    enabled: !!userId,
  });

  const sessions = Array.isArray(data?.sessions) ? data.sessions : [];
  const totalPages = data?.totalPages || 1;

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este treino?")) return;
    try {
      await api.delete(`/training-sessions/${id}`);
      alert("Treino excluído com sucesso!");
      window.location.reload();
    } catch (error) {
      console.error("Erro ao excluir treino:", error);
      alert("Erro ao excluir treino.");
    }
  }

  return (
    <ProtectedRoute>
      <>
        <Head>
          <title>Treinos Realizados - Effort Log</title>
        </Head>
        <div className="flex flex-col items-center justify-center px-4 py-8 w-full">
          <div className="w-full max-w-screen-lg bg-white p-6 rounded-2xl shadow-xl space-y-6">
            <h1 className="text-3xl font-bold text-center">
              Treinos Realizados
            </h1>

            {isLoading ? (
              <p className="text-center text-gray-500">Carregando treinos...</p>
            ) : error ? (
              <p className="text-center text-red-500">
                Erro ao carregar treinos
              </p>
            ) : sessions.length === 0 ? (
              <p className="text-center text-gray-500">
                Nenhum treino encontrado.
              </p>
            ) : (
              <>
                {/* Tabela Desktop */}
                <div className="hidden md:block">
                  <table className="min-w-full bg-white shadow rounded-lg">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b text-left">Nome</th>
                        <th className="py-2 px-4 border-b text-left">Status</th>
                        <th className="py-2 px-4 border-b text-left">
                          Calorias
                        </th>
                        <th className="py-2 px-4 border-b text-left">
                          Duração
                        </th>
                        <th className="py-2 px-4 border-b text-left">Início</th>
                        <th className="py-2 px-4 border-b text-left">Final</th>
                        <th className="py-2 px-4 border-b text-center">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sessions.map((session: any) => (
                        <tr
                          key={session.id}
                          className="text-sm hover:bg-gray-50"
                        >
                          <td className="py-2 px-4 border-b">{session.name}</td>
                          <td className="py-2 px-4 border-b">
                            {session.status}
                          </td>
                          <td className="py-2 px-4 border-b">
                            {session.calories_burned || "-"}
                          </td>
                          <td className="py-2 px-4 border-b">
                            {session.duration ? `${session.duration} min` : "-"}
                          </td>
                          <td className="py-2 px-4 border-b">
                            {new Date(session.start_datetime).toLocaleString()}
                          </td>
                          <td className="py-2 px-4 border-b">
                            {session.end_datetime
                              ? new Date(session.end_datetime).toLocaleString()
                              : "-"}
                          </td>
                          <td className="py-2 px-4 border-b">
                            <div className="flex justify-center space-x-2">
                              <button
                                onClick={() =>
                                  router.push(
                                    `/training-session?id=${session.id}`
                                  )
                                }
                                className="text-blue-600 hover:text-blue-800"
                                title="Editar treino"
                              >
                                <PencilLine size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(session.id)}
                                className="text-red-600 hover:text-red-800"
                                title="Excluir treino"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Cards Mobile */}
                <div className="block md:hidden space-y-4">
                  {sessions.map((session: any) => (
                    <div
                      key={session.id}
                      className="bg-gray-50 border p-4 rounded-xl shadow"
                    >
                      <p>
                        <strong>Nome:</strong> {session.name}
                      </p>
                      <p>
                        <strong>Status:</strong> {session.status}
                      </p>
                      <p>
                        <strong>Calorias:</strong>{" "}
                        {session.calories_burned || "-"}
                      </p>
                      <p>
                        <strong>Duração:</strong>{" "}
                        {session.duration ? `${session.duration} min` : "-"}
                      </p>
                      <p>
                        <strong>Início:</strong>{" "}
                        {new Date(session.start_datetime).toLocaleString()}
                      </p>
                      <p>
                        <strong>Final:</strong>{" "}
                        {session.end_datetime
                          ? new Date(session.end_datetime).toLocaleString()
                          : "-"}
                      </p>

                      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-between">
                        <button
                          onClick={() =>
                            router.push(`/training-session?id=${session.id}`)
                          }
                          className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition"
                        >
                          <PencilLine size={16} />
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(session.id)}
                          className="flex items-center justify-center gap-2 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-xl transition"
                        >
                          <Trash2 size={16} />
                          Excluir
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Paginação */}
                <div className="flex justify-center mt-6 space-x-2">
                  <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-full font-medium transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ⬅ Anterior
                  </button>
                  <span className="px-4 py-2 text-sm text-gray-600 font-medium">
                    Página {page} de {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={page === totalPages}
                    className="px-4 py-2 rounded-full font-medium transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Próxima ➡
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </>
    </ProtectedRoute>
  );
}
