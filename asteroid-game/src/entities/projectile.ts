import { DIAGONAL_MODIFIER } from "../constants/constants.js";
import type { ColorType } from "../types/types.js";
import { BaseEntity } from "./entity.js";
DIAGONAL_MODIFIER;

export class Projectile extends BaseEntity {
  active = false;
  exploded = false;

  #explosionImg?: HTMLImageElement;
  #explosionScale: number = 0;
  #explosionScaleCoeff: number = 0.05;
  #explosionMaxScale: number = 1.5;

  constructor(
    x: number,
    y: number,
    vx: number,
    vy: number,
    angle: number,
    color: ColorType = "black"
  ) {
    super(x, y, 8, 15);
    this.vx = vx;
    this.vy = vy;
    this.angle = angle;
    this.active = true;

    this.#initAssets(color);
  }

  #initAssets(color: ColorType) {
    const img = new Image(this.width, this.height);

    img.onload = () => {
      this.img = img;
    };

    img.src = `assets/projectile/projectile_${color}.png`;

    const explosion = new Image(32, 32);

    explosion.onload = () => (this.#explosionImg = explosion);

    explosion.src = "assets/projectile/projectile_explosion.png";
  }

  public update(
    ctx: CanvasRenderingContext2D,
    canvasWidth: number,
    canvasHeight: number
  ): void {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.width / 2);
    if (this.exploded) {
      this.#drawExplosion(ctx);
      ctx.restore();
    } else {
      ctx.rotate(this.angle);
      this.drawRelativeImage(ctx);
      // this.drawHitBox(ctx);
      ctx.restore();
      this.#move();
    }
    this.#handleOutOfBounds(canvasWidth, canvasHeight);
  }

  #drawExplosion(ctx: CanvasRenderingContext2D) {
    if (this.#explosionScale > this.#explosionMaxScale) {
      this.active = false;
      return;
    }
    this.#explosionScale += this.#explosionScaleCoeff;
    ctx.scale(this.#explosionScale, this.#explosionScale);
    if (this.#explosionImg) ctx.drawImage(this.#explosionImg, -16, -16);
  }

  #move(): void {
    const currentCoeff = this.vx && this.vy ? DIAGONAL_MODIFIER : 1;

    this.x += this.vx * currentCoeff;
    this.y += this.vy * currentCoeff;
  }

  #handleOutOfBounds(canvasWidth: number, canvasHeight: number): void {
    if (this.x >= canvasWidth || this.x < -this.width) {
      this.active = false;
    }
    if (this.y >= canvasHeight || this.y < -this.height) {
      this.active = false;
    }
  }
}
