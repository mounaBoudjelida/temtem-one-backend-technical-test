import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { SeedsService } from './seeds/seeds.service';
import { LoggerService } from './modules/shared/logger/logger.service';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(
    private seedsService: SeedsService,
    private loggerService: LoggerService,
  ) {}

  async onApplicationBootstrap() {
    try {
      await this.seedsService.seedAdmin();
    } catch (err) {
      this.loggerService.error(err);
      console.error(err);
    }
  }

  getHello(): string {
    return 'Hello World!';
  }
}
