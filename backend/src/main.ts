import { NestFactory } from '@nestjs/core';
import { ElevatorModule } from './elevator.module';

async function bootstrap() {
  const app = await NestFactory.create(ElevatorModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
