import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { StreakService } from './streak.service';
import { SetStreakMetaDto } from './dto/set-streak-meta.dto';

@ApiTags('Streak')
@ApiBearerAuth()
@Controller('streak')
export class StreakController {
  constructor(private readonly streakService: StreakService) {}

  @Get('has-weekly-goal/:userId')
  @ApiOperation({
    summary: 'Verifica se o usuário já definiu uma meta semanal',
  })
  @ApiResponse({ status: 200, description: 'Retorna true ou false' })
  async hasWeeklyGoal(@Param('userId') userId: string) {
    const hasGoal = await this.streakService.hasWeeklyGoal(userId);
    return { hasGoal };
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Retorna o streak atual do usuário' })
  @ApiResponse({ status: 200, description: 'Streak retornado com sucesso' })
  getStreak(@Param('userId') userId: string) {
    return this.streakService.getStreak(userId);
  }

  @Post('set-weekly-goal')
  @ApiOperation({ summary: 'Define a meta semanal do usuário' })
  @ApiResponse({
    status: 201,
    description: 'Meta semanal definida com sucesso',
  })
  setWeeklyGoal(@Body() dto: SetStreakMetaDto) {
    return this.streakService.setWeeklyGoal(dto);
  }

  @Post('register-activity')
  @ApiOperation({
    summary: 'Registra um novo dia de treino e atualiza o streak',
  })
  @ApiResponse({ status: 201, description: 'Streak atualizado com sucesso' })
  registerStreakActivity(@Body() body: { userId: string; date: string }) {
    return this.streakService.registerDay(body.userId, body.date);
  }
}
