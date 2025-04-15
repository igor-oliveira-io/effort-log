import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateTrainingSessionDto } from './dto/create-training-session.dto';
import { UpdateTrainingSessionDto } from './dto/update-training-session.dto';
import { TrainingSession } from '@prisma/client';
import { FilterTrainingSessionDto } from './dto/filter-training-session.dto';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

@Injectable()
export class TrainingSessionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateTrainingSessionDto): Promise<TrainingSession> {
    const activeSession = await this.findActiveSession(data.user_id);
    console.log('activeSession', activeSession);
    if (activeSession) {
      throw new BadRequestException('Você já tem um treino em andamento.');
    }
    console.log(data);
    return await this.prisma.trainingSession.create({
      data: {
        name: data.name,
        start_datetime: dayjs(data.start_datetime).utc().toDate(),
        end_datetime: data.end_datetime
          ? dayjs(data.end_datetime).utc().toDate()
          : null,
        duration: data.duration,
        notes: data.notes,
        user_id: data.user_id,
        workout_plan_id: data.workout_plan_id,
        calories_burned: data.calories_burned,
        status: data.status,
      },
    });
  }

  async findAll(params: FilterTrainingSessionDto) {
    const { user_id, page = 1, limit = 10 } = params;
    const where = user_id ? { user_id } : {};

    const [sessions, total] = await this.prisma.$transaction([
      this.prisma.trainingSession.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          start_datetime: 'desc',
        },
      }),
      this.prisma.trainingSession.count({ where }),
    ]);

    return {
      sessions,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }

  async findOne(id: string): Promise<TrainingSession | null> {
    return await this.prisma.trainingSession.findUnique({
      where: { id },
    });
  }

  async update(
    id: string,
    data: UpdateTrainingSessionDto,
  ): Promise<TrainingSession> {
    return await this.prisma.trainingSession.update({
      where: { id },
      data: {
        name: data.name,
        start_datetime: data.start_datetime
          ? dayjs(data.start_datetime).utc().toDate()
          : undefined,
        end_datetime: data.end_datetime
          ? dayjs(data.start_datetime).utc().toDate()
          : undefined,
        duration: data.duration,
        notes: data.notes,
        user_id: data.user_id,
        workout_plan_id: data.workout_plan_id,
        calories_burned: data.calories_burned,
        status: data.status,
      },
    });
  }

  async remove(id: string): Promise<TrainingSession> {
    const exercises = await this.prisma.trainingExercise.findMany({
      where: { session_id: id },
      select: { id: true },
    });

    const exerciseIds = exercises.map((e) => e.id);

    await this.prisma.set.deleteMany({
      where: { training_exercise_id: { in: exerciseIds } },
    });

    await this.prisma.trainingExercise.deleteMany({
      where: { session_id: id },
    });

    return await this.prisma.trainingSession.delete({
      where: { id },
    });
  }

  async findActiveSession(userId: string): Promise<TrainingSession | null> {
    return this.prisma.trainingSession.findFirst({
      where: {
        user_id: userId,
        end_datetime: null,
      },
      orderBy: { start_datetime: 'desc' },
    });
  }
}
