import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { Role } from 'src/enums/role.enum';
import { capitalize } from 'src/utils/helpers.utils';
import { EmailsService } from '../shared/emails/emails.service';
import { NEW_ACCOUNT_SUBJECT } from 'src/utils/emails-subject.utils';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private emailService: EmailsService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    await this.verifyEmailDuplicates(createUserDto.email);
    this.emailService.sendEmail({
      subject: NEW_ACCOUNT_SUBJECT,
      to: createUserDto.email,
      templateName: 'new-account',
      context: {
        firstname: capitalize(createUserDto.firstname),
        email: createUserDto.email,
        password: createUserDto.password,
      },
    });

    const user = await this.userModel.create({
      ...createUserDto,
      role: Role.GUEST,
    });
    return user;
  }

  async findOne(id: string) {
    const user = await this.userModel.findOne({
      _id: id,
    });
    if (!user) {
      throw new NotFoundException('USER_NOT_FOUND');
    }
    return user;
  }

  async findByEmail(email: string, selectPassword = false) {
    const user = await (selectPassword
      ? this.userModel
          .findOne({ email: email.toLowerCase().trim().trim() })
          .select('+password')
      : this.userModel.findOne({ email: email.toLowerCase().trim().trim() }));

    if (!user) {
      throw new NotFoundException('USER_NOT_FOUND');
    }
    return user;
  }

  async verifyEmailDuplicates(email: string) {
    if (
      await this.userModel.exists({
        email: email.toLowerCase().trim(),
      })
    ) {
      throw new ConflictException('USER_EMAIL_EXISTS');
    }
    return true;
  }

  async validatePassword(userPassword: string, password: string) {
    return await bcrypt.compare(password, userPassword);
  }
}
