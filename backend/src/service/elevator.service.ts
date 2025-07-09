import { Injectable } from '@nestjs/common';
import { Direction } from 'src/model/elevator-base.model';
import { SmartElevator } from 'src/model/elevator.model';

@Injectable()
export class ElevatorService {
  elevators: SmartElevator[] = [];

  constructor() {
    // private requestLogRepo: Repository<RequestLog>, // @InjectRepository(RequestLog) // @InjectRepository(Elevator) private elevatorRepo: Repository<Elevator>,
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

  findBestElevator(floor: number, direction: 'up' | 'down'): SmartElevator {
    let best: SmartElevator | null = null;
    let bestScore = Infinity;

    for (const el of this.elevators) {
      const dist = Math.abs(el.getCurrentFloor - floor);

      if (el.getDirection === Direction.IDLE) {
        if (dist < bestScore) {
          best = el;
          bestScore = dist;
        }
      } else if (
        el.getDirection === direction &&
        ((direction === Direction.UP && el.getCurrentFloor <= floor) ||
          (direction === Direction.DOWN && el.getCurrentFloor >= floor))
      ) {
        if (dist + 1 < bestScore) {
          best = el;
          bestScore = dist + 1;
        }
      } else if (dist + 100 < bestScore) {
        best = el;
        bestScore = dist + 100;
      }
    }

    return best!;
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
