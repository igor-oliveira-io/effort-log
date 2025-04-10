import { IsOptional, IsString } from 'class-validator';

export class FilterSetDto {
  @IsOptional()
  @IsString()
  training_exercise_id?: string;
}
