/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import api from "@/lib/api";
import { toast } from "react-toastify";

interface UpdateWeeklyGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  currentGoal: number;
  onUpdate: (newGoal: number) => void;
}

export default function UpdateWeeklyGoalModal({
  isOpen,
  onClose,
  userId,
  currentGoal,
  onUpdate,
}: UpdateWeeklyGoalModalProps) {
  const [goal, setGoal] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setGoal(currentGoal);
  }, [currentGoal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (goal === '' || goal < 1 || goal > 7) {
      toast.error("A meta deve ser entre 1 e 7 dias por semana.");
      return;
    }

    try {
      setLoading(true);
      await api.post("/streak/set-weekly-goal", {
        user_id: userId,
        weekly_goal: goal,
      });
      toast.success("Meta semanal atualizada com sucesso!");
      onUpdate(goal);
      onClose();
    } catch (err) {
      toast.error("Erro ao atualizar meta semanal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
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
              <Dialog.Title as="h3" className="text-lg font-bold text-gray-800">
                Atualizar Meta Semanal
              </Dialog.Title>

              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div>
                  <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-1">
                    Quantidade de dias por semana (1 a 7)
                  </label>
                  <input
                    id="goal"
                    type="number"
                    min={1}
                    max={7}
                    value={goal}
                    onFocus={(e) => e.target.value === "0" && (e.target.value = "")}
                    onChange={(e) =>
                      setGoal(e.target.value === '' ? '' : Number(e.target.value))
                    }
                    placeholder="Ex: 4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold disabled:opacity-50"
                  >
                    {loading ? "Salvando..." : "Salvar"}
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
