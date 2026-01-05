import { DIAGONAL_MODIFIER } from "../constants/constants.js";
import { BaseEntity } from "./entity.js";
DIAGONAL_MODIFIER;

export class Projectile extends BaseEntity {
  #vx: number;
  #vy: number;
  #angle: number;
  active = false;
  constructor(x: number, y: number, vx: number, vy: number, angle: number) {
    super(x, y, 8, 15);
    this.#vx = vx;
    this.#vy = vy;
    this.#angle = angle;
    this.active = true;

    const img = new Image(this.width, this.height);

    img.onload = () => {
      this.img = img;
    };

    img.src = "assets/projectile.png";
  }

  public update(
    ctx: CanvasRenderingContext2D,
    canvasWidth: number,
    canvasHeight: number
  ): void {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.width / 2);
    ctx.rotate(this.#angle);
    this.drawRelativeImage(ctx);
    this.drawHitBox(ctx);
    ctx.restore();
    this.#move();
    this.#handleOutOfBounds(canvasWidth, canvasHeight);
  }

  #move(): void {
    const currentCoeff = this.#vx && this.#vy ? DIAGONAL_MODIFIER : 1;

    this.x += this.#vx * currentCoeff;
    this.y += this.#vy * currentCoeff;
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
