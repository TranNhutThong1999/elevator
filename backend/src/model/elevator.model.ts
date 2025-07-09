import { BaseElevator, Direction } from './elevator-base.model';

export class SmartElevator extends BaseElevator {
  private intervalId: NodeJS.Timeout | null = null;
  private isWaitingAtFloor = false;
  private closeDoorTimer: NodeJS.Timeout | null = null;

  constructor(id: number) {
    super(id);
  }

  public start(): void {
    if (this.intervalId) return;
    this.intervalId = setInterval(() => this.stepLoop(), 1000);
  }

  public stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.closeDoorTimer) {
      clearTimeout(this.closeDoorTimer);
      this.closeDoorTimer = null;
    }
  }

  private setDefault(): void {
    this.isMoving = false;
    this.direction = Direction.IDLE;
    this.doorOpen = false;
  }

  private move(): void {
    const target = this.targets[0];
    this.isMoving = true;
    this.doorOpen = false;
    this.isWaitingAtFloor = false;
    this.closeDoorTimer = null;

    if (this.currentFloor < target) {
      this.direction = Direction.UP;
      this.currentFloor++;
    } else if (this.currentFloor > target) {
      this.direction = Direction.DOWN;
      this.currentFloor--;
    }
  }

  private stopToFloorAndOpenDoor(): void {
    this.doorOpen = true;
    this.isMoving = false;
    this.direction = Direction.IDLE;
    this.isWaitingAtFloor = true;
    this.targets.shift();

    this.closeDoorTimer = setTimeout(() => {
      this.doorOpen = false;
      this.isWaitingAtFloor = false;
      this.closeDoorTimer = null;
    }, 2000);
  }

  private stopElevatorIfTargetsNull(): boolean {
    const haveTargets = this.targets.length > 0;
    const havePendingTargets = this.pendingTargets.length > 0;
    if (!haveTargets && !havePendingTargets) {
      this.setDefault();
      this.stop();
      return true;
    }

    if (!haveTargets && havePendingTargets) {
      this.updateDirectionByFloor(this.currentFloor, this.pendingTargets[0]);
      this.targets = this.sortTargetsByFloor(
        this.direction,
        this.pendingTargets,
      );
      this.pendingTargets = [];
    }
    return false;
  }
  private stepLoop(): void {
    if (this.isWaitingAtFloor) return;
    if (this.stopElevatorIfTargetsNull()) return;

    const target = this.targets[0];
    if (this.currentFloor === target) {
      this.stopToFloorAndOpenDoor();
      return;
    }
    this.move();
  }

  private checkWrongDirection({
    currentFloor,
    currentDirection,
    floor,
  }: {
    currentFloor: number;
    currentDirection: Direction;
    floor: number;
  }): boolean {
    return (
      (currentFloor > floor && currentDirection === Direction.UP) ||
      (currentFloor < floor && currentDirection === Direction.DOWN)
    );
  }

  private updateDirectionByFloor(currentFloor: number, floor: number): void {
    if (currentFloor < floor) {
      this.direction = Direction.UP;
    } else if (currentFloor > floor) {
      this.direction = Direction.DOWN;
    }
  }

  private sortTargetsByFloor(
    direction: Direction,
    targets: number[] = [],
  ): number[] {
    const sortedTargets = [...targets];
    if (direction === Direction.UP) {
      sortedTargets.sort((a, b) => a - b);
    } else if (direction === Direction.DOWN) {
      sortedTargets.sort((a, b) => b - a);
    }
    return [...new Set(sortedTargets)];
  }

  override addTarget(floor: number): void {
    const wrongDirection = this.checkWrongDirection({
      currentFloor: this.currentFloor,
      currentDirection: this.direction,
      floor,
    });

    const existedTarget = this.targets.includes(floor);
    const existedPendingTarget = this.pendingTargets.includes(floor);

    if (wrongDirection && !existedPendingTarget) {
      this.pendingTargets.push(floor);
    } else if (!existedTarget) {
      this.updateDirectionByFloor(this.currentFloor, floor);
      this.targets = this.sortTargetsByFloor(this.direction, [
        ...this.targets,
        floor,
      ]);
      this.start();
    }
  }

  public forceOpenDoor(): void {
    if (this.isMoving) return;
    if (!this.doorOpen) {
      this.doorOpen = true;
      this.isMoving = false;
      this.direction = Direction.IDLE;
    }
    if (this.closeDoorTimer) {
      clearTimeout(this.closeDoorTimer);
      this.closeDoorTimer = null;
    }
    this.isWaitingAtFloor = true;
    this.closeDoorTimer = setTimeout(() => {
      this.doorOpen = false;
      // this.targets.shift();
      this.isWaitingAtFloor = false;
      this.closeDoorTimer = null;
    }, 2000);
  }

  public forceCloseDoor(): void {
    if (this.isMoving) return;
    if (this.closeDoorTimer) {
      clearTimeout(this.closeDoorTimer);
      this.closeDoorTimer = null;
    }
    this.doorOpen = false;
    this.isWaitingAtFloor = false;
    if (this.targets.length > 0) {
      this.start();
    }
  }
}
