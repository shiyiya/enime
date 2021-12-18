import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { WindowModule } from './window/window.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { GlobalModule } from './global/global.module';
import { IpcModule } from './ipc/ipc.module';
import { RpcModule } from './rpc/rpc.module';
import { TorrentModule } from './torrent/torrent.module';
import { ConfigurationModule } from './config/config.module';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [GlobalModule, ScheduleModule.forRoot(), EventEmitterModule.forRoot(), ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: !ENV ? '.env' : `.env.${ENV}`,
  }), ConfigurationModule, TorrentModule, WindowModule, IpcModule, RpcModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
