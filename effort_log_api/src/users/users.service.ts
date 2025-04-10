import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { EmailExistsException } from 'src/common/exceptions/email-exists.exception';
import { FilterUsersDto } from './dto/filter-users.dto';
import { StreakService } from 'src/streak/streak.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly streakService: StreakService,
  ) {}

  async create(data: CreateUserDto): Promise<User> {
    const userExists = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (userExists) {
      throw new EmailExistsException();
    }

    const user = await this.prisma.user.create({
      data,
    });
    await this.streakService.createDefaultStreak(user.id);

    return user;
  }

  async findAll(params: FilterUsersDto): Promise<User[]> {
    const { skip, take, cursor, name, orderByField, order } = params;
    const where: Prisma.UserWhereInput = {};
    if (name) {
      where.name = { contains: name, mode: 'insensitive' };
    }
    const orderBy = orderByField ? { [orderByField]: order } : undefined;
    return await this.prisma.user.findMany({
      skip,
      take,
      cursor: cursor ? { id: cursor } : undefined,
      where,
      orderBy,
    });
  }

  async findOne(id: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    return this.prisma.user.update({
      data,
      where: { id },
    });
  }

  async remove(id: string) {
    return await this.prisma.user.delete({
      where: { id },
    });
  }

  async findOneByCredentials(
    email: string,
    password: string,
  ): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { email, password },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}
