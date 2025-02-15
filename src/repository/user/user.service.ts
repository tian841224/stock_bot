import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { User } from 'src/model/entity/user.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<boolean> {
    try {
      await this.repository.save(createUserDto);
      return true;
    }
    catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async findAll(): Promise<User[]> {
    return await this.repository.find();
  }

  async findOne(id: number): Promise<User> {
    return await this.repository.findOneBy({ id });
  }

  async findByUserId(userId: string): Promise<User> {
    return await this.repository.findOneBy({ userid: userId });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UpdateResult> {
    try {
      return await this.repository.update(id,updateUserDto);
    }
    catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  // async remove(id: number) {
  //   return await this.repository.delete(id);
  // }
}
