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
import { SetService } from './set.service';
import { CreateSetDto } from './dto/create-set.dto';
import { UpdateSetDto } from './dto/update-set.dto';
import { FilterSetDto } from './dto/filter-set.dto';
import { Set } from '@prisma/client';

@ApiTags('Sets')
@ApiBearerAuth()
@Controller('sets')
export class SetController {
  constructor(private readonly setService: SetService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new set' })
  @ApiBody({
    schema: {
      example: {
        training_exercise_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        number: 1,
        weight_kg: 80,
        repetitions: 10,
        rest_time: 90,
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Set successfully created.' })
  create(@Body() createSetDto: CreateSetDto) {
    return this.setService.create(createSetDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get list of sets filtered by training_exercise_id',
  })
  @ApiResponse({ status: 200, description: 'List of sets.' })
  @ApiQuery({
    name: 'training_exercise_id',
    required: false,
    type: String,
    description: 'Filter sets by training exercise id',
  })
  async findAll(@Query() query: FilterSetDto): Promise<Set[]> {
    return this.setService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a set by ID' })
  @ApiResponse({ status: 200, description: 'The found set.' })
  findOne(@Param('id') id: string) {
    return this.setService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a set by ID' })
  @ApiResponse({ status: 200, description: 'Set successfully updated.' })
  update(@Param('id') id: string, @Body() updateSetDto: UpdateSetDto) {
    return this.setService.update(id, updateSetDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a set by ID' })
  @ApiResponse({ status: 200, description: 'Set successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.setService.remove(id);
  }
}
