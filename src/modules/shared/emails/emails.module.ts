import { Module } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [LoggerModule],
  providers: [EmailsService],
  exports: [EmailsService],
})
export class EmailsModule {}
