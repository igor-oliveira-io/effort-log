/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import api from "@/lib/api";

interface EditSetModalProps {
  trainingExerciseId: string;
  setData: any;
  onClose: () => void;
  onSetUpdated: (updatedSet: any) => void;
}

export default function EditSetModal({
  trainingExerciseId,
  setData,
  onClose,
  onSetUpdated,
}: EditSetModalProps) {
  const [weight, setWeight] = useState<number | ''>('');
  const [repetitions, setRepetitions] = useState<number | ''>('');
  const [restTime, setRestTime] = useState<number | ''>('');
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setWeight(setData.weight_kg ?? '');
    setRepetitions(setData.repetitions ?? '');
    setRestTime(setData.rest_time ?? '');
  }, [setData]);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();

    if (weight === '' || repetitions === '') {
      setError("Preencha os campos obrigatórios.");
      return;
    }

    try {
      const payload = {
        weight_kg: Number(weight),
        repetitions: Number(repetitions),
        rest_time: restTime !== '' ? Number(restTime) : 0,
      };
      const response = await api.patch(`/sets/${setData.id}`, payload);
      onSetUpdated(response.data);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Erro ao atualizar a série.");
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
                Editar Série #{setData.number}
              </Dialog.Title>

              <form onSubmit={handleUpdate} className="mt-4 space-y-4">
                {error && <p className="text-red-500">{error}</p>}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Peso (kg)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={weight}
                    onFocus={(e) => e.target.value === "0" && (e.target.value = "")}
                    onChange={(e) => setWeight(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Ex: 30"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Repetições
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={repetitions}
                    onFocus={(e) => e.target.value === "0" && (e.target.value = "")}
                    onChange={(e) => setRepetitions(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Ex: 12"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tempo de Descanso (s)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={restTime}
                    onFocus={(e) => e.target.value === "0" && (e.target.value = "")}
                    onChange={(e) => setRestTime(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Opcional"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
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
                    Salvar
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
