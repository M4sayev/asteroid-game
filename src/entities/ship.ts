import {
  DIAGONAL_MODIFIER,
  PLAYER_ONE_CONTROLS,
} from "../constants/constants.js";
import { Projectile } from "./projectile.js";
import {
  ColorType,
  ControlsType,
  InitialCoordinates,
  KeyState,
} from "../types/types.js";
import { BaseEntity } from "./entity.js";

interface ShipConstructorArgs {
  width?: number;
  height?: number;
  controls?: ControlsType;
  initialCoordinates?: InitialCoordinates;
  initialAngle?: number;
  color?: ColorType;
}

export class Ship extends BaseEntity {
  #controls: ControlsType;
  #color: ColorType;

  #horizontal = 0;
  #vertical = 0;
  #angle = 0;
  #vx = 0;
  #vy = 0;
  #cooldown = 0;
  active = true;

  // constants
  #shootCooldown = 150;
  #maxVelocity = 10;
  #acceleration = 0.01;
  #rotationSpeed = 0.02;
  #friction = 0.99;
  constructor({
    width = 45,
    height = 64,
    controls = PLAYER_ONE_CONTROLS,
    initialCoordinates = { x: 0, y: 0 },
    initialAngle = 0,
    color = "black",
  }: ShipConstructorArgs) {
    const { x, y } = initialCoordinates;
    super(x, y, width, height);
    this.#controls = controls;
    this.#angle = initialAngle;
    this.#color = color;

    const img = new Image(this.width, this.height);

    img.onload = () => {
      this.img = img;
    };

    img.src = `assets/ship/ship_${this.#color}.png`;
  }

  public update(
    ctx: CanvasRenderingContext2D,
    keys: KeyState,
    canvasWidth: number,
    canvasHeight: number
  ) {
    this.#rotate(ctx);
    this.#move(keys);
    this.#handleCooldown();
    this.#handleOutOfBounds(canvasWidth, canvasHeight);
  }

  public bounce(): void {
    this.#vx *= -1;
    this.#vy *= -1;
  }

  public shoot(keys: KeyState) {
    const { shoot: shootKey } = this.#controls;
    if (keys[shootKey] && this.#cooldown === 0) {
      this.#cooldown = this.#shootCooldown;
      return new Projectile(
        this.x + this.width / 2,
        this.y + this.height / 2,
        -Math.sin(this.#angle) * 10,
        Math.cos(this.#angle) * 10,
        this.#angle
      );
    }
    return null;
  }

  public keepInBounds(canvasWidth: number, canvasHeight: number): void {
    if (this.x + this.width > canvasWidth) {
      this.x = canvasWidth - this.width;
    }

    if (this.y + this.height > canvasHeight) {
      this.y = canvasHeight - this.height;
    }

    this.x = Math.max(0, this.x);
    this.y = Math.max(0, this.y);
  }

  #readInput(keys: KeyState): void {
    const { left, right, up, down } = this.#controls;
    this.#horizontal = Number(keys[right]) - Number(keys[left]);
    this.#vertical = Number(keys[down]) - Number(keys[up]);
  }

  #applyAcceleration(): void {
    this.#vx += this.#horizontal * this.#acceleration;
    this.#vx = Math.max(
      -this.#maxVelocity,
      Math.min(this.#maxVelocity, this.#vx)
    );

    this.#vy += this.#vertical * this.#acceleration;
    this.#vy = Math.max(
      -this.#maxVelocity,
      Math.min(this.#maxVelocity, this.#vy)
    );
  }

  #applyFriction(): void {
    if (!this.#horizontal) {
      this.#vx *= this.#friction;
    }

    if (!this.#vertical) {
      this.#vy *= this.#friction;
    }
  }

  #applyMovement(): void {
    const currentCoeff = this.#vx && this.#vy ? DIAGONAL_MODIFIER : 1;

    this.x += this.#vx * currentCoeff;
    this.y += this.#vy * currentCoeff;
  }

  #handleCooldown(): void {
    if (this.#cooldown > 0) {
      this.#cooldown--;
    }
  }

  #handleOutOfBounds(width: number, height: number): void {
    if (this.x >= width) {
      this.x = -this.width;
    } else if (this.x < -this.width) {
      this.x = width;
    }
    if (this.y >= height) {
      this.y = -this.height;
    } else if (this.y < -this.height) {
      this.y = height;
    }
  }

  #rotate(ctx: CanvasRenderingContext2D) {
    if (!this.img) return;
    ctx.save();

    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);

    ctx.rotate(this.#angle);
    this.drawRelativeImage(ctx);

    this.drawHitBox(ctx);

    ctx.restore();
  }

  #updateAngle(): void {
    if (this.#horizontal !== 0 || this.#vertical !== 0) {
      const targetAngle = Math.atan2(-this.#horizontal, this.#vertical);
      let rawGap = targetAngle - this.#angle;
      const gap = ((rawGap + Math.PI) % (Math.PI * 2)) - Math.PI;

      this.#angle += gap * this.#rotationSpeed;
    }
  }

  #move(keys: KeyState): void {
    this.#readInput(keys);
    this.#applyAcceleration();
    this.#applyFriction();
    this.#applyMovement();
    this.#updateAngle();
  }
}
