"use client";

import { Suspense } from "react";
import TrainingSessionContent from "@/components/trainingSessionContent";

export default function TrainingSessionPage() {
  return (
    <Suspense fallback={<div>Carregando treino...</div>}>
      <TrainingSessionContent />
    </Suspense>
  );
}
