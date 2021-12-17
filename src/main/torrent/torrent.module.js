import { Module } from '@nestjs/common';
import { TorrentService } from './torrent.service';

@Module({
  imports: [],
  controllers: [],
  providers: [TorrentService],
})
export class TorrentModule {}
