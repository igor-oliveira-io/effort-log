/* eslint-disable @typescript-eslint/no-explicit-any */
// components/EditExerciseModal.tsx
"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import api from "@/lib/api";
import { toast } from "react-toastify";
import { PencilLine } from "lucide-react";

interface EditExerciseModalProps {
  exerciseData: any;
  onClose: () => void;
  onExerciseUpdated: (updated: any) => void;
}

export default function EditExerciseModal({
  exerciseData,
  onClose,
  onExerciseUpdated,
}: EditExerciseModalProps) {
  const [name, setName] = useState(exerciseData.name || "");
  const [duration, setDuration] = useState(exerciseData.duration || "");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const payload: any = {
        name,
      };

      if (exerciseData.exercise_type === "CARDIO") {
        payload.duration = Number(duration);
      }

      const res = await api.patch(
        `/training-exercises/${exerciseData.id}`,
        payload
      );
      onExerciseUpdated(res.data);
      toast.success("Exercício atualizado com sucesso!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao atualizar exercício.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition appear show as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 flex items-center gap-2"
                >
                  <PencilLine size={20} /> Editar Exercício
                </Dialog.Title>

                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nome do exercício
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                    />
                  </div>

                  {exerciseData.exercise_type === "CARDIO" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Duração (minutos)
                      </label>
                      <input
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        min={1}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                      />
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end gap-2">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    onClick={onClose}
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    onClick={handleUpdate}
                    disabled={loading}
                  >
                    {loading ? "Salvando..." : "Salvar"}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
