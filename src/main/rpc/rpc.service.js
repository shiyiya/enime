import { Injectable, Logger } from '@nestjs/common';
import RPC from 'discord-rpc';
import { OnEvent } from '@nestjs/event-emitter';
import Events from '../../common/types/events';

const CONSTANTS = {
    IMAGE_KEY: 'elaina',
    LARGE_TEXT: 'Enime v. DEV',
    SMALL_TEXT: 'Enime'
}

const BASE_ACTIVITY = {
    largeImageKey: CONSTANTS.IMAGE_KEY,
    largeImageText: CONSTANTS.LARGE_TEXT,
    smallImageText: CONSTANTS.SMALL_TEXT
}

@Injectable()
export class RpcService {
    logger = new Logger(RpcService.name);

    CLIENT_ID = process.env.CLIENT_ID;

    client;

    async onModuleInit() {
        RPC.register(this.CLIENT_ID);

        this.client = new RPC.Client({ transport: 'ipc' });
        this.client.on('ready', () => {
            this.client.setActivity({
               ...BASE_ACTIVITY,
               startTimestamp: new Date(),
               instance: false
           });
        });

        let failure = false;

        do {
            try {
                await this.login();
                failure = false;
                this.logger.debug('Registered Discord RPC client');
            } catch (e) {
                this.logger.error('Discord RPC connection timeout, retrying..');
                failure = true;
            }
        } while (failure);
    }

    async login() {
        await this.client.login({
            clientId: this.CLIENT_ID
        });
    }

    @OnEvent(Events.DISCORD_PRESENCE_UPDATE)
    async handlePresenceUpdate(payload) {
        this.logger.debug('Discord presence update event captured', payload);
        /*
        await this.client.setActivity({
            ...BASE_ACTIVITY,

        })
         */
    }
}
