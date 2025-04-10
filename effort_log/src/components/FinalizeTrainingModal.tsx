/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { CheckCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { toast } from "react-toastify";

interface FinalizeTrainingModalProps {
  exerciseCount: number;
  totalDuration: number;
  onFinalize: (calories: number | null) => Promise<void>;
  onClose: () => void;
}

export default function FinalizeTrainingModal({
  exerciseCount,
  totalDuration,
  onFinalize,
  onClose,
}: FinalizeTrainingModalProps) {
  const { userId } = useAuth();
  const [calories, setCalories] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsedCalories = calories.trim() === "" ? null : parseFloat(calories);

    try {
      const today = new Date().toISOString().split("T")[0];
      await api.post("/streak/register-activity", {
        userId,
        date: today,
      });

      await onFinalize(parsedCalories);
      onClose();
    } catch (err) {
      toast.error("Erro ao finalizar treino.");
    }
  }

  return (
    <Transition appear show as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-[999]"
        onClose={onClose}
      >
        <div className="flex min-h-screen items-center justify-center px-4">
          {/* Backdrop */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
            leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-30" />
          </Transition.Child>

          {/* Modal */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
            leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
          >
            <div className="z-[1000] inline-block w-full max-w-md p-6 my-8 align-middle bg-white rounded-2xl shadow-xl text-center space-y-4">
              <div className="flex flex-col items-center">
                <CheckCircle size={48} className="text-green-500 mb-2" />
                <h3 className="text-2xl font-bold text-gray-800">Parabéns pelo treino!</h3>
                <p className="text-gray-600 text-sm">
                  Você completou <strong>{exerciseCount}</strong> exercício(s) em <strong>{totalDuration} minutos</strong>.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="text-left">
                  <label htmlFor="calories" className="block text-sm font-medium text-gray-700 mb-1">
                    Calorias queimadas (opcional):
                  </label>
                  <input
                    id="calories"
                    type="number"
                    min="0"
                    step="any"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    placeholder="Ex: 450"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring focus:ring-green-200"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full font-semibold shadow"
                  >
                    Finalizar Treino
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
