import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ElevatorService } from 'src/service/elevator.service';

@WebSocketGateway({ cors: true })
export class ElevatorGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly elevatorService: ElevatorService) {
    setInterval(() => {
      const states = this.elevatorService.getElevatorsState();
      this.server.emit('elevator-state', states);
    }, 1000);
  }

  @SubscribeMessage('call-elevator')
  handleCallElevator(
    client: Socket,
    data: { floor: number; direction: 'up' | 'down' },
  ) {
    const el = this.elevatorService.callElevator(data.floor, data.direction);
    client.emit('elevator-assigned', { elevatorId: el.getId });
  }

  @SubscribeMessage('select-floor')
  handleSelectFloor(
    client: Socket,
    data: { elevatorId: number; floor: number },
  ) {
    this.elevatorService.selectFloor(data.elevatorId, data.floor);
  }

  @SubscribeMessage('open-door')
  handleOpenDoor(client: Socket, data: { elevatorId: number }) {
    this.elevatorService.openDoor(data.elevatorId);
  }

  @SubscribeMessage('close-door')
  handleCloseDoor(client: Socket, data: { elevatorId: number }) {
    this.elevatorService.closeDoor(data.elevatorId);
  }
}
