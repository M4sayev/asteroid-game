import { Projectile } from "./projectile.js";
import { Ship } from "./ship.js";
import { EntityType, KeyName, KeyState } from "./types/types.js";

Ship;

window.onload = () => {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  if (ctx) {
    let asteroidGame = new AsteroidGame(ctx, canvas.width, canvas.height);

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      asteroidGame = new AsteroidGame(ctx, canvas.width, canvas.height);
    });
  }
};

class AsteroidGame {
  #ctx: CanvasRenderingContext2D;
  #width: number;
  #height: number;
  #playerOne: Ship;
  #playerTwo: Ship;
  #P1Projectiles: Projectile[] = [];
  #P2Projectiles: Projectile[] = [];
  #keys: KeyState = {
    w: false,
    s: false,
    d: false,
    a: false,
    t: false,
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    m: false,
  };

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.#P1Projectiles = [];
    this.#P2Projectiles = [];
    this.#ctx = ctx;
    this.#width = width;
    this.#height = height;

    this.#playerOne = new Ship(45, 64);
    this.#playerTwo = new Ship(
      45,
      64,
      {
        up: "ArrowUp",
        down: "ArrowDown",
        left: "ArrowLeft",
        right: "ArrowRight",
        shoot: "m",
      },
      { x: width - 45, y: height - 64 }
    );

    window.addEventListener("keydown", (e) => this.#setKey(e, true));
    window.addEventListener("keyup", (e) => this.#setKey(e, false));

    this.loop();
  }

  #checkCollision(objOne: EntityType, objTwo: EntityType): boolean {
    const leftOne = objOne.x;
    const rightOne = objOne.x + objOne.width;
    const topOne = objOne.y;
    const bottomOne = objOne.y + objOne.height;

    const leftTwo = objTwo.x;
    const rightTwo = objTwo.x + objTwo.width;
    const topTwo = objTwo.y;
    const bottomTwo = objTwo.y + objTwo.height;

    return !(
      rightOne < leftTwo ||
      leftOne > rightTwo ||
      topOne > bottomTwo ||
      bottomOne < topTwo
    );
  }

  #setKey(e: KeyboardEvent, state: boolean): void {
    let key = e.key;
    if (e.key.length === 1) key = key.toLowerCase();
    if (key in this.#keys) this.#keys[key as KeyName] = state;
  }

  loop(): void {
    this.#ctx.clearRect(0, 0, this.#width, this.#height);

    this.#addShotProjectiles();

    this.#destroyInactiveProjectiles();

    this.#moveProjectiles();

    this.#playerOne.update(this.#ctx, this.#keys, this.#width, this.#height);
    this.#playerTwo.update(this.#ctx, this.#keys, this.#width, this.#height);

    if (this.#checkCollision(this.#playerOne, this.#playerTwo)) {
      this.#playerOne.bounce();
      this.#playerTwo.bounce();
    }
    requestAnimationFrame(() => this.loop());
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
}
