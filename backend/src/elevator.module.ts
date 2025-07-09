import { Module } from '@nestjs/common';
import { ElevatorGateway } from './controller/elevator.gateway';
import { ElevatorService } from './service/elevator.service';
@Module({
  providers: [ElevatorGateway, ElevatorService],
  controllers: [],
})
export class ElevatorModule {}
