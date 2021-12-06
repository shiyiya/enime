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
    CLIENT_ID = '781044799716720680';

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

        await this.client.login({
            clientId: this.CLIENT_ID
        });

        Logger.debug('Registered Discord RPC client');
    }

    @OnEvent(Events.DISCORD_PRESENCE_UPDATE)
    async handlePresenceUpdate(payload) {
        console.log('Discord presence update event captured', payload);
        /*
        await this.client.setActivity({
            ...BASE_ACTIVITY,

        })
         */
    }
}
