import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Server, Socket } from 'socket.io';
import { ElevatorService } from 'src/service/elevator.service';
import { Direction } from 'src/model/elevator-base.model';

interface ElevatorState {
  id: number;
  currentFloor: number;
  direction: Direction;
  isMoving: boolean;
  doorOpen: boolean;
  targets: number[];
}

@WebSocketGateway({ cors: true })
export class ElevatorGateway implements OnModuleDestroy {
  @WebSocketServer()
  private server: Server;

  private readonly minFloor: number;
  private readonly maxFloor: number;
  private readonly elevatorsStateChangedHandler: (
    states: ElevatorState[],
  ) => void;

  constructor(
    private readonly elevatorService: ElevatorService,
    private readonly configService: ConfigService,
  ) {
    this.minFloor = this.configService.get<number>('MIN_FLOOR', 1);
    this.maxFloor = this.configService.get<number>('MAX_FLOOR', 10);

    this.elevatorsStateChangedHandler = (states: ElevatorState[]) => {
      this.server.emit('elevator-state', states);
    };

    this.elevatorService.on(
      'elevatorsStateChanged',
      this.elevatorsStateChangedHandler,
    );
  }

  onModuleDestroy() {
    this.elevatorService.off(
      'elevatorsStateChanged',
      this.elevatorsStateChangedHandler,
    );
  }

  private validateFloor(floor: number): void {
    if (floor < this.minFloor || floor > this.maxFloor) {
      throw new WsException(
        `Floor must be between ${this.minFloor} and ${this.maxFloor}`,
      );
    }
  }

  private validateDirection(direction: 'up' | 'down'): void {
    if (direction !== 'up' && direction !== 'down') {
      throw new WsException('Direction must be either "up" or "down"');
    }
  }

  private handleOperation(client: Socket, operation: () => void): void {
    try {
      operation();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      client.emit('error', {
        message: errorMessage,
        status: 'error',
        timestamp: new Date().toISOString(),
      });
    }
  }

  @SubscribeMessage('get-elevators')
  handleGetElevators(client: Socket): void {
    const states = this.elevatorService.getElevatorsState();
    client.emit('elevator-state', states);
    client.emit('floor-information', {
      min: this.minFloor,
      max: this.maxFloor,
    });
  }

  @SubscribeMessage('call-elevator')
  handleCallElevator(
    client: Socket,
    data: { floor: number; direction: 'up' | 'down' },
  ): void {
    this.handleOperation(client, () => {
      this.validateFloor(data.floor);
      this.validateDirection(data.direction);
      const elevator = this.elevatorService.callElevator(
        data.floor,
        data.direction,
      );
      client.emit('elevator-assigned', { elevatorId: elevator.getId });
    });
  }

  @SubscribeMessage('select-floor')
  handleSelectFloor(
    client: Socket,
    data: { elevatorId: number; floor: number },
  ): void {
    this.handleOperation(client, () => {
      this.validateFloor(data.floor);
      this.elevatorService.selectFloor(data.elevatorId, data.floor);
    });
  }

  @SubscribeMessage('open-door')
  handleOpenDoor(client: Socket, data: { elevatorId: number }): void {
    this.handleOperation(client, () => {
      this.elevatorService.openDoor(data.elevatorId);
    });
  }

  @SubscribeMessage('close-door')
  handleCloseDoor(client: Socket, data: { elevatorId: number }): void {
    this.handleOperation(client, () => {
      this.elevatorService.closeDoor(data.elevatorId);
    });
  }
}
