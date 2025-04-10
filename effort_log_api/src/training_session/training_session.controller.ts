/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TrainingSessionService } from './training_session.service';
import { CreateTrainingSessionDto } from './dto/create-training-session.dto';
import { UpdateTrainingSessionDto } from './dto/update-training-session.dto';
import { FilterTrainingSessionDto } from './dto/filter-training-session.dto';

@ApiTags('Training Sessions')
@ApiBearerAuth()
@Controller('training-sessions')
export class TrainingSessionController {
  constructor(
    private readonly trainingSessionService: TrainingSessionService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new training session' })
  @ApiBody({
    schema: {
      example: {
        name: 'Morning Session',
        start_datetime: '2025-02-04T07:00:00.000Z',
        end_datetime: '2025-02-04T07:00:00.000Z',
        duration: 60,
        notes: 'Focus on cardio',
        user_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        workout_plan_id: 'f1e2d3c4-b5a6-7890-abcd-ef1234567890',
        calories_burned: 500,
        status: 'ACTIVE',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Training session successfully created.',
  })
  create(@Body() createTrainingSessionDto: CreateTrainingSessionDto) {
    return this.trainingSessionService.create(createTrainingSessionDto);
  }

  @Get('active-session')
  @ApiOperation({
    summary: 'Get current active training session for the logged-in user',
  })
  @ApiResponse({
    status: 200,
    description:
      'Returns the active training session or null if none is active.',
  })
  getActiveSession(@Req() req) {
    return this.trainingSessionService.findActiveSession(req.user.id);
  }

  @Get()
  @ApiOperation({
    summary:
      'Get list of training sessions filtered by user_id with pagination',
  })
  @ApiQuery({ name: 'user_id', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of training sessions.',
  })
  async findAll(@Query() query: FilterTrainingSessionDto) {
    return this.trainingSessionService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a training session by ID' })
  @ApiResponse({ status: 200, description: 'The found training session.' })
  findOne(@Param('id') id: string) {
    return this.trainingSessionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a training session by ID' })
  @ApiResponse({
    status: 200,
    description: 'Training session successfully updated.',
  })
  update(
    @Param('id') id: string,
    @Body() updateTrainingSessionDto: UpdateTrainingSessionDto,
  ) {
    return this.trainingSessionService.update(id, updateTrainingSessionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a training session by ID' })
  @ApiResponse({
    status: 200,
    description: 'Training session successfully deleted.',
  })
  remove(@Param('id') id: string) {
    return this.trainingSessionService.remove(id);
  }
}
