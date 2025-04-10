import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateTrainingExerciseDto } from './dto/create-training-exercise.dto';
import { UpdateTrainingExerciseDto } from './dto/update-training-exercise.dto';
import { TrainingExercise } from '@prisma/client';
import { FilterTrainingExerciseDto } from './dto/filter-training-exercise.dto';

@Injectable()
export class TrainingExerciseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateTrainingExerciseDto): Promise<TrainingExercise> {
    return await this.prisma.trainingExercise.create({
      data: {
        session_id: data.session_id,
        exercise_id: data.exercise_id,
        name: data.name,
        exercise_type: data.exercise_type,
        total_sets: data.total_sets,
        duration: data.duration,
      },
    });
  }

  async findAll(
    params: FilterTrainingExerciseDto,
  ): Promise<TrainingExercise[]> {
    const { session_id } = params;
    const where = session_id ? { session_id } : {};
    return await this.prisma.trainingExercise.findMany({
      where,
      include: { sets: true },
    });
  }

  async findOne(id: string): Promise<TrainingExercise | null> {
    return await this.prisma.trainingExercise.findUnique({
      where: { id },
    });
  }

  async update(
    id: string,
    data: UpdateTrainingExerciseDto,
  ): Promise<TrainingExercise> {
    return await this.prisma.trainingExercise.update({
      where: { id },
      data: {
        session_id: data.session_id,
        exercise_id: data.exercise_id,
        name: data.name,
        exercise_type: data.exercise_type,
        total_sets: data.total_sets,
        duration: data.duration,
      },
    });
  }

  async remove(id: string): Promise<TrainingExercise> {
    return await this.prisma.trainingExercise.delete({
      where: { id },
    });
  }
}
