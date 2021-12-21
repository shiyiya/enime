
import { Dependencies, Injectable, Logger } from '@nestjs/common';
import { InjectInMemoryDBService, InMemoryDBService } from '@nestjs-addons/in-memory-db';
import { OnEvent } from '@nestjs/event-emitter';
import Events from '../../common/types/events';

@Injectable()
@Dependencies(InMemoryDBService)
export class ReleaseService {
  logger = new Logger(ReleaseService.name);
  provider;

  constructor(@InjectInMemoryDBService('release') releaseInMemoryDBService) {
    this.releaseInMemoryDBService = releaseInMemoryDBService;
  }

  @OnEvent(Events.TORRENT_REFRESH_COMPLETED)
  async onTorrentRefreshComplete() {

  }
}
