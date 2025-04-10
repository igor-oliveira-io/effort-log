import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateSetDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsNotEmpty({ message: 'Training exercise id is required' })
  @IsString({ message: 'Training exercise id must be a string' })
  training_exercise_id: string;

  @IsNotEmpty({ message: 'Number is required' })
  @IsNumber({}, { message: 'Number must be a number' })
  number: number;

  @IsNotEmpty({ message: 'Weight in kg is required' })
  @IsNumber({}, { message: 'Weight in kg must be a number' })
  weight_kg: number;

  @IsNotEmpty({ message: 'Repetitions is required' })
  @IsNumber({}, { message: 'Repetitions must be a number' })
  repetitions: number;

  @IsOptional()
  @IsNumber({}, { message: 'Rest time must be a number' })
  rest_time?: number;
}
