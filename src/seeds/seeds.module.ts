import { Module } from '@nestjs/common';
import { UsersModule } from 'src/modules/users/users.module';
import { SeedsService } from './seeds.service';
import { EmailsModule } from 'src/modules/shared/emails/emails.module';

@Module({
  imports: [UsersModule, EmailsModule],
  providers: [SeedsService ],
  exports: [SeedsService],
})
export class SeedsModule {}
