/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import api from "@/lib/api";

interface NewExerciseModalProps {
  sessionId: string | null;
  onClose: () => void;
  onExerciseAdded: (exercise: any) => void;
}

export default function NewExerciseModal({
  sessionId,
  onClose,
  onExerciseAdded,
}: NewExerciseModalProps) {
  const [exerciseName, setExerciseName] = useState("");
  const [exerciseType, setExerciseType] = useState("STRENGTH");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const payload = {
        session_id: sessionId,
        name: exerciseName,
        exercise_type: exerciseType,
      };
      const response = await api.post("/training-exercises", payload);
      onExerciseAdded(response.data);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Erro ao adicionar exercício.");
    }
  }

  return (
    <Transition appear show as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={onClose}>
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          </Transition.Child>

          <span className="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <Dialog.Title
                as="h3"
                className="text-lg font-bold text-gray-800"
              >
                Adicionar Exercício
              </Dialog.Title>

              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                {error && <p className="text-red-500">{error}</p>}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Exercício
                  </label>
                  <input
                    type="text"
                    value={exerciseName}
                    onChange={(e) => setExerciseName(e.target.value)}
                    required
                    placeholder="Ex: Supino reto"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Exercício
                  </label>
                  <select
                    value={exerciseType}
                    onChange={(e) => setExerciseType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="STRENGTH">Musculação</option>
                    <option value="CARDIO">Aeróbico</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
                  >
                    Adicionar
                  </button>
                </div>
              </form>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
