import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { ExerciseType } from '@prisma/client';

export class CreateTrainingExerciseDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsNotEmpty({ message: 'Session id is required' })
  @IsString({ message: 'Session id must be a string' })
  session_id: string;

  @IsOptional()
  @IsNumber({}, { message: 'Exercise id must be a number' })
  exercise_id?: number;

  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name?: string;

  @IsNotEmpty({ message: 'Exercise type is required' })
  @IsEnum(ExerciseType, { message: 'Exercise type must be STRENGTH or CARDIO' })
  exercise_type: ExerciseType;

  @IsOptional()
  @IsNumber({}, { message: 'Total sets must be a number' })
  total_sets?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Duration must be a number' })
  duration?: number;
}
