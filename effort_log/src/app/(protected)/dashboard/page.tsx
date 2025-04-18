/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Flame,
  PlusCircle,
  List,
  Pencil,
  Dumbbell,
  Trophy,
} from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import UpdateWeeklyGoalModal from "@/components/UpdateWeeklyGoalModal";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import LoadingSpinner from "@/components/LoadingSpinner";
import Confetti from "react-confetti";
import { motion } from "framer-motion";

dayjs.extend(duration);

export default function DashboardPage() {
  const { userId, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  const [userName, setUserName] = useState("");
  const [weeklyGoal, setWeeklyGoal] = useState(0);
  const [weekCount, setWeekCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [activeSession, setActiveSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCongrats, setShowCongrats] = useState(false);

  useEffect(() => {
    const shouldShow = sessionStorage.getItem("showCongrats");
    if (shouldShow === "true") {
      setShowCongrats(true);
      sessionStorage.removeItem("showCongrats");

      setTimeout(() => {
        setShowCongrats(false);
      }, 7000);
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (!userId) return;

      try {
        const [streakRes, userRes, activeSessionRes] = await Promise.all([
          api.get(`/streak/${userId}`),
          api.get(`/users/${userId}`),
          api.get("/training-sessions/active-session"),
        ]);

        setUserName(userRes.data.name || "");
        setStreak(streakRes.data.streak_count || 0);
        setWeeklyGoal(streakRes.data.weekly_goal || 1);
        setWeekCount(streakRes.data.days_count || 0);
        setActiveSession(activeSessionRes.data || null);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        toast.error("Erro ao carregar informações do dashboard.");
      } finally {
        setIsLoading(false);
      }
    }

    if (!isAuthLoading) {
      fetchData();
    }
  }, [userId, isAuthLoading]);

  const progressBar = Math.min((weekCount / weeklyGoal) * 100, 100);

  const calculateElapsedTime = (startTime: string) => {
    const now = dayjs();
    const start = dayjs(startTime);
    const diff = dayjs.duration(now.diff(start));
    const hours = diff.hours().toString().padStart(2, "0");
    const minutes = diff.minutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const hasExceededGoal = weekCount > weeklyGoal;

  return (
    <div className="flex flex-col items-center justify-center px-4 py-8 text-center w-full min-h-[calc(100vh-8rem)]">
      <div className="w-full max-w-2xl space-y-6">
        {isLoading || isAuthLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <h1 className="text-4xl font-bold text-gray-800">
              Olá, {userName || "usuário"} 👋
            </h1>

            {showCongrats && (
              <>
                <Confetti
                  width={
                    typeof window !== "undefined" ? window.innerWidth : 300
                  }
                  height={
                    typeof window !== "undefined" ? window.innerHeight : 300
                  }
                  numberOfPieces={250}
                  recycle={false}
                  run={true}
                />
                <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-xl shadow text-left space-y-2 transition-opacity duration-500">
                  <div className="flex items-center gap-3">
                    <span className="text-green-600 text-2xl">🎉</span>
                    <div>
                      <p className="text-sm text-green-800 font-semibold">
                        Parabéns pelo treino!
                      </p>
                      <p className="text-xs text-green-700">
                        Continue se esforçando e registre sua evolução 💪
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-green-500"
                      initial={{ width: "100%" }}
                      animate={{ width: "0%" }}
                      transition={{ duration: 7, ease: "linear" }}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                  <Flame className="text-orange-500 w-5 h-5" />
                  Streak Atual
                </h2>
                <button
                  onClick={() => setShowModal(true)}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <Pencil size={16} />
                  Alterar meta
                </button>
              </div>

              <div className="text-center space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.6,
                      ease: "easeInOut",
                    }}
                  >
                    <Flame className="w-8 h-8 text-orange-500" />
                  </motion.div>
                  <p className="text-2xl font-bold text-gray-800">
                    {streak} dias
                  </p>
                </div>
                <p className="text-sm text-gray-500">
                  {weekCount} de {weeklyGoal} dias ativos essa semana
                </p>
              </div>

              <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 transition-all duration-500"
                  style={{ width: `${progressBar}%` }}
                />
              </div>
            </div>

            {hasExceededGoal && (
              <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-2xl shadow space-y-3 text-left">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-green-700 flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Você superou sua meta semanal! 💪
                  </h2>
                </div>
                <p className="text-sm text-green-700">
                  Incrível! Que tal aumentar sua meta para continuar se
                  desafiando?
                </p>
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-xl shadow transition"
                >
                  Aumentar meta
                </button>
              </div>
            )}

            {activeSession && (
              <div className="bg-white border-l-4 border-green-500 p-6 rounded-2xl shadow space-y-3 text-left">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Dumbbell className="w-5 h-5 text-green-500" />
                    Treino em andamento
                  </h2>
                  <span className="text-sm text-gray-500">
                    ⏱ {calculateElapsedTime(activeSession.start_datetime)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Nome:{" "}
                  <span className="font-medium">
                    {activeSession.name || "Treino sem nome"}
                  </span>
                </p>
                <button
                  onClick={() =>
                    router.push(`/training-session?id=${activeSession.id}`)
                  }
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-xl shadow transition"
                >
                  Continuar treino
                </button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => router.push("/new-training")}
                className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-full font-semibold shadow"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Novo Treino</span>
              </button>
              <button
                onClick={() => router.push("/training-sessions")}
                className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-full font-semibold shadow"
              >
                <List className="w-5 h-5" />
                <span>Ver Treinos</span>
              </button>
            </div>
          </>
        )}
      </div>

      {showModal && userId && (
        <UpdateWeeklyGoalModal
          isOpen={true}
          currentGoal={weeklyGoal}
          userId={userId}
          onClose={() => setShowModal(false)}
          onUpdate={(newGoal) => {
            setWeeklyGoal(newGoal);
            toast.success("Meta semanal atualizada!");
          }}
        />
      )}
    </div>
  );
}
