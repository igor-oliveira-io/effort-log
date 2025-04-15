"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import LoadingSpinner from "@/components/LoadingSpinner";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function NewTrainingPage() {
  const { userId } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [useCustomDate, setUseCustomDate] = useState(false);
  const now = dayjs().tz("America/Sao_Paulo");
  const [startDatetime, setStartDatetime] = useState(
    now.format("YYYY-MM-DDTHH:mm")
  );
  const [loading, setLoading] = useState(false);
  const [hasActiveSession, setHasActiveSession] = useState(false);
  const [checkingActiveSession, setCheckingActiveSession] = useState(true); // usado no spinner

  useEffect(() => {
    const checkActiveSession = async () => {
      try {
        const res = await api.get("/training-sessions/active-session");
        if (res.data) {
          setHasActiveSession(true);
        }
      } catch (error) {
        console.error("Erro ao verificar treino ativo", error);
      } finally {
        setCheckingActiveSession(false);
      }
    };

    checkActiveSession();
  }, []);

  const handleStart = async () => {
    if (!name || !userId) {
      toast.error("Preencha o nome do treino.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name,
        start_datetime: dayjs(startDatetime).utc().toISOString(),
        user_id: userId,
        status: "ACTIVE",
      };

      const response = await api.post("/training-sessions", payload);
      toast.success("Treino iniciado!");
      router.push(`/training-session?id=${response.data.id}`);
    } catch (error) {
      toast.error("Erro ao iniciar treino");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Exibe o Spinner enquanto checa sessão ativa
  if (checkingActiveSession) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center px-4 py-8 min-h-[calc(100vh-8rem)]">
      <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-xl space-y-6 sm:max-w-2xl">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Iniciar Novo Treino Ou Atividade Física
        </h1>

        {hasActiveSession && (
          <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 p-4 rounded-xl shadow text-center">
            <p>🚧 Você já tem um treino em andamento.</p>
            <p className="text-sm mt-1">
              Finalize o treino atual antes de iniciar um novo.
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Nome do Treino
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Treino de Pernas"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
              disabled={hasActiveSession}
            />
          </div>

          <div className="space-y-2">
            <label className="inline-flex items-center space-x-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={useCustomDate}
                onChange={(e) => setUseCustomDate(e.target.checked)}
                disabled={hasActiveSession}
              />
              <span>Data e horário personalizado</span>
            </label>

            {!useCustomDate ? (
              <p className="text-sm text-gray-500">
                Usando data/hora atual:{" "}
                <span className="font-semibold">
                  {now.format("DD/MM/YYYY, HH:mm:ss")}
                </span>
              </p>
            ) : (
              <input
                type="datetime-local"
                value={startDatetime}
                onChange={(e) => setStartDatetime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                disabled={hasActiveSession}
              />
            )}
          </div>
        </div>

        <button
          onClick={handleStart}
          disabled={loading || hasActiveSession}
          className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <PlusCircle size={20} />
          {loading ? "Iniciando..." : "Iniciar Treino"}
        </button>
      </div>
    </div>
  );
}
