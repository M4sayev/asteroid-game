import { defaultKeys, PLAYER_TWO_CONTROLS } from "./constants/constants.js";
import { Projectile } from "./entities/projectile.js";
import { Ship } from "./entities/ship.js";
import type { EntityType, KeyName, KeyState } from "./types/types.js";

Ship;
export let asteroidGameAnimation: number;

export class AsteroidGame {
  #ctx: CanvasRenderingContext2D;
  #width: number;
  #height: number;
  #playerOne: Ship;
  #playerTwo: Ship;
  #P1Projectiles: Projectile[] = [];
  #P2Projectiles: Projectile[] = [];
  #keys: KeyState = defaultKeys;
  #bg?: HTMLImageElement;

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.#ctx = ctx;
    this.#width = width;
    this.#height = height;

    const img = new Image();

    img.onload = () => {
      this.#bg = img;
    };

    img.src = "assets/bg-new.png";

    this.#playerOne = new Ship({ color: "purple" });
    this.#playerTwo = new Ship({
      controls: PLAYER_TWO_CONTROLS,
      initialCoordinates: {
        x: width - 45,
        y: height - 64,
      },
      initialAngle: Math.PI,
      color: "black",
    });

    window.addEventListener("keydown", (e) => this.#setKey(e, true));
    window.addEventListener("keyup", (e) => this.#setKey(e, false));

    this.loop();
  }
  public loop(): void {
    this.#ctx.clearRect(0, 0, this.#width, this.#height);

    this.#drawBackground();

    this.#addShotProjectiles();

    this.#destroyInactiveProjectiles();

    this.#moveProjectiles();

    if (this.#playerOne.active) {
      this.#playerOne.update(this.#ctx, this.#keys, this.#width, this.#height);
    }
    if (this.#playerTwo.active) {
      this.#playerTwo.update(this.#ctx, this.#keys, this.#width, this.#height);
    }

    for (const p of this.#P1Projectiles) {
      if (this.#checkCollision(p, this.#playerTwo)) {
        p.active = false;
        this.#playerTwo.active = false;
        break;
      }
    }

    for (const p of this.#P2Projectiles) {
      if (this.#checkCollision(p, this.#playerOne)) {
        p.active = false;
        this.#playerOne.active = false;
        break;
      }
    }

    if (this.#checkCollision(this.#playerOne, this.#playerTwo)) {
      this.#playerOne.bounce();
      this.#playerTwo.bounce();
    }
    asteroidGameAnimation = requestAnimationFrame(() => this.loop());
  }

  #drawBackground(): void {
    if (this.#bg) {
      const scale = Math.max(
        this.#width / this.#bg.width,
        this.#height / this.#bg.height
      );

      const drawWidth = this.#bg.width * scale;
      const drawHeight = this.#bg.height * scale;

      const x = (this.#width - drawWidth) / 2;
      const y = (this.#height - drawHeight) / 2;

      this.#ctx.drawImage(this.#bg, x, y, drawWidth, drawHeight);
    }
  }

  #addShotProjectiles(): void {
    const newProjectileOne = this.#playerOne.shoot(this.#keys);
    const newProjectileTwo = this.#playerTwo.shoot(this.#keys);

    if (newProjectileOne) {
      this.#P1Projectiles.push(newProjectileOne);
    }

    if (newProjectileTwo) {
      this.#P2Projectiles.push(newProjectileTwo);
    }
  }

  #moveProjectiles(): void {
    if (this.#P1Projectiles.length > 0) {
      this.#P1Projectiles.forEach((p) =>
        p.update(this.#ctx, this.#width, this.#height)
      );
    }
    if (this.#P2Projectiles.length > 0) {
      this.#P2Projectiles.forEach((p) =>
        p.update(this.#ctx, this.#width, this.#height)
      );
    }
  }

  #destroyInactiveProjectiles(): void {
    this.#P1Projectiles = this.#P1Projectiles.filter((p) => p.active);
    this.#P2Projectiles = this.#P2Projectiles.filter((p) => p.active);
  }
  #checkCollision(objOne: EntityType, objTwo: EntityType): boolean {
    return !(
      objOne.right < objTwo.left ||
      objOne.left > objTwo.right ||
      objOne.top > objTwo.bottom ||
      objOne.bottom < objTwo.top
    );
  }

  #setKey(e: KeyboardEvent, state: boolean): void {
    let key = e.key;
    if (e.key.length === 1) key = key.toLowerCase();
    if (key in this.#keys) this.#keys[key as KeyName] = state;
  }
}
