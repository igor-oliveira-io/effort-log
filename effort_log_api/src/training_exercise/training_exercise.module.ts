import { Module } from '@nestjs/common';
import { TrainingExerciseService } from './training_exercise.service';
import { TrainingExerciseController } from './training_exercise.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [TrainingExerciseController],
  providers: [TrainingExerciseService, PrismaService],
})
export class TrainingExerciseModule {}
