/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/training-session/ExerciseList.tsx
"use client";

import { useState } from "react";
import {
  PencilLine,
  Trash2,
  CopyPlus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface ExerciseListProps {
  exercises: any[];
  setExercises: (fn: (prev: any[]) => any[]) => void;
  onEditSet: (set: any, exerciseId: string) => void;
  onDuplicateSet: (exerciseId: string, setData: any) => void;
  onDeleteSet: (setId: string, exerciseId: string) => void;
  onDeleteExercise: (exerciseId: string) => void;
  onEditExercise: (exercise: any) => void;
  onAddSet: (exerciseId: string) => void;
}

export default function ExerciseList({
  exercises,
  setExercises,
  onEditSet,
  onDuplicateSet,
  onDeleteSet,
  onDeleteExercise,
  onEditExercise,
  onAddSet,
}: ExerciseListProps) {
  const [collapsed, setCollapsed] = useState<{ [key: string]: boolean }>({});

  const toggleCollapse = (id: string) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-4">
      {exercises.map((exercise) => (
        <div key={exercise.id} className="bg-white p-4 rounded-xl shadow">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">{exercise.name}</h2>
              <p className="text-sm text-gray-500">
                Tipo:{" "}
                {exercise.exercise_type === "STRENGTH"
                  ? "Musculação"
                  : "Cardio"}
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
                onClick={() => onEditExercise(exercise)}
                className="p-2 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                title="Editar exercício"
              >
                <PencilLine size={20} />
              </button>
              <button
                onClick={() => {
                  if (
                    confirm(
                      "Tem certeza que deseja excluir este exercício e todas as séries?"
                    )
                  ) {
                    onDeleteExercise(exercise.id);
                  }
                }}
                className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                title="Excluir exercício"
              >
                <Trash2 size={20} />
              </button>
              {exercise.exercise_type !== "CARDIO" && (
                <button
                  onClick={() => onAddSet(exercise.id)}
                  className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                  title="Adicionar série"
                >
                  <CopyPlus size={20} />
                </button>
              )}
            </div>
          </div>

          {!collapsed[exercise.id] && (
            <div className="mt-4 space-y-2">
              {exercise.exercise_type === "CARDIO" ? (
                <p className="text-sm text-gray-600">
                  Duração:{" "}
                  {exercise.duration ? `${exercise.duration} min` : "-"}
                </p>
              ) : exercise.sets?.length > 0 ? (
                exercise.sets.map((set: any) => (
                  <div
                    key={set.id}
                    className="p-3 border rounded bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between"
                  >
                    <p className="text-sm">
                      Série {set.number}: {set.weight_kg}kg, {set.repetitions}{" "}
                      reps, {set.rest_time || 0}s descanso
                    </p>
                    <div className="mt-2 sm:mt-0 flex gap-2 justify-end">
                      <button
                        onClick={() => onEditSet(set, exercise.id)}
                        className="p-2 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                        title="Editar série"
                      >
                        <PencilLine size={18} />
                      </button>
                      <button
                        onClick={() => onDuplicateSet(exercise.id, set)}
                        className="p-2 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200"
                        title="Duplicar série"
                      >
                        <CopyPlus size={18} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Deseja realmente excluir esta série?")) {
                            onDeleteSet(set.id, exercise.id);
                          }
                        }}
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
  );
}
