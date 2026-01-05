import { DIAGONAL_MODIFIER } from "../constants/constants.js";
DIAGONAL_MODIFIER;

export class Projectile {
  #vx: number;
  #vy: number;
  #x: number;
  #y: number;
  #angle: number;
  #img?: HTMLImageElement;

  #width = 8;
  #height = 15;
  active = false;
  constructor(x: number, y: number, vx: number, vy: number, angle: number) {
    this.#x = x;
    this.#y = y;
    this.#vx = vx;
    this.#vy = vy;
    this.#angle = angle;
    this.active = true;

    const img = new Image(this.#width, this.#height);

    img.onload = () => {
      this.#img = img;
    };

    img.src = "assets/projectile.png";
  }

  get x(): number {
    return this.#x;
  }
  get y(): number {
    return this.#y;
  }

  get width(): number {
    return this.#width;
  }
  get height(): number {
    return this.#height;
  }

  public move(): void {
    const currentCoeff = this.#vx && this.#vy ? DIAGONAL_MODIFIER : 1;

    this.#x += this.#vx * currentCoeff;
    this.#y += this.#vy * currentCoeff;
  }

  public update(
    ctx: CanvasRenderingContext2D,
    canvasWidth: number,
    canvasHeight: number
  ): void {
    this.draw(ctx);
    this.move();
    this.#handleOutOfBounds(canvasWidth, canvasHeight);
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    if (!this.#img) return;
    ctx.drawImage(this.#img, this.#x, this.#y);
  }

  #handleOutOfBounds(canvasWidth: number, canvasHeight: number): void {
    if (this.#x >= canvasWidth || this.#x < -this.#width) {
      this.active = false;
    }
    if (this.#y >= canvasHeight || this.#y < -this.#height) {
      this.active = false;
    }
  }
}
