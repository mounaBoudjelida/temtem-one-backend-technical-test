import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    await this.verifyEmailDuplicates(createUserDto.email);

    const user = await this.userModel.create({
      ...createUserDto,
    });
    return user;
  }

  async verifyEmailDuplicates(email: string) {
    if (
      await this.userModel.exists({
        email: email.toLowerCase().trim(),
        all: true,
      })
    ) {
      throw new ConflictException('USER_EMAIL_EXISTS');
    }
    return true;
  }
}
