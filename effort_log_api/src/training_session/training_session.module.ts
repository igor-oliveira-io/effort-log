import { Module } from '@nestjs/common';
import { TrainingSessionService } from './training_session.service';
import { TrainingSessionController } from './training_session.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [TrainingSessionController],
  providers: [TrainingSessionService, PrismaService],
})
export class TrainingSessionModule {}
