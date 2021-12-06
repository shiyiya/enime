import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { WindowModule } from './window/window.module';
import { ConfigModule } from '@nestjs/config';
import { GlobalModule } from './global/global.module';
import { IpcModule } from './ipc/ipc.module';
import { RpcModule } from './rpc/rpc.module';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [GlobalModule, EventEmitterModule.forRoot(), ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: !ENV ? '.env' : `.env.${ENV}`,
  }), IpcModule, RpcModule, WindowModule, RpcModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
