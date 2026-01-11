import { BaseEntity } from "./entity";

export class AoePowerUp extends BaseEntity {
  active = true;

  #revolveCoefficient: number = 0;
  #scale: number = 0.1;
  #scaleCoefficient: number = 0.03;

  public static aoePowerUpCooldown: number = 2000;
  constructor(x: number, y: number) {
    super(x, y, 32, 32);
    const image = new Image();

    this.#revolveCoefficient = this.#getRandomRevovleCoefficient();

    image.onload = () => (this.img = image);

    image.src = "assets/power_ups/aoe_power_up.png";
  }

  update(ctx: CanvasRenderingContext2D) {
    ctx.save();
    this.revolve(ctx, this.#revolveCoefficient);
    this.#scaleUp(ctx);
    this.drawRelativeImage(ctx);

    ctx.restore();
  }

  #scaleUp(ctx: CanvasRenderingContext2D) {
    if (this.#scale > 1) return;
    this.#scale += this.#scaleCoefficient;
    ctx.scale(this.#scale, this.#scale);
  }

  #getRandomRevovleCoefficient() {
    return Math.random() * 0.002 - 0.001;
  }
}
