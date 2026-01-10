import {
  asteroidCount,
  defaultKeys,
  maxObstacleSize,
  PLAYER_TWO_CONTROLS,
} from "./constants/constants.js";
import { Asteroid } from "./entities/asteroid.js";
import { BaseEntity } from "./entities/entity.js";
import { Projectile } from "./entities/projectile.js";
import { Ship } from "./entities/ship.js";
import { currentColorP1, currentColorP2 } from "./menu.js";
import type { EntityType, KeyName, KeyState } from "./types/types.js";

Ship;
export let asteroidGameAnimation: number;

export class AsteroidGame {
  #ctx: CanvasRenderingContext2D;
  #width: number;
  #height: number;
  #playerOne!: Ship;
  #playerTwo!: Ship;
  #P1Projectiles: Projectile[] = [];
  #P2Projectiles: Projectile[] = [];
  #asteroids: Asteroid[] = [];
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

    this.#createPlayers();

    this.#populateAsteroidsArray();

    window.addEventListener("keydown", (e) => this.#setKey(e, true));
    window.addEventListener("keyup", (e) => this.#setKey(e, false));

    this.loop();
  }
  public loop(): void {
    this.#ctx.clearRect(0, 0, this.#width, this.#height);

    this.#drawBackground();

    this.#drawAsteroids();

    this.#addShotProjectiles();

    this.#destroyInactiveProjectiles();

    this.#moveProjectiles();

    this.#updateActivePlayers();

    this.#handleChangePlayerColors();

    this.#destroyInactivePlayes();

    this.#handlePlayerToAsteroidCollision();

    this.#handleAsteroidToAsteroidCollision();

    this.#handleProjectileToAsteroidCollision();

    this.#handlePlayerCollision();

    asteroidGameAnimation = requestAnimationFrame(() => this.loop());
  }

  #calculateCollisionNormal(
    entityOne: BaseEntity,
    entityTwo: BaseEntity
  ): { nx: number; ny: number } {
    const { x: ax, y: ay } = entityOne.getCoordinates();
    const { width: aWidth, height: aHeight } = entityOne.getSize();

    const { x: bx, y: by } = entityTwo.getCoordinates();
    const { width: bWidth, height: bHeight } = entityTwo.getSize();

    const dx = ax + aWidth / 2 - (bx + bWidth / 2);
    const dy = ay + aHeight / 2 - (by + bHeight / 2);
    const dist = Math.hypot(dx, dy) || 1;

    const nx = dx / dist;
    const ny = dy / dist;
    return { nx, ny };
  }

  #populateAsteroidsArray(): void {
    for (let i = 1; i <= asteroidCount; i++) {
      let { x, y } = this.#getRandomCoordinates();
      let asteroid = new Asteroid(x, y);

      let isOverlapping;
      do {
        ({ x, y } = this.#getRandomCoordinates());
        asteroid = new Asteroid(x, y);

        isOverlapping = false;

        if (
          this.#checkCollision(asteroid, this.#playerOne) ||
          this.#checkCollision(asteroid, this.#playerTwo)
        ) {
          isOverlapping = true;
        }

        for (const ast of this.#asteroids) {
          if (this.#checkCollision(ast, asteroid)) {
            isOverlapping = true;
            break;
          }
        }
      } while (isOverlapping);
      this.#asteroids.push(asteroid);
    }
  }

