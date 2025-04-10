import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TrainingSessionModule } from './training_session/training_session.module';
import { TrainingExerciseModule } from './training_exercise/training_exercise.module';
import { SetModule } from './set/set.module';
import { AuthModule } from './auth/auth.module';
import { StreakModule } from './streak/streak.module';

@Module({
  imports: [
    UsersModule,
    TrainingSessionModule,
    TrainingExerciseModule,
    SetModule,
    AuthModule,
    StreakModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
