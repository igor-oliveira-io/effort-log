import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TrainingExerciseService } from './training_exercise.service';
import { CreateTrainingExerciseDto } from './dto/create-training-exercise.dto';
import { UpdateTrainingExerciseDto } from './dto/update-training-exercise.dto';
import { FilterTrainingExerciseDto } from './dto/filter-training-exercise.dto';
import { TrainingExercise } from '@prisma/client';

@ApiTags('Training Exercises')
@ApiBearerAuth()
@Controller('training-exercises')
export class TrainingExerciseController {
  constructor(
    private readonly trainingExerciseService: TrainingExerciseService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new training exercise' })
  @ApiBody({
    schema: {
      example: {
        session_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        exercise_id: 1,
        name: 'Bench Press',
        exercise_type: 'STRENGTH',
        total_sets: 3,
        duration: 0,
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Training exercise successfully created.',
  })
  create(@Body() createTrainingExerciseDto: CreateTrainingExerciseDto) {
    return this.trainingExerciseService.create(createTrainingExerciseDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get list of training exercises filtered by session_id',
  })
  @ApiResponse({ status: 200, description: 'List of training exercises.' })
  @ApiQuery({
    name: 'session_id',
    required: false,
    type: String,
    description: 'Filter exercises by session id',
  })
  async findAll(
    @Query() query: FilterTrainingExerciseDto,
  ): Promise<TrainingExercise[]> {
    return this.trainingExerciseService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a training exercise by ID' })
  @ApiResponse({ status: 200, description: 'The found training exercise.' })
  findOne(@Param('id') id: string) {
    return this.trainingExerciseService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a training exercise by ID' })
  @ApiResponse({
    status: 200,
    description: 'Training exercise successfully updated.',
  })
  update(
    @Param('id') id: string,
    @Body() updateTrainingExerciseDto: UpdateTrainingExerciseDto,
  ) {
    return this.trainingExerciseService.update(id, updateTrainingExerciseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a training exercise by ID' })
  @ApiResponse({
    status: 200,
    description: 'Training exercise successfully deleted.',
  })
  remove(@Param('id') id: string) {
    return this.trainingExerciseService.remove(id);
  }
}
