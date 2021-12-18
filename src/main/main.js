import { NestFactory } from '@nestjs/core';
import { ElectronIPCTransport } from 'enime-nestjs-electron-ipc-transport';
import {
  FastifyAdapter
} from '@nestjs/platform-fastify';

import { AppModule } from './app.module';
import { GlobalService } from './global/global.service';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    new FastifyAdapter({ logger: GlobalService.prototype.isDevelopment() })
  );

  app.connectMicroservice({
    strategy: new ElectronIPCTransport(),
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT_BACKEND);
}

bootstrap();
