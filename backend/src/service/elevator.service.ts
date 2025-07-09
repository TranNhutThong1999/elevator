import { Injectable } from '@nestjs/common';
import { Direction } from 'src/model/elevator-base.model';
import { SmartElevator } from 'src/model/elevator.model';

@Injectable()
export class ElevatorService {
  private elevators: SmartElevator[] = [];
  private readonly BUSY_ELEVATOR_PENALTY = 10;
  private readonly UNSUITABLE_ELEVATOR_PENALTY = 100;

  constructor() {
    this.elevators = [
      new SmartElevator(1),
      new SmartElevator(2),
      new SmartElevator(3),
    ];
  }

  callElevator(floor: number, direction: 'up' | 'down') {
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
      return distance + this.BUSY_ELEVATOR_PENALTY;
    }

    return distance + this.UNSUITABLE_ELEVATOR_PENALTY;
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
    if (el) el.addTarget(floor);
  }

  openDoor(elevatorId: number) {
    const el = this.elevators.find((e) => e.getId === elevatorId);
    if (el) el.forceOpenDoor();
  }

  closeDoor(elevatorId: number) {
    const el = this.elevators.find((e) => e.getId === elevatorId);
    if (el) el.forceCloseDoor();
  }

  getElevatorsState() {
    return this.elevators.map((e) => e.getState());
  }
}
