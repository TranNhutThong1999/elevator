import { BaseElevator, Direction } from './elevator-base.model';

export class SmartElevator extends BaseElevator {
  private intervalId: NodeJS.Timeout | null = null;
  private isWaitingAtFloor = false;
  private closeDoorTimer: NodeJS.Timeout | null = null;

  constructor(id: number) {
    super(id);
  }

  start() {
    if (this.intervalId) return;
    this.intervalId = setInterval(() => this.stepLoop(), 1000);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private setDefault() {
    this.isMoving = false;
    this.direction = Direction.IDLE;
    this.doorOpen = false;
  }

  private move() {
    const target = [...this.targets][0];

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
  private stepLoop() {
    const haveTargets = this.targets.length > 0;
    const havePendingTargets = this.pendingTargets.length > 0;
    if (!haveTargets && !havePendingTargets) {
      this.setDefault();
      this.stop();
      return;
    }
    if (!haveTargets && havePendingTargets) {
      this.updateDirectionByFloor(this.currentFloor, this.pendingTargets[0]);
      const newPendingTargets: number[] = this.pendingTargets;
      this.targets = this.sortTagertsByFloor(this.direction, newPendingTargets);
      this.pendingTargets = [];
    }

    if (this.isWaitingAtFloor) return;

    const target = [...this.targets][0];

    if (this.currentFloor === target) {
      this.doorOpen = true;
      this.isMoving = false;
      this.direction = Direction.IDLE;
      this.isWaitingAtFloor = true;

      this.closeDoorTimer = setTimeout(() => {
        this.doorOpen = false;
        this.targets.shift();
        this.isWaitingAtFloor = false;
        this.closeDoorTimer = null;
        // clearTimeout(this.closeDoorTimer);
      }, 2000);

      return;
    }
    this.move();
  }

  private checkWrongDirection = ({
    currentFloor,
    currentDirection,
    floor,
  }: {
    currentFloor: number;
    currentDirection: Direction;
    floor: number;
  }): boolean => {
    return (
      (currentFloor > floor && currentDirection === Direction.UP) ||
      (currentFloor < floor && currentDirection === Direction.DOWN)
    );
  };

  private updateDirectionByFloor = (
    currentFloor: number,
    floor: number,
  ): void => {
    if (currentFloor < floor) {
      this.direction = Direction.UP;
    } else if (currentFloor > floor) {
      this.direction = Direction.DOWN;
    }
  };

  private sortTagertsByFloor = (
    direction: Direction,
    targets: number[] = [],
  ): number[] => {
    let newTargets: number[] = targets;
    if (direction === Direction.UP) {
      newTargets = targets.sort((a, b) => a - b);
    } else if (direction === Direction.DOWN) {
      newTargets = targets.sort((a, b) => b - a);
    }
    return [...new Set(newTargets)];
  };

  override addTarget(floor: number) {
    const isWrongDirection = this.checkWrongDirection({
      currentFloor: this.currentFloor,
      currentDirection: this.direction,
      floor,
    });

    const isExistedTargetFloor = !!this.targets.includes(floor);
    const isExistedPendingTargetFloor = !!this.pendingTargets.includes(floor);

    const isAddPenddingTargets =
      isWrongDirection && !isExistedPendingTargetFloor;

    if (isAddPenddingTargets) {
      this.pendingTargets.push(floor);
    } else if (!isExistedTargetFloor) {
      this.updateDirectionByFloor(this.currentFloor, floor);
      const newTargets: number[] = [...this.targets, floor];
      this.targets = this.sortTagertsByFloor(this.direction, newTargets);
      this.start();
    }
  }

  forceOpenDoor() {
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
      this.targets.shift();
      this.isWaitingAtFloor = false;
      this.closeDoorTimer = null;
    }, 2000);
  }

  forceCloseDoor() {
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
