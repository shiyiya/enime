import { Dependencies, Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigurationService } from '../config/config.service';
import Animetosho from "./provider/impl/animetosho";
import { InjectInMemoryDBService, InMemoryDBService } from '@nestjs-addons/in-memory-db';
import { EventEmitter2 } from '@nestjs/event-emitter';
import Events from '../../common/types/events';

@Injectable()
@Dependencies(InMemoryDBService, ConfigurationService, EventEmitter2)
export class TorrentService {
  constructor(@InjectInMemoryDBService('torrent') torrentMemoryDBService, configurationService, eventEmitter) {
    this.torrentMemoryDBService = torrentMemoryDBService;
    this.configurationService = configurationService;
    this.eventEmitter = eventEmitter;
  }

  logger = new Logger(TorrentService.name);
  provider;

  async onModuleInit() {
    this.provider = new Animetosho(this.configurationService);
    await this.refreshTorrents();
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async refreshTorrents() {
    let start = new Date().getTime();

    this.logger.debug(`Started refreshing torrents from provider ${this.provider.name}`);
    for (let i = 1; i < 10; i++) {
      let result = await this.provider.recentReleases(i);
      console.log(result)
    }
    this.logger.debug(`Completed refreshing torrents from provider ${this.provider.name} (${new Date().getTime() - start}ms)`);
    this.eventEmitter.emit(Events.TORRENT_REFRESH_COMPLETED);
  }

}
