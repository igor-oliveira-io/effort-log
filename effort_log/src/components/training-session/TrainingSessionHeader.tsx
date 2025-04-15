/* eslint-disable @typescript-eslint/no-explicit-any */
// components/training-session/TrainingSessionHeader.tsx
"use client";

import { CheckCircle, PlusCircle } from "lucide-react";
import Timer from "@/components/ui/Timer";
import { useRouter } from "next/navigation";

interface TrainingSessionHeaderProps {
  session: any;
  durationSeconds: number;
  onFinalize: () => void;
  onAddExercise: () => void;
  isCustomTime: boolean;
}

export default function TrainingSessionHeader({
  session,
  durationSeconds,
  onFinalize,
  onAddExercise,
  isCustomTime,
}: TrainingSessionHeaderProps) {
  const router = useRouter();
  return (
    <>
      <div className="flex justify-between items-center w-full mb-4">
        {session.status !== "FINISHED" && !isCustomTime ? (
          <Timer seconds={durationSeconds} />
        ) : (
          <button
            onClick={() => router.back()}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Voltar
          </button>
        )}
        {session.status !== "FINISHED" && (
          <button
            onClick={onFinalize}
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
          onClick={onAddExercise}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2 rounded-full shadow mx-auto"
        >
          <PlusCircle size={18} />
          Adicionar Exercício
        </button>
      </div>
    </>
  );
}
