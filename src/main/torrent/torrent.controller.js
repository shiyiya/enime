import { Controller, Get } from '@nestjs/common';

@Controller('torrent')
export class TorrentController {
  @Get()
  findAll() {
    return [];
  }
}
