import { Module } from '@nestjs/common';
import { WindowModule } from '../window/window.module';
import { ConfigurationModule } from '../config/config.module';
import { InMemoryDBModule } from '@nestjs-addons/in-memory-db';
import { ReleaseService } from './release.service';

@Module({
  imports: [InMemoryDBModule.forFeature('release'), ConfigurationModule, WindowModule],
  controllers: [],
  providers: [ReleaseService],
})
export class ReleaseModule {}
