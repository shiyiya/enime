import { Module } from '@nestjs/common';
import { IpcController } from './ipc.controller';
import { IpcService } from './ipc.service';

@Module({
    imports: [],
    controllers: [IpcController],
    providers: [IpcService],
})
export class IpcModule {}
