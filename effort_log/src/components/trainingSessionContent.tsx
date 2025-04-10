/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import NewExerciseModal from "@/components/NewExerciseModal";
import NewSetModal from "@/components/NewSetModal";
import EditSetModal from "@/components/EditSetModal";
import EditExerciseModal from "@/components/EditExerciseModal";
import FinalizeTrainingModal from "@/components/FinalizeTrainingModal";
import {
  PencilLine,
  Trash2,
  CopyPlus,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  PlusCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import duration from "dayjs/plugin/duration";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);

export default function TrainingSessionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("id");
  const { userId, isLoading } = useAuth();

  const [session, setSession] = useState<any>(null);
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [showSetModal, setShowSetModal] = useState(false);
  const [showEditSetModal, setShowEditSetModal] = useState(false);
  const [showEditExerciseModal, setShowEditExerciseModal] = useState(false);
  const [currentExerciseId, setCurrentExerciseId] = useState<string | null>(
    null
  );
  const [currentExerciseData, setCurrentExerciseData] = useState<any>(null);
  const [currentSet, setCurrentSet] = useState<any>(null);
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [collapsed, setCollapsed] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (!isLoading && (!sessionId || !userId)) {
      router.replace("/dashboard");
      return;
    }

    const fetchData = async () => {
      try {
        const sessionRes = await api.get(`/training-sessions/${sessionId}`);
        setSession(sessionRes.data);

        const exercisesRes = await api.get("/training-exercises", {
          params: { session_id: sessionId, include_sets: true },
        });
        setExercises(exercisesRes.data);
      } catch (err) {
        console.error(err);
        toast.error("Erro ao carregar o treino.");
        router.replace("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (userId && sessionId) fetchData();
  }, [sessionId, userId, isLoading]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (session) {
        const now = dayjs().tz("America/Sao_Paulo");
        const start = dayjs(session.start_datetime).tz("America/Sao_Paulo");
        setDurationSeconds(now.diff(start, "second"));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [session]);

  const toggleCollapse = (id: string) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const deleteExercise = async (id: string) => {
    await api.delete(`/training-exercises/${id}`);
    setExercises((prev) => prev.filter((ex) => ex.id !== id));
  };

  const deleteSet = async (setId: string, exId: string) => {
    await api.delete(`/sets/${setId}`);
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === exId
          ? { ...ex, sets: ex.sets.filter((s: any) => s.id !== setId) }
          : ex
      )
    );
  };

  const duplicateSet = async (exId: string, setData: any) => {
    const newSet = await api.post("/sets", {
      training_exercise_id: exId,
      number: (exercises.find((e) => e.id === exId)?.sets?.length || 0) + 1,
      weight_kg: setData.weight_kg,
      repetitions: setData.repetitions,
      rest_time: setData.rest_time,
    });
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === exId ? { ...ex, sets: [...ex.sets, newSet.data] } : ex
      )
    );
  };

  if (loading || !sessionId || !userId)
    return <p className="p-4">Carregando treino...</p>;

  return (
    <ProtectedRoute>
      <div className="w-full px-4 pt-4 pb-28 max-w-5xl mx-auto">
        <div className="flex justify-between items-center w-full mb-4">
          <span className="text-sm sm:text-base text-gray-700 font-medium">
            Tempo decorrido:{" "}
            {dayjs.duration(durationSeconds, "seconds").format("HH:mm:ss")}
          </span>
          {session.status !== "FINISHED" && (
            <button
              onClick={() => setShowFinalizeModal(true)}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-full shadow"
            >
              <CheckCircle size={18} />
              Finalizar
            </button>
          )}
        </div>

        <div className="mb-4 text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-2">
            {session.name || "Treino"}
          </h1>
          <button
            onClick={() => setShowExerciseModal(true)}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2 rounded-full shadow mx-auto"
          >
            <PlusCircle size={18} />
            Adicionar Exercício
          </button>
        </div>

        <div className="space-y-4">
          {exercises.map((exercise) => (
            <div key={exercise.id} className="bg-white p-4 rounded-xl shadow">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">{exercise.name}</h2>
                  <p className="text-sm text-gray-500">
                    Tipo: {exercise.exercise_type}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleCollapse(exercise.id)}
                    className="p-2 rounded-full hover:bg-gray-100"
                    title="Expandir/recolher"
                  >
                    {collapsed[exercise.id] ? (
                      <ChevronDown size={20} />
                    ) : (
                      <ChevronUp size={20} />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setCurrentExerciseData(exercise);
                      setCurrentExerciseId(exercise.id);
                      setShowEditExerciseModal(true);
                    }}
                    className="p-2 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                    title="Editar exercício"
                  >
                    <PencilLine size={20} />
                  </button>
                  <button
                    onClick={() => deleteExercise(exercise.id)}
                    className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                    title="Excluir exercício"
                  >
                    <Trash2 size={20} />
                  </button>
                  <button
                    onClick={() => {
                      setCurrentExerciseId(exercise.id);
                      setShowSetModal(true);
                    }}
                    className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                    title="Adicionar série"
                  >
                    <CopyPlus size={20} />
                  </button>
                </div>
              </div>

              {!collapsed[exercise.id] && (
                <div className="mt-4 space-y-2">
                  {exercise.sets?.length > 0 ? (
                    exercise.sets.map((set: any) => (
                      <div
                        key={set.id}
                        className="p-3 border rounded bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between"
                      >
                        <p className="text-sm">
                          Série {set.number}: {set.weight_kg}kg,{" "}
                          {set.repetitions} reps, {set.rest_time || 0}s descanso
                        </p>
                        <div className="mt-2 sm:mt-0 flex gap-2 justify-end">
                          <button
                            onClick={() => {
                              setCurrentSet(set);
                              setCurrentExerciseId(exercise.id);
                              setShowEditSetModal(true);
                            }}
                            className="p-2 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                            title="Editar série"
                          >
                            <PencilLine size={18} />
                          </button>
                          <button
                            onClick={() => duplicateSet(exercise.id, set)}
                            className="p-2 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200"
                            title="Duplicar série"
                          >
                            <CopyPlus size={18} />
                          </button>
                          <button
                            onClick={() => deleteSet(set.id, exercise.id)}
                            className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                            title="Excluir série"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      Nenhuma série cadastrada.
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Modais */}
        {showExerciseModal && sessionId && (
          <NewExerciseModal
            sessionId={sessionId}
            onClose={() => setShowExerciseModal(false)}
            onExerciseAdded={(newExercise) =>
              setExercises((prev) => [...prev, newExercise])
            }
          />
        )}
        {showSetModal && currentExerciseId && (
          <NewSetModal
            trainingExerciseId={currentExerciseId}
            nextSetNumber={
              (exercises.find((ex) => ex.id === currentExerciseId)?.sets
                ?.length || 0) + 1
            }
            onClose={() => setShowSetModal(false)}
            onSetAdded={(newSet) =>
              setExercises((prev) =>
                prev.map((ex) =>
                  ex.id === currentExerciseId
                    ? { ...ex, sets: [...(ex.sets || []), newSet] }
                    : ex
                )
              )
            }
          />
        )}
        {showEditSetModal && currentExerciseId && currentSet && (
          <EditSetModal
            trainingExerciseId={currentExerciseId}
            setData={currentSet}
            onClose={() => setShowEditSetModal(false)}
            onSetUpdated={(updatedSet) =>
              setExercises((prev) =>
                prev.map((ex) =>
                  ex.id === currentExerciseId
                    ? {
                        ...ex,
                        sets: ex.sets.map((s: any) =>
                          s.id === updatedSet.id ? updatedSet : s
                        ),
                      }
                    : ex
                )
              )
            }
          />
        )}
        {showEditExerciseModal && currentExerciseData && (
          <EditExerciseModal
            exerciseData={currentExerciseData}
            onClose={() => setShowEditExerciseModal(false)}
            onExerciseUpdated={(updatedExercise) =>
              setExercises((prev) =>
                prev.map((ex) =>
                  ex.id === updatedExercise.id ? updatedExercise : ex
                )
              )
            }
          />
        )}
        {showFinalizeModal && session && (
          <FinalizeTrainingModal
            exerciseCount={exercises.length}
            totalDuration={Math.round(durationSeconds / 60)}
            onFinalize={async (caloriesBurned) => {
              const now = dayjs().tz("America/Sao_Paulo");
              const start = dayjs(session.start_datetime).tz(
                "America/Sao_Paulo"
              );
              const duration = Math.round(now.diff(start, "minute"));

              api
                .patch(`/training-sessions/${sessionId}`, {
                  status: "FINISHED",
                  end_datetime: now.toISOString(),
                  duration,
                  calories_burned: caloriesBurned ?? 0, // usa 0 se for null
                })
                .then(() => {
                  toast.success("Treino finalizado com sucesso!");
                  router.push("/dashboard");
                })
                .catch(() => {
                  toast.error("Erro ao finalizar treino.");
                });
            }}
            onClose={() => setShowFinalizeModal(false)}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
