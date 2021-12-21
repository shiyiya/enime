import { Module } from '@nestjs/common';
import { TorrentService } from './torrent.service';
import { TorrentController } from './torrent.controller';
import { WindowModule } from '../window/window.module';
import { ConfigurationModule } from '../config/config.module';
import { InMemoryDBModule } from '@nestjs-addons/in-memory-db';

@Module({
  imports: [InMemoryDBModule.forFeature('torrent'), ConfigurationModule, WindowModule],
  controllers: [TorrentController],
  providers: [TorrentService],
})
export class TorrentModule {}
