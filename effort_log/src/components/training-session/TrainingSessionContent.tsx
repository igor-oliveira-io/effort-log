/* eslint-disable @typescript-eslint/no-explicit-any */
// components/training-session/TrainingSessionContent.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import duration from "dayjs/plugin/duration";

import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingSpinner from "@/components/LoadingSpinner";
import TrainingSessionHeader from "@/components/training-session/TrainingSessionHeader";
import ExerciseList from "@/components/training-session/ExerciseList";

import NewExerciseModal from "@/components/NewExerciseModal";
import NewSetModal from "@/components/NewSetModal";
import EditSetModal from "@/components/EditSetModal";
import EditExerciseModal from "@/components/EditExerciseModal";
import FinalizeTrainingModal from "@/components/FinalizeTrainingModal";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);

export default function TrainingSessionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("id");
  const { userId, isLoading } = useAuth();

  const [session, setSession] = useState<any>(null);
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [durationSeconds, setDurationSeconds] = useState(0);

  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [showSetModal, setShowSetModal] = useState(false);
  const [showEditSetModal, setShowEditSetModal] = useState(false);
  const [showEditExerciseModal, setShowEditExerciseModal] = useState(false);
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);

  const [currentExerciseId, setCurrentExerciseId] = useState<string | null>(
    null
  );
  const [currentExerciseData, setCurrentExerciseData] = useState<any>(null);
  const [currentSet, setCurrentSet] = useState<any>(null);

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

  const isCustomTime = session
    ? !dayjs(session.start_datetime).isSame(dayjs(), "day")
    : false;

  useEffect(() => {
    if (!session || isCustomTime) return;

    const interval = setInterval(() => {
      const now = dayjs().tz("America/Sao_Paulo");
      const start = dayjs(session.start_datetime).tz("America/Sao_Paulo");
      const diff = now.diff(start, "second");
      setDurationSeconds(Math.max(diff, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [session, isCustomTime]);

  if (loading || !sessionId || !userId) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="w-full px-4 pt-4 pb-28 max-w-5xl mx-auto">
        <TrainingSessionHeader
          session={session}
          durationSeconds={durationSeconds}
          onFinalize={() => setShowFinalizeModal(true)}
          onAddExercise={() => setShowExerciseModal(true)}
          isCustomTime={isCustomTime}
        />

        <ExerciseList
          exercises={exercises}
          setExercises={setExercises}
          onEditSet={(set, exerciseId) => {
            setCurrentSet(set);
            setCurrentExerciseId(exerciseId);
            setShowEditSetModal(true);
          }}
          onDuplicateSet={async (exerciseId, setData) => {
            const newSet = await api.post("/sets", {
              training_exercise_id: exerciseId,
              number:
                (exercises.find((e) => e.id === exerciseId)?.sets?.length ||
                  0) + 1,
              weight_kg: setData.weight_kg,
              repetitions: setData.repetitions,
              rest_time: setData.rest_time,
            });
            setExercises((prev) =>
              prev.map((ex) =>
                ex.id === exerciseId
                  ? { ...ex, sets: [...ex.sets, newSet.data] }
                  : ex
              )
            );
          }}
          onDeleteSet={async (setId, exId) => {
            await api.delete(`/sets/${setId}`);
            setExercises((prev) =>
              prev.map((ex) =>
                ex.id === exId
                  ? { ...ex, sets: ex.sets.filter((s: any) => s.id !== setId) }
                  : ex
              )
            );
          }}
          onDeleteExercise={async (id) => {
            await api.delete(`/training-exercises/${id}`);
            setExercises((prev) => prev.filter((ex) => ex.id !== id));
          }}
          onEditExercise={(exercise) => {
            setCurrentExerciseData(exercise);
            setCurrentExerciseId(exercise.id);
            setShowEditExerciseModal(true);
          }}
          onAddSet={(exId) => {
            setCurrentExerciseId(exId);
            setShowSetModal(true);
          }}
        />

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
                  calories_burned: caloriesBurned ?? 0,
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