  #handleProjectileToAsteroidCollision() {
    for (const projectile of this.#P1Projectiles) {
      for (const asteroid of this.#asteroids) {
        if (this.#checkCollision(projectile, asteroid)) {
          projectile.active = false;
        }
      }
    }
  }

  #handlePlayerToAsteroidCollision() {
    for (const asteroid of this.#asteroids) {
      if (this.#checkCollision(asteroid, this.#playerOne)) {
        const { nx, ny } = this.#calculateCollisionNormal(
          asteroid,
          this.#playerOne
        );

        const { vx, vy } = this.#playerOne.getVelocity();
        asteroid.bouncePTA(vx, vy, nx, ny);
        this.#playerOne.bounce(nx, ny);
      }
      if (this.#checkCollision(asteroid, this.#playerTwo)) {
        const { nx, ny } = this.#calculateCollisionNormal(
          asteroid,
          this.#playerTwo
        );

        const { vx, vy } = this.#playerTwo.getVelocity();
        asteroid.bouncePTA(vx, vy, nx, ny);
        this.#playerTwo.bounce(nx, ny);
      }
    }
  }

  #handleAsteroidToAsteroidCollision() {
    for (let i = 0; i < asteroidCount; i++) {
      for (let j = 0; j < asteroidCount; j++) {
        const asteroid1 = this.#asteroids[i];
        const asteroid2 = this.#asteroids[j];
        if (j !== i && this.#checkCollision(asteroid1, asteroid2)) {
          const result = asteroid1.bounceATA(asteroid2);
          if (!result) {
            asteroid2.bounce();
          }
        }
      }
    }
  }

  #createPlayers(): void {
    this.#playerOne = new Ship({ color: currentColorP1 });
    this.#playerTwo = new Ship({
      controls: PLAYER_TWO_CONTROLS,
      initialCoordinates: {
        x: this.#width - 45,
        y: this.#height - 64,
      },
      initialAngle: Math.PI,
      color: currentColorP2,
    });
  }

  #drawAsteroids(): void {
    this.#asteroids.forEach((asteroid) =>
      asteroid.update(this.#ctx, this.#width, this.#height)
    );
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

  #destroyInactiveProjectiles(): void {
    this.#P1Projectiles = this.#P1Projectiles.filter((p) => p.active);
    this.#P2Projectiles = this.#P2Projectiles.filter((p) => p.active);
  }
  #moveProjectiles(): void {
    if (this.#P1Projectiles.length > 0) {
      this.#P1Projectiles.forEach((projectile) =>
        projectile.update(this.#ctx, this.#width, this.#height)
      );
    }
    if (this.#P2Projectiles.length > 0) {
      this.#P2Projectiles.forEach((projectile) =>
        projectile.update(this.#ctx, this.#width, this.#height)
      );
    }
  }

  #updateActivePlayers(): void {
    if (this.#playerOne.active) {
      this.#playerOne.update(this.#ctx, this.#keys, this.#width, this.#height);
    }
    if (this.#playerTwo.active) {
      this.#playerTwo.update(this.#ctx, this.#keys, this.#width, this.#height);
    }
  }

  #checkCollision(objOne: EntityType, objTwo: EntityType): boolean {
    return !(
      objOne.right < objTwo.left ||
      objOne.left > objTwo.right ||
      objOne.top > objTwo.bottom ||
      objOne.bottom < objTwo.top
    );
  }

  #destroyInactivePlayes(): void {
    for (const projectile of this.#P1Projectiles) {
      if (this.#checkCollision(projectile, this.#playerTwo)) {
        projectile.active = false;
        this.#playerTwo.active = false;
        break;
      }
    }

    for (const projectile of this.#P2Projectiles) {
      if (this.#checkCollision(projectile, this.#playerOne)) {
        projectile.active = false;
        this.#playerOne.active = false;
        break;
      }
    }
  }

  #handleChangePlayerColors() {
    if (this.#playerOne.getColor() !== currentColorP1) {
      this.#playerOne.changeColor(currentColorP1);
    }
    if (this.#playerTwo.getColor() !== currentColorP2) {
      this.#playerTwo.changeColor(currentColorP2);
    }
  }

  #handlePlayerCollision(): void {
    if (this.#checkCollision(this.#playerOne, this.#playerTwo)) {
      const { nx, ny } = this.#calculateCollisionNormal(
        this.#playerOne,
        this.#playerTwo
      );
      this.#playerOne.bounce(nx, ny);
      this.#playerTwo.bounce(nx, ny);
    }
  }

  #setKey(e: KeyboardEvent, state: boolean): void {
    let key = e.key;
    if (e.key.length === 1) key = key.toLowerCase();
    if (key in this.#keys) this.#keys[key as KeyName] = state;
  }

  // x, y within bounds and maxObstacleSize pixels off the borders
  #getRandomCoordinates(): { x: number; y: number } {
    const randomX = Math.floor(Math.random() * this.#width);
    const randomY = Math.floor(Math.random() * this.#height);
    const x = Math.min(
      this.#width - maxObstacleSize,
      Math.max(randomX, maxObstacleSize)
    );
    const y = Math.min(
      this.#height - maxObstacleSize,
      Math.max(randomY, maxObstacleSize)
    );
    return { x, y };
  }
}
