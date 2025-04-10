/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Flame, PlusCircle, List, Pencil, Dumbbell, Trophy } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import UpdateWeeklyGoalModal from '@/components/UpdateWeeklyGoalModal';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export default function DashboardPage() {
  const { userId } = useAuth();
  const router = useRouter();

  const [userName, setUserName] = useState('');
  const [weeklyGoal, setWeeklyGoal] = useState(0);
  const [weekCount, setWeekCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const [activeSession, setActiveSession] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!userId) return;

        const [streakRes, userRes, activeSessionRes] = await Promise.all([
          api.get(`/streak/${userId}`),
          api.get(`/users/${userId}`),
          api.get('/training-sessions/active-session'),
        ]);

        setUserName(userRes.data.name || '');
        setStreak(streakRes.data.streak_count || 0);
        setWeeklyGoal(streakRes.data.weekly_goal || 1);
        setWeekCount(streakRes.data.days_count || 0);
        setActiveSession(activeSessionRes.data || null);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        toast.error('Erro ao carregar informações do dashboard.');
      }
    }

    fetchData();
  }, [userId]);

  const progress = Math.min((weekCount / weeklyGoal) * 100, 100);

  const calculateElapsedTime = (startTime: string) => {
    const now = dayjs();
    const start = dayjs(startTime);
    const diff = dayjs.duration(now.diff(start));
    const hours = diff.hours().toString().padStart(2, '0');
    const minutes = diff.minutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const hasExceededGoal = weekCount > weeklyGoal;

  return (
    <div className="flex flex-col items-center justify-center px-4 py-8 text-center w-full">
      <div className="w-full max-w-2xl space-y-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Olá, {userName || 'usuário'} 👋
        </h1>

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
              <Flame className="w-8 h-8 text-orange-500" />
              <p className="text-2xl font-bold text-gray-800">{streak} dias</p>
            </div>
            <p className="text-sm text-gray-500">
              {weekCount} de {weeklyGoal} dias ativos essa semana
            </p>
          </div>

          <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Card: superou a meta semanal */}
        {hasExceededGoal && (
          <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-2xl shadow space-y-3 text-left">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-green-700 flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Você superou sua meta semanal! 💪
              </h2>
            </div>
            <p className="text-sm text-green-700">
              Incrível! Que tal aumentar sua meta para continuar se desafiando?
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-xl shadow transition"
            >
              Aumentar meta
            </button>
          </div>
        )}

        {/* Card de treino ativo */}
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
              Nome: <span className="font-medium">{activeSession.name || 'Treino sem nome'}</span>
            </p>
            <button
              onClick={() => router.push(`/training-session?id=${activeSession.id}`)}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-xl shadow transition"
            >
              Continuar treino
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => router.push('/new-training')}
            className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-full font-semibold shadow"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Novo Treino</span>
          </button>
          <button
            onClick={() => router.push('/training-sessions')}
            className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-full font-semibold shadow"
          >
            <List className="w-5 h-5" />
            <span>Ver Treinos</span>
          </button>
        </div>
      </div>

      {showModal && userId && (
        <UpdateWeeklyGoalModal
          isOpen={true}
          currentGoal={weeklyGoal}
          userId={userId}
          onClose={() => setShowModal(false)}
          onUpdate={(newGoal) => {
            setWeeklyGoal(newGoal);
            toast.success('Meta semanal atualizada!');
          }}
        />
      )}
    </div>
  );
}
