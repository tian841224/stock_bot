import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private prisma: PrismaService
  ) { }

  async create(createUserDto: CreateUserDto): Promise<boolean> {
    try {
      await this.prisma.user.create({ data: createUserDto });
      return true;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async findAll(): Promise<User[]> {
    return await this.prisma.user.findMany({ where: { status: 1 } });
  }

  async findOne(id: number): Promise<User> {
    return await this.prisma.user.findUnique({ where: { id: id, status: 1 } });
  }

  async findByUserId(userId: string): Promise<User> {
    return await this.prisma.user.findUnique({ where: { userid: userId, status: 1 } });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<boolean> {
    try {
      await this.prisma.user.update({ where: { id }, data: updateUserDto });
      return true;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }


  // async remove(id: number) {
  //   return await this.repository.delete(id);
  // }
}
