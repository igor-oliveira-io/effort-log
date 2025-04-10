import { PartialType } from '@nestjs/mapped-types';
import { CreateTrainingExerciseDto } from './create-training-exercise.dto';

export class UpdateTrainingExerciseDto extends PartialType(
  CreateTrainingExerciseDto,
) {}
