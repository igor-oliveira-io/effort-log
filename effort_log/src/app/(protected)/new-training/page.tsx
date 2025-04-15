/* eslint-disable @typescript-eslint/no-explicit-any */
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

  const now = dayjs().tz("America/Sao_Paulo");
  const [name, setName] = useState("");
  const [useCustomTime, setUseCustomTime] = useState(false);
  const [customTime, setCustomTime] = useState(now.format("HH:mm"));
  const [customEndTime, setCustomEndTime] = useState(
    now.add(1, "hour").format("HH:mm")
  );
  const [loading, setLoading] = useState(false);
  const [hasActiveSession, setHasActiveSession] = useState(false);
  const [checkingActiveSession, setCheckingActiveSession] = useState(true);

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
      let start = now;
      let end = now;
      let status = "ACTIVE";
      let duration = null;

      if (useCustomTime) {
        const [startHour, startMinute] = customTime.split(":");
        const [endHour, endMinute] = customEndTime.split(":");

        start = now
          .hour(Number(startHour))
          .minute(Number(startMinute))
          .second(0);
        end = now.hour(Number(endHour)).minute(Number(endMinute)).second(0);

        if (end.isBefore(start)) {
          toast.error("O horário de término não pode ser anterior ao início.");
          setLoading(false);
          return;
        }

        status = "FINISHED";
        duration = end.diff(start, "minute");
      }

      const payload: any = {
        name,
        start_datetime: start.utc().toISOString(),
        user_id: userId,
        status,
      };

      if (status === "FINISHED") {
        payload.end_datetime = end.utc().toISOString();
        payload.duration = duration;
        payload.calories_burned = 0;
      }

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
                checked={useCustomTime}
                onChange={(e) => setUseCustomTime(e.target.checked)}
                disabled={hasActiveSession}
              />
              <span>Usar horário personalizado</span>
            </label>

            {useCustomTime && (
              <div className="space-y-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Horário de Início
                  </label>
                  <input
                    type="time"
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Horário de Término
                  </label>
                  <input
                    type="time"
                    value={customEndTime}
                    onChange={(e) => setCustomEndTime(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                  />
                </div>

                <p className="text-xs text-gray-500">
                  Esses horários serão considerados como parte do dia de hoje.
                  Treinos com horário personalizado serão salvos como
                  finalizados.
                </p>
              </div>
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
