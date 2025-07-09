export enum Direction {
  UP = 'up',
  DOWN = 'down',
  IDLE = 'idle',
}

export abstract class BaseElevator {
  protected id: number;
  protected currentFloor: number;
  protected direction: Direction;
  protected isMoving: boolean;
  protected doorOpen: boolean;
  protected targets: number[];
  protected pendingTargets: number[];

  constructor(id: number) {
    this.id = id;
    this.currentFloor = 1;
    this.direction = Direction.IDLE;
    this.isMoving = false;
    this.doorOpen = false;
    this.targets = [];
    this.pendingTargets = [];
  }

  abstract addTarget(floor: number): void;

  getState() {
    return {
      id: this.id,
      currentFloor: this.currentFloor,
      direction: this.direction,
      isMoving: this.isMoving,
      doorOpen: this.doorOpen,
      targets: [...new Set([...this.targets, ...this.pendingTargets])],
    };
  }

  get getId(): number {
    return this.id;
  }

  get getCurrentFloor(): number {
    return this.currentFloor;
  }
  set setCurrentFloor(value: number) {
    this.currentFloor = value;
  }

  get getDirection(): Direction {
    return this.direction;
  }
  set setDirection(value: Direction) {
    this.direction = value;
  }

  get getIsMoving(): boolean {
    return this.isMoving;
  }
  set setIsMoving(value: boolean) {
    this.isMoving = value;
  }

  get getDoorOpen(): boolean {
    return this.doorOpen;
  }
  set setDoorOpen(value: boolean) {
    this.doorOpen = value;
  }

  get getTargets(): number[] {
    return this.targets;
  }
  set setTargets(value: number[]) {
    this.targets = value;
  }

  get getPendingTargets(): number[] {
    return this.pendingTargets;
  }
  set setPendingTargets(value: number[]) {
    this.pendingTargets = value;
  }
}
