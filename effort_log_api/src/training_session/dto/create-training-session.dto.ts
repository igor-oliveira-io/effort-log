import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { TrainingStatus } from '@prisma/client';

export class CreateTrainingSessionDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name?: string;

  @IsNotEmpty({ message: 'start_datetime is required' })
  @IsDateString(
    {},
    { message: 'start_datetime must be a valid ISO date string' },
  )
  start_datetime: Date | string;

  @IsOptional()
  @IsDateString({}, { message: 'end_datetime must be a valid ISO date string' })
  end_datetime?: Date | string | null;

  @IsOptional()
  @IsNumber({}, { message: 'Duration must be a number' })
  duration?: number;

  @IsOptional()
  @IsString({ message: 'Notes must be a string' })
  notes?: string;

  @IsNotEmpty({ message: 'User id is required' })
  @IsString({ message: 'User id must be a string' })
  user_id: string;

  @IsOptional()
  @IsString({ message: 'Workout plan id must be a string' })
  workout_plan_id?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Calories burned must be a number' })
  calories_burned?: number;

  @IsNotEmpty({ message: 'Training status is required' })
  @IsEnum(TrainingStatus, {
    message: 'Training status must be ACTIVE, PAUSED or FINISHED',
  })
  status: TrainingStatus;
}
