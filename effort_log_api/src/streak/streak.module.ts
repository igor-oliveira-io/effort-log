// src/streak/streak.module.ts
import { Module } from '@nestjs/common';
import { StreakService } from './streak.service';
import { StreakController } from './streak.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [StreakController],
  providers: [StreakService, PrismaService],
  exports: [StreakService],
})
export class StreakModule {}
