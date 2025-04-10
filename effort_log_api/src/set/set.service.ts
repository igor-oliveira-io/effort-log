import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateSetDto } from './dto/create-set.dto';
import { UpdateSetDto } from './dto/update-set.dto';
import { Set as SetModel } from '@prisma/client';
import { FilterSetDto } from './dto/filter-set.dto';

@Injectable()
export class SetService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateSetDto): Promise<SetModel> {
    return await this.prisma.set.create({
      data: {
        training_exercise_id: data.training_exercise_id,
        number: data.number,
        weight_kg: data.weight_kg,
        repetitions: data.repetitions,
        rest_time: data.rest_time,
      },
    });
  }

  async findAll(params: FilterSetDto): Promise<SetModel[]> {
    const { training_exercise_id } = params;
    const where = training_exercise_id ? { training_exercise_id } : {};
    return await this.prisma.set.findMany({
      where,
    });
  }

  async findOne(id: string): Promise<SetModel | null> {
    return await this.prisma.set.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: UpdateSetDto): Promise<SetModel> {
    return await this.prisma.set.update({
      where: { id },
      data: {
        training_exercise_id: data.training_exercise_id,
        number: data.number,
        weight_kg: data.weight_kg,
        repetitions: data.repetitions,
        rest_time: data.rest_time,
      },
    });
  }

  async remove(id: string): Promise<SetModel> {
    return await this.prisma.set.delete({
      where: { id },
    });
  }
}
