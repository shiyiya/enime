import { Dependencies, Injectable } from '@nestjs/common';

import Config from 'electron-config';

const OPTION_CANDIDATES = {
  torrent: {
    source: ['animetosho', 'nyaa.si'],
    allowedSubs: ['*']
  }
}

const DEFAULT_CONFIGURATION = {
  torrent: {
    source: 'animetosho',
    allowedSubs: ['SubsPlease', 'Erai-raws', 'HorribleSubs']
  }
}

@Injectable()
export class ConfigurationService {
  config;

  onModuleInit() {
    this.config = new Config({
      defaults: DEFAULT_CONFIGURATION,
      name: 'configuration'
    });
  }

  getConfiguration() {
    return this.config;
  }
}
