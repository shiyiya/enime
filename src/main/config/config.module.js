import { Module } from '@nestjs/common';
import { ConfigurationService } from './config.service';
import { WindowModule } from '../window/window.module';

@Module({
  imports: [WindowModule],
  controllers: [],
  providers: [ConfigurationService],
  exports: [ConfigurationService]
})
export class ConfigurationModule {}
