import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { SeedsService } from './seeds/seeds.service';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(private seedsService: SeedsService) {}

  async onApplicationBootstrap() {
    try {
      await this.seedsService.seedAdmin();
    } catch (err) {
      console.error(err);
    }
  }

  getHello(): string {
    return 'Hello World!';
  }
}
