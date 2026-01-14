import { asteroids } from "../constants/constants.js";
import { calculateCollisionNormal } from "../utils/utils.js";
import { BaseEntity } from "./entity.js";

export class Asteroid extends BaseEntity {
  vx = 0;
  vy = 0;
  #lastCollisionTime: number = 0;

  #friction: number = 0.99;
  #collisionTimeCooldownMS: number = 4000;

  constructor(x: number, y: number) {
    const randomIndex = Math.floor(Math.random() * asteroids.length);
    const randomAngle = Math.min(
      Math.PI,
      Math.min(-Math.PI, Math.random() * 4)
    );

    const asteroidImg = asteroids[randomIndex];

    super(x, y, asteroidImg.diameter, asteroidImg.diameter);

    this.angle = randomAngle;
    this.mass = asteroidImg.mass;

    const asset = new Image(asteroidImg.diameter, asteroidImg.diameter);

    asset.onload = () => (this.img = asset);

    asset.src = asteroidImg.img;
  }

  public update(
    ctx: CanvasRenderingContext2D,
    canvasWidth: number,
    canvasHeight: number
  ): void {
    ctx.save();
    this.revolve(ctx);
    this.drawRelativeImage(ctx);
    this.#move();
    this.#applyFriction();
    ctx.restore();
    this.handleOutOfBounds(canvasWidth, canvasHeight);
  }

  public bouncePTA(
    incomingVx: number,
    incomingVy: number,
    nx: number,
    ny: number
  ): void {
    const relVx = this.vx - incomingVx;
    const relVy = this.vy - incomingVy;

    const dot = relVx * nx + relVy * ny;
    const reflVx = relVx - 2 * dot * nx;
    const reflVy = relVy - 2 * dot * ny;

    const restitution = 0.08;
    this.vx = (reflVx + incomingVx) * restitution;
    this.vy = (reflVy + incomingVy) * restitution;
  }

  public shouldPlayCollision(currentTime: number): boolean {
    if (currentTime - this.#lastCollisionTime > this.#collisionTimeCooldownMS) {
      this.#lastCollisionTime = currentTime;
      return true;
    }
    return false;
  }

  public bounceATA(other: Asteroid): boolean {
    const { nx, ny } = calculateCollisionNormal(this, other);

    const rvx = this.vx - other.vx;
    const rvy = this.vy - other.vy;

    const velAlongNormal = rvx * nx + rvy * ny;

    if (velAlongNormal > 0) return false;

    const restitution = 1;

    const impulse =
      (-(1 + restitution) * velAlongNormal) / (1 / this.mass + 1 / other.mass);

    const ix = impulse * nx;
    const iy = impulse * ny;

    this.vx += ix / this.mass;
    this.vy += iy / this.mass;
    other.vx -= ix / other.mass;
    other.vy -= iy / other.mass;

    return true;
  }

  public bounce(): void {
    this.vx *= -1;
    this.vy *= -1;
  }

  public stop() {
    this.vx = 0;
    this.vy = 0;
  }

  #applyFriction(): void {
    if (this.vx > 0) this.vx *= this.#friction;
    if (this.vy > 0) this.vy *= this.#friction;
  }

  #move(): void {
    this.x += this.vx * this.#friction;
    this.y += this.vy * this.#friction;
  }
}
