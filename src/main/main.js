import { NestFactory } from '@nestjs/core';
import { ElectronIPCTransport } from 'nestjs-electron-ipc-transport';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(
    AppModule,
    {
      strategy: new ElectronIPCTransport(),
    }
  );

  app.listen(() => console.log('Application started.'));
}

bootstrap();
