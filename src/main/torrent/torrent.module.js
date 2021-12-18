import { Module } from '@nestjs/common';
import { TorrentService } from './torrent.service';
import { TorrentController } from './torrent.controller';
import { ConfigurationService } from '../config/config.service';
import { WindowModule } from '../window/window.module';
import { ConfigurationModule } from '../config/config.module';

@Module({
  imports: [ConfigurationModule, WindowModule],
  controllers: [TorrentController],
  providers: [TorrentService],
})
export class TorrentModule {}
