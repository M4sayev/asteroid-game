import {
  asteroidCount,
  defaultKeys,
  maxObstacleSize,
  PLAYER_TWO_CONTROLS,
  powerUpCountMap,
} from "./constants/constants.js";
import { Asteroid } from "./entities/asteroid.js";
import { BaseEntity } from "./entities/entity.js";
import { PowerUp } from "./entities/powerup.js";
import { Projectile } from "./entities/projectile.js";
import { Ship } from "./entities/ship.js";
import { currentColorP1, currentColorP2 } from "./menu/menuState.js";
import type {
  EntityType,
  KeyName,
  KeyState,
  PowerUpType,
} from "./types/types.js";
import { getRandomIndex } from "./utils/utils.js";

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
  #powerups: PowerUp[] = [];
  #powerupsCount: Record<PowerUpType, number> = {
    aoe: 0,
    shotgun: 0,
  };

  #audioCtx: AudioContext;
  #shootBuffer?: AudioBuffer;
  #powerUpBuffer?: AudioBuffer;
  #asteroidCollisionBuffer?: AudioBuffer;
  #playerDestructionBuffer?: AudioBuffer;
  #keys: KeyState = defaultKeys;
  #bg?: HTMLImageElement;

  #powerUpCooldowns: Record<PowerUpType, number> = {
    aoe: PowerUp.powerUpCooldownsMap["aoe"],
    shotgun: PowerUp.powerUpCooldownsMap["shotgun"],
  };
  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.#ctx = ctx;
    this.#width = width;
    this.#height = height;

    // background image
    const img = new Image();

    img.onload = () => {
      this.#bg = img;
    };

    img.src = "assets/bg-new.png";

    this.#audioCtx = new AudioContext();

    this.#init();
  }

  async #init() {
    this.#createPlayers();

    this.#populateAsteroidsArray();

    window.addEventListener("keydown", (e) => this.#setKey(e, true));
    window.addEventListener("keyup", (e) => this.#setKey(e, false));

    await this.#preloadSounds();

    window.addEventListener("keydown", () => this.#audioCtx.resume(), {
      once: true,
    });

    this.loop();
  }

  async #preloadSounds() {
    const loadBuffer = async (url: string) => {
      const data = await fetch(url).then((r) => r.arrayBuffer());
      return await this.#audioCtx.decodeAudioData(data);
    };

    this.#shootBuffer = await loadBuffer(
      "assets/projectile/projectile_audio.ogg"
    );
    this.#powerUpBuffer = await loadBuffer(
      "assets/power_ups/power_up_audio.ogg"
    );
    this.#asteroidCollisionBuffer = await loadBuffer(
      "assets/obstacles/asteroid_hit.m4a"
    );
    this.#playerDestructionBuffer = await loadBuffer(
      "assets/ship/player_destruction.m4a"
    );
  }

  public loop(): void {
    this.#ctx.clearRect(0, 0, this.#width, this.#height);

    this.#populatePowerUps();

    this.#drawBackground();

    this.#drawAsteroids();

    this.#drawPowerUps();

    this.#collectPowerUps();

    this.#handlePowerUpCooldown();

    this.#destroyInactivePowerUps();

    this.#addShotProjectiles();

    this.#destroyInactiveProjectiles();

    this.#moveProjectiles();

    this.#updatePlayers();

    this.#handleChangePlayerColors();

    this.#destroyInactivePlayes();

    this.#handlePlayerToAsteroidCollision();

    this.#handleAsteroidToAsteroidCollision();

    this.#handleProjectileToAsteroidCollision();

    this.#handlePlayerCollision();

    asteroidGameAnimation = requestAnimationFrame(() => this.loop());
  }

  #drawPowerUps(): void {
    for (const powerUp of this.#powerups) {
      if (powerUp.active) powerUp.update(this.#ctx);
    }
  }

  #handlePowerUpCooldown(): void {
    if (this.#powerUpCooldowns["aoe"] > 0) {
      this.#powerUpCooldowns["aoe"]--;
    }
    if (this.#powerUpCooldowns["shotgun"] > 0) {
      this.#powerUpCooldowns["shotgun"]--;
    }
  }

  #populatePowerUps(): void {
    const powerUps = Object.keys(powerUpCountMap) as PowerUpType[];
    const randomType = powerUps[getRandomIndex(powerUps.length)];
    if (this.#powerupsCount[randomType] >= powerUpCountMap[randomType]) {
      this.#powerUpCooldowns[randomType] =
        PowerUp.powerUpCooldownsMap[randomType];
      return;
    }

    if (this.#powerUpCooldowns[randomType] > 0) return;

    for (let i = 1; i <= powerUpCountMap[randomType]; i++) {
      let { x, y } = this.#getRandomCoordinates();
      let powerUp = new PowerUp(x, y, randomType);

      let isOverlapping;

      do {
        ({ x, y } = this.#getRandomCoordinates());
        powerUp = new PowerUp(x, y, randomType);

        isOverlapping = false;

        if (
          this.#checkCollision(powerUp, this.#playerOne) ||
          this.#checkCollision(powerUp, this.#playerTwo)
        ) {
          isOverlapping = true;
        }
        for (const ast of this.#asteroids) {
          if (this.#checkCollision(ast, powerUp)) {
            isOverlapping = true;
            break;
          }
        }
      } while (isOverlapping);
      this.#powerUpCooldowns[randomType] =
        PowerUp.powerUpCooldownsMap[randomType];
      this.#powerupsCount[randomType]++;
      this.#powerups.push(powerUp);
      break;
    }
  }

  #playPowerUpAudio(): void {
    if (!this.#powerUpBuffer) return;
    const src = this.#audioCtx.createBufferSource();
    src.playbackRate.value = 2.7;
    src.buffer = this.#powerUpBuffer;

    const gain = this.#audioCtx.createGain();
    gain.gain.value = 0.5;
    src.connect(gain).connect(this.#audioCtx.destination);
    src.start(0, 1.7);
  }

  #playPlayerDestructionAudio(): void {
    if (!this.#playerDestructionBuffer) return;

    const src = this.#audioCtx.createBufferSource();
    src.buffer = this.#playerDestructionBuffer;

    const gain = this.#audioCtx.createGain();
    gain.gain.value = 0.7;

    src.connect(gain).connect(this.#audioCtx.destination);
    src.start(0, 0, 1.3);
  }

  #collectPowerUps(): void {
    for (const powerUp of this.#powerups) {
      if (this.#checkCollision(this.#playerOne, powerUp)) {
        this.#playPowerUpAudio();
        if (powerUp.type === "aoe") {
          const projectiles: Projectile[] = this.#playerOne.useAoEPowerUp();
          this.#P1Projectiles.push(...projectiles);
        } else if (powerUp.type === "shotgun") {
          this.#playerOne.hasPowerupShotgun = true;
        }
        powerUp.active = false;
        this.#powerUpCooldowns[powerUp.type] =
          PowerUp.powerUpCooldownsMap[powerUp.type];
      }
      if (this.#checkCollision(this.#playerTwo, powerUp)) {
        this.#playPowerUpAudio();
        if (powerUp.type === "aoe") {
          const projectiles: Projectile[] = this.#playerTwo.useAoEPowerUp();
          this.#P2Projectiles.push(...projectiles);
        } else if (powerUp.type === "shotgun") {
          this.#playerTwo.hasPowerupShotgun = true;
        }
        powerUp.active = false;
        this.#powerUpCooldowns[powerUp.type] =
          PowerUp.powerUpCooldownsMap[powerUp.type];
      }
    }
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

  #playAsteroidHit(volume: number, speed: number = 1): void {
    if (!this.#asteroidCollisionBuffer) return;
    const src = this.#audioCtx.createBufferSource();
    src.buffer = this.#asteroidCollisionBuffer;

    const gain = this.#audioCtx.createGain();
    gain.gain.value = volume;
    src.connect(gain).connect(this.#audioCtx.destination);
    src.start(0, speed);
  }
  #handleProjectileToAsteroidCollision(): void {
    for (const projectile of this.#P1Projectiles) {
      for (const asteroid of this.#asteroids) {
        if (this.#checkCollision(projectile, asteroid)) {
          projectile.active = false;
          this.#playAsteroidHit(2, 1.5);
        }
      }
    }
  }

  #handlePlayerToAsteroidCollision() {
    for (const asteroid of this.#asteroids) {
      if (this.#checkCollision(asteroid, this.#playerOne)) {
        this.#playAsteroidHit(1.4, 1);
        const { nx, ny } = this.#calculateCollisionNormal(
          asteroid,
          this.#playerOne
        );

        const { vx, vy } = this.#playerOne.getVelocity();
        asteroid.bouncePTA(vx, vy, nx, ny);
        this.#playerOne.bounce(nx, ny);
      }
      if (this.#checkCollision(asteroid, this.#playerTwo)) {
        this.#playAsteroidHit(1.4, 1);
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
      if (Array.isArray(newProjectileOne))
        this.#P1Projectiles.push(...newProjectileOne);
      else this.#P1Projectiles.push(newProjectileOne);
    }

    if (newProjectileTwo) {
      if (Array.isArray(newProjectileTwo))
        this.#P2Projectiles.push(...newProjectileTwo);
      else this.#P2Projectiles.push(newProjectileTwo);
    }
  }

  #destroyInactivePowerUps() {
    this.#powerups = this.#powerups.filter((p) => {
      if (!p.active) this.#powerupsCount[p.type]--;
      return p.active;
    });
  }
  #destroyInactiveProjectiles(): void {
    this.#P1Projectiles = this.#P1Projectiles.filter((p) => p.active);
    this.#P2Projectiles = this.#P2Projectiles.filter((p) => p.active);
  }
  #moveProjectiles(): void {
    if (this.#P1Projectiles.length > 0) {
      for (const projectile of this.#P1Projectiles) {
        projectile.update(this.#ctx, this.#width, this.#height);
      }
    }
    if (this.#P2Projectiles.length > 0) {
      for (const projectile of this.#P2Projectiles) {
        projectile.update(this.#ctx, this.#width, this.#height);
      }
    }
  }

  #updatePlayers(): void {
    this.#playerOne.update(this.#ctx, this.#keys, this.#width, this.#height);
    this.#playerTwo.update(this.#ctx, this.#keys, this.#width, this.#height);
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
        this.#playPlayerDestructionAudio();
        projectile.active = false;
        this.#playerTwo.active = false;
        break;
      }
    }

    for (const projectile of this.#P2Projectiles) {
      if (this.#checkCollision(projectile, this.#playerOne)) {
        this.#playPlayerDestructionAudio();
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
