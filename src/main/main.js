import { NestFactory } from '@nestjs/core';
import { ElectronIPCTransport } from 'nestjs-electron-ipc-transport';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(
    AppModule,
    {
      strategy: new ElectronIPCTransport(),
    }
  );

  await app.close();
}

bootstrap();
