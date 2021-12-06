import { Module } from '@nestjs/common';
import { RpcService } from './rpc.service';

@Module({
    imports: [],
    controllers: [],
    providers: [RpcService],
})
export class RpcModule {}
