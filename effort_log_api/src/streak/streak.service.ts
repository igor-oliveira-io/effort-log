// src/streak/streak.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SetStreakMetaDto } from './dto/set-streak-meta.dto';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as isoWeek from 'dayjs/plugin/isoWeek';
import * as timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(isoWeek);
dayjs.extend(timezone);

@Injectable()
export class StreakService {
  constructor(private readonly prisma: PrismaService) {}

  async hasWeeklyGoal(userId: string): Promise<boolean> {
    const streak = await this.prisma.userStreak.findUnique({
      where: { user_id: userId },
      select: { weekly_goal: true },
    });

    return !!(streak && streak.weekly_goal > 0);
  }

  private getStartOfWeek(date: string): Date {
    return dayjs(date).startOf('isoWeek').toDate();
  }

  async getStreak(userId: string) {
    return this.prisma.userStreak.findUnique({
      where: { user_id: userId },
    });
  }

  getCurrentWeekStart(): Date {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - ((dayOfWeek + 6) % 7);
    const monday = new Date(now.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
  }

  async setWeeklyGoal(dto: SetStreakMetaDto) {
    return this.prisma.userStreak.upsert({
      where: { user_id: dto.user_id },
      update: { weekly_goal: dto.weekly_goal },
      create: {
        user_id: dto.user_id,
        weekly_goal: dto.weekly_goal,
        week_start: this.getStartOfWeek(new Date().toISOString()),
      },
    });
  }

  async registerDay(userId: string, dateStr: string) {
    // Converte para início do dia no fuso de SP
    const date = dayjs
      .utc(dateStr)
      .tz('America/Sao_Paulo')
      .startOf('day')
      .toDate();

    let userStreak = await this.prisma.userStreak.findUnique({
      where: { user_id: userId },
    });

    if (!userStreak) {
      throw new Error('Meta semanal não definida.');
    }

    const currentWeekStart = this.getCurrentWeekStart();

    if (userStreak.week_start.getTime() !== currentWeekStart.getTime()) {
      const previousWeekStart = new Date(userStreak.week_start);
      const previousWeekEnd = new Date(previousWeekStart);
      previousWeekEnd.setDate(previousWeekEnd.getDate() + 6);

      const activitiesLastWeek = await this.prisma.streakActivity.findMany({
        where: {
          user_id: userId,
          date: {
            gte: previousWeekStart,
            lte: previousWeekEnd,
          },
        },
      });

      const hitGoalLastWeek =
        activitiesLastWeek.length >= userStreak.weekly_goal;

      await this.prisma.userStreak.update({
        where: { user_id: userId },
        data: {
          week_start: currentWeekStart,
          days_count: 0,
          streak_count: hitGoalLastWeek ? userStreak.streak_count : 0,
        },
      });

      userStreak = await this.prisma.userStreak.findUnique({
        where: { user_id: userId },
      });

      if (!userStreak) {
        throw new Error('Erro ao recarregar dados do streak.');
      }
    }

    const existing = await this.prisma.streakActivity.findFirst({
      where: {
        user_id: userId,
        date,
      },
    });

    if (existing) {
      return { message: 'Atividade já registrada nesse dia' };
    }

    await this.prisma.streakActivity.create({
      data: {
        user_id: userId,
        date,
      },
    });

    const weekEnd = new Date(currentWeekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const activitiesThisWeek = await this.prisma.streakActivity.findMany({
      where: {
        user_id: userId,
        date: {
          gte: currentWeekStart,
          lte: weekEnd,
        },
      },
    });

    const updatedDaysCount = activitiesThisWeek.length;

    const updatedStreak = await this.prisma.userStreak.update({
      where: { user_id: userId },
      data: {
        days_count: updatedDaysCount,
        streak_count: userStreak.streak_count + 1,
      },
    });

    return {
      message: 'Dia registrado com sucesso',
      days_count: updatedDaysCount,
      streak_count: updatedStreak.streak_count,
    };
  }

  async createDefaultStreak(userId: string) {
    return this.prisma.userStreak.create({
      data: {
        user_id: userId,
        weekly_goal: 4,
        week_start: this.getStartOfWeek(new Date().toISOString()),
        days_count: 0,
        streak_count: 0,
      },
    });
  }
}
