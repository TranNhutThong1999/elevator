import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Direction } from 'src/model/elevator-base.model';
import { SmartElevator } from 'src/model/elevator.model';
import { EventEmitter } from 'events';

@Injectable()
export class ElevatorService extends EventEmitter {
  private elevators: SmartElevator[] = [];
  private readonly busyElevatorPenalty: number;
  private readonly unsuitableElevatorPenalty: number;

  constructor(private readonly configService: ConfigService) {
    super();
    this.busyElevatorPenalty = this.configService.get<number>(
      'BUSY_ELEVATOR_PENALTY',
      10,
    );
    this.unsuitableElevatorPenalty = this.configService.get<number>(
      'UNSUITABLE_ELEVATOR_PENALTY',
      100,
    );

    this.elevators = [
      new SmartElevator(1),
      new SmartElevator(2),
      new SmartElevator(3),
    ];

    this.elevators.forEach((elevator) => {
      elevator.on('stateChanged', () => {
        this.emit('elevatorsStateChanged', this.getElevatorsState());
      });
    });
  }

  callElevator(floor: number, direction: 'up' | 'down') {
    const existedTarget = this.elevators.find(elevator=> elevator.getTargets.includes(floor))
    if(existedTarget) return;
    const el = this.findBestElevator(floor, direction);
    el.addTarget(floor);
    return el;
  }

  private calculateScore(
    elevator: SmartElevator,
    targetFloor: number,
    requestDir: 'up' | 'down',
  ): number {
    const currentFloor = elevator.getCurrentFloor;
    const direction = elevator.getDirection;
    const distance = Math.abs(currentFloor - targetFloor);

    if (direction === Direction.IDLE) {
      return distance;
    }

    const isSameDirection = direction === requestDir;
    const isHeadingTowardCaller =
      (requestDir === Direction.UP && currentFloor <= targetFloor) ||
      (requestDir === Direction.DOWN && currentFloor >= targetFloor);

    if (isSameDirection && isHeadingTowardCaller) {
      return distance + this.busyElevatorPenalty;
    }

    return distance + this.unsuitableElevatorPenalty;
  }

  private findBestElevator(
    floor: number,
    direction: 'up' | 'down',
  ): SmartElevator {
    let bestElevator: SmartElevator | null = null;
    let bestScore = Infinity;
   
    for (const elevator of this.elevators) {
      const score = this.calculateScore(elevator, floor, direction);

      if (score < bestScore) {
        bestElevator = elevator;
        bestScore = score;
      }
    }

    return bestElevator!;
  }

  selectFloor(elevatorId: number, floor: number) {
    const el = this.elevators.find((e) => e.getId === elevatorId);
    if (!el) {
      throw new NotFoundException(`Elevator with ID ${elevatorId} not found`);
    }
    el.addTarget(floor);
  }

  openDoor(elevatorId: number) {
    const el = this.elevators.find((e) => e.getId === elevatorId);
    if (!el) {
      throw new NotFoundException(`Elevator with ID ${elevatorId} not found`);
    }
    el.forceOpenDoor();
  }

  closeDoor(elevatorId: number) {
    const el = this.elevators.find((e) => e.getId === elevatorId);
    if (!el) {
      throw new NotFoundException(`Elevator with ID ${elevatorId} not found`);
    }
    el.forceCloseDoor();
  }

  getElevatorsState() {
    return this.elevators.map((e) => e.getState());
  }
}
