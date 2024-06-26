import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/modules/users/schemas/user.schema';
import { ADMIN_SEED } from './admin.seed';
import { Role } from 'src/enums/role.enum';
import { generatePassword } from 'src/utils/helpers.utils';
import { EmailsService } from 'src/modules/shared/emails/emails.service';
import { NEW_ACCOUNT_SUBJECT } from 'src/utils/emails-subject.utils';

@Injectable()
export class SeedsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private configService: ConfigService,
    private emailService: EmailsService
  ) {}

  async seedAdmin() {
    const exists = await this.userModel.exists({ role: Role.ADMIN });
    if (exists) {
      return;
    }
    const email = this.configService.getOrThrow('ADMIN_EMAIL');
    const password = generatePassword();
    await this.userModel.create({
      ...ADMIN_SEED(email, Role.ADMIN),
      password,
    });
    this.emailService.sendEmail({
      subject: NEW_ACCOUNT_SUBJECT,
      to: email,
      templateName: 'new-account',
      context: {
        firstname: ':)',
        email: email,
        password,
      },
    });
  }
}
