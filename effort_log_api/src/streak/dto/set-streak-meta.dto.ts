import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsInt, Min, Max } from 'class-validator';

export class SetStreakMetaDto {
  @ApiProperty()
  @IsUUID()
  user_id: string;

  @ApiProperty({ example: 4, description: 'Meta de dias por semana (1 a 7)' })
  @IsInt()
  @Min(1)
  @Max(7)
  weekly_goal: number;
}
