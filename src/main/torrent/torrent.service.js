import { Dependencies, Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigurationService } from '../config/config.service';
import Animetosho from "./provider/impl/animetosho";

@Injectable()
@Dependencies(ConfigurationService)
export class TorrentService {
  constructor(configurationService) {
    this.configurationService = configurationService;
  }

  logger = new Logger(TorrentService.name);
  provider;

  async onModuleInit() {
    this.provider = new Animetosho(this.configurationService);
    await this.refreshTorrents();
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async refreshTorrents() {
    this.logger.debug(`Started refreshing torrents from provider ${this.provider.name}`);
    this.logger.debug(`Completed refreshing torrents from provider ${this.provider.name}`);
  }

}
