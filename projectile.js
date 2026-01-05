import { DIAGONAL_MODIFIER } from "./constants.js";

export class Projectile {
  #vx;
  #vy;
  #x;
  #y;
  #img;
  #angle;
  #width = 8;
  #height = 15;
  active = false;
  constructor(x, y, vx, vy, angle) {
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

  move() {
    const currentCoeff = this.#vx && this.#vy ? DIAGONAL_MODIFIER : 1;

    this.#x += this.#vx * currentCoeff;
    this.#y += this.#vy * currentCoeff;
  }

  update(ctx, canvasWidth, canvasHeight) {
    this.draw(ctx);
    this.move();
    this.#handleOutOfBounds(canvasWidth, canvasHeight);
  }

  #handleOutOfBounds(canvasWidth, canvasHeight) {
    if (this.#x >= canvasWidth || this.#x < -this.#width) {
      this.active = false;
    }
    if (this.#y >= canvasHeight || this.#y < -this.#height) {
      this.active = false;
    }
  }

  draw(ctx) {
    if (!this.#img) return;
    ctx.drawImage(this.#img, this.#x, this.#y);
  }
}
