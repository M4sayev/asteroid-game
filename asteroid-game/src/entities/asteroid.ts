import { asteroids } from "../constants/constants.js";
import { BaseEntity } from "./entity.js";

export class Asteroid extends BaseEntity {
  #friction: number = 0.99;
  vx = 0;
  vy = 0;

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

    const asset = new Image();

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

    const restitution = 0.1;
    this.vx = (reflVx + incomingVx) * restitution;
    this.vy = (reflVy + incomingVy) * restitution;
  }

  public bounceATA(asteroid: Asteroid): boolean {
    const mass = asteroid.getMass();
    const { vx, vy } = asteroid.getVelocity();

    if (mass > this.mass) {
      this.vx = vx;
      this.vy = vy;
      return true;
    } else if (mass == this.mass) {
      this.stop();
      asteroid.stop();
    }

    return false;
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
    if (this.vx > 0.05) this.vx *= this.#friction;
    if (this.vy > 0.05) this.vy *= this.#friction;
  }

  #move(): void {
    this.x += this.vx * this.#friction;
    this.y += this.vy * this.#friction;
  }
}
