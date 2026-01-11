import type { PowerUpType } from "../types/types";
import { BaseEntity } from "./entity";

export class PowerUp extends BaseEntity {
  active = true;

  type: PowerUpType = "shotgun";

  #revolveCoefficient: number = 0;
  #scale: number = 0.1;
  #scaleCoefficient: number = 0.03;

  public static powerUpCooldownsMap: Record<PowerUpType, number> = {
    aoe: 2500,
    shotgun: 1000,
  };
  constructor(x: number, y: number, type: PowerUpType) {
    super(x, y, 32, 32);
    const image = new Image();

    this.#revolveCoefficient = this.#getRandomRevovleCoefficient();

    this.type = type;

    image.onload = () => (this.img = image);

    if (type === "aoe") {
      image.src = "assets/power_ups/aoe_power_up.png";
    } else if (type === "shotgun") {
      image.src = "assets/power_ups/shotgun_power_up.png";
    }
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
