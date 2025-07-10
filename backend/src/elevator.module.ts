import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ElevatorGateway } from './controller/elevator.gateway';
import { ElevatorService } from './service/elevator.service';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [ElevatorGateway, ElevatorService],
  controllers: [],
})
export class ElevatorModule {}
