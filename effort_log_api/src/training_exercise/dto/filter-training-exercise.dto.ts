import { IsOptional, IsString } from 'class-validator';

export class FilterTrainingExerciseDto {
  @IsOptional()
  @IsString()
  session_id?: string;
}
