import {
  asteroidCount,
  defaultKeys,
  maxObstacleSize,
  PLAYER_ONE_CONTROLS,
  PLAYER_TWO_CONTROLS,
  powerUpCountMap,
} from "./constants/constants.js";
import { Asteroid } from "./entities/asteroid.js";
import { PowerUp } from "./entities/powerup.js";
import { Projectile } from "./entities/projectile.js";
import { Ship } from "./entities/ship.js";
import { SoundManager } from "./entities/soundManager.js";
import {
  currentColorP1,
  currentColorP2,
  playerOneScore,
  setScore,
} from "./menu/menuState.js";
import type {
  ControlsType,
  EntityType,
  KeyName,
  KeyState,
  PlayerNumber,
  PowerUpType,
} from "./types/types.js";
import {
  calculateCollisionNormal,
  getRandomAngle,
  getRandomIndex,
} from "./utils/utils.js";

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

  #resetTimeoutID: ReturnType<typeof setTimeout> = 0;
  #gameResetTimeoutMS: number = 3000;

  #soundService: SoundManager = SoundManager.getInstance();
  #keys: KeyState = defaultKeys;
  #bg?: HTMLImageElement;

  #powerUpCooldowns: Record<PowerUpType, number> = {
    aoe: PowerUp.powerUpCooldownsMap["aoe"],
    shotgun: PowerUp.powerUpCooldownsMap["shotgun"],
  };

  #doubleClickThreshold: number = 300;

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

    this.#init();
  }

  async #init() {
    this.#createPlayers();

    this.#populateAsteroidsArray();

    window.addEventListener("keydown", (e) => this.#setKey(e, true));
    window.addEventListener("keyup", (e) => this.#setKey(e, false));

    this.loop();
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

  #createPlayers(): void {
    const { x: x1, y: y1 } = this.#getRandomCoordinates();
    this.#playerOne = new Ship({
      color: currentColorP1,
      initialCoordinates: { x: x1, y: y1 },
      initialAngle: getRandomAngle(),
    });
    this.#playerTwo = new Ship({
      controls: PLAYER_TWO_CONTROLS,
      initialCoordinates: {
        x: this.#width - x1,
        y: this.#height - y1,
      },
      initialAngle: getRandomAngle(),
      color: currentColorP2,
    });
  }

  #drawPowerUps(): void {
    for (const powerUp of this.#powerups) {
      if (powerUp.active) powerUp.update(this.#ctx);
    }
  }

  #handlePowerUpCooldown(): void {
    for (const type in this.#powerUpCooldowns) {
      if (this.#powerUpCooldowns[type as PowerUpType] > 0) {
        this.#powerUpCooldowns[type as PowerUpType]--;
      }
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

  #usePowerUpsPerPlayer(
    player: Ship,
    powerUp: PowerUp,
    procetilesArr: Projectile[],
  ): void {
    if (!player.active) return;
    if (this.#checkCollision(player, powerUp)) {
      this.#soundService.playPowerUp();
      if (powerUp.type === "aoe") {
        const projectiles: Projectile[] = player.useAoEPowerUp();
        procetilesArr.push(...projectiles);
      } else if (powerUp.type === "shotgun") {
        player.hasPowerupShotgun = true;
      }
      powerUp.active = false;
      this.#powerUpCooldowns[powerUp.type] =
        PowerUp.powerUpCooldownsMap[powerUp.type];
    }
  }

  #collectPowerUps(): void {
    for (const powerUp of this.#powerups) {
      this.#usePowerUpsPerPlayer(this.#playerOne, powerUp, this.#P1Projectiles);
      this.#usePowerUpsPerPlayer(this.#playerTwo, powerUp, this.#P2Projectiles);
    }
  }

  #populateAsteroidsArray(): void {
    for (let i = 1; i <= asteroidCount; i++) {
      let asteroid: Asteroid;

      let isOverlapping;
      let attempts = 0;
      do {
        const { x, y } = this.#getRandomCoordinates();
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

        if (attempts > 100) break;
      } while (isOverlapping);
      this.#asteroids.push(asteroid);
    }
  }

  #handleProjectileToAsteroidCollision(): void {
    for (const projectile of this.#P1Projectiles) {
      for (const asteroid of this.#asteroids) {
        if (this.#checkCollision(projectile, asteroid)) {
          if (!projectile.exploded) {
            this.#soundService.playAsteroidHit(2, 1.5);
          }
          projectile.exploded = true;
        }
      }
    }
  }

  #handlePlayerAsteroidCollision(
    asteroid: Asteroid,
    player: Ship,
    currentTimeMs: number,
  ) {
    if (this.#checkCollision(asteroid, player)) {
      if (asteroid.shouldPlayCollision(currentTimeMs)) {
        this.#soundService.playAsteroidHit(1.4, 1);
      }
      const { nx, ny } = calculateCollisionNormal(asteroid, player);

      const { vx, vy } = player.getVelocity();
      asteroid.bouncePTA(vx, vy, nx, ny);
      player.bounce(nx, ny);
    }
  }

  #handlePlayerToAsteroidCollision() {
    const now = performance.now();
    for (const asteroid of this.#asteroids) {
      this.#handlePlayerAsteroidCollision(asteroid, this.#playerOne, now);
      this.#handlePlayerAsteroidCollision(asteroid, this.#playerTwo, now);
    }
  }

  #handleAsteroidToAsteroidCollision() {
    for (let i = 0; i < asteroidCount; i++) {
      for (let j = i + 1; j < asteroidCount; j++) {
        const asteroid1 = this.#asteroids[i];
        const asteroid2 = this.#asteroids[j];
        if (this.#checkCollision(asteroid1, asteroid2)) {
          const result = asteroid1.bounceATA(asteroid2);
          const now = performance.now();
          if (
            asteroid1.shouldPlayCollision(now) ||
            asteroid2.shouldPlayCollision(now)
          ) {
            this.#soundService.playAsteroidHit(0.8, 0.5);
          }
          if (!result) {
            asteroid2.bounce();
          }
        }
      }
    }
  }

  #drawAsteroids(): void {
    this.#asteroids.forEach((asteroid) =>
      asteroid.update(this.#ctx, this.#width, this.#height),
    );
  }

  #drawBackground(): void {
    if (this.#bg) {
      const scale = Math.max(
        this.#width / this.#bg.width,
        this.#height / this.#bg.height,
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
      this.#P1Projectiles.push(...newProjectileOne);
    }

    if (newProjectileTwo) {
      this.#P2Projectiles.push(...newProjectileTwo);
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
    for (const projectile of this.#P1Projectiles) {
      projectile.update(this.#ctx, this.#width, this.#height);
    }
    for (const projectile of this.#P2Projectiles) {
      projectile.update(this.#ctx, this.#width, this.#height);
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

  #destroyPlayer(
    player: Ship,
    enemyProjectiles: Projectile[],
    playerName: PlayerNumber,
  ): void {
    if (!player.active) return;

    for (const projectile of enemyProjectiles) {
      if (this.#checkCollision(projectile, player)) {
        if (!projectile.exploded) {
          this.#soundService.playPlayerDestruction();
        }
        setScore(playerName, (prev) => prev + 1);
        console.log(playerOneScore);

        projectile.exploded = true;
        player.active = false;

        this.#resetGame();

        break;
      }
    }
  }

  #resetPowerUpCooldowns(): void {
    for (const powerUp in this.#powerUpCooldowns)
      this.#powerUpCooldowns[powerUp as PowerUpType] = 0;
  }
  #resetPowerUpCounts(): void {
    for (const type in this.#powerupsCount) {
      this.#powerupsCount[type as PowerUpType] = 0;
    }
  }

  #resetGame(): void {
    clearTimeout(this.#resetTimeoutID);

    this.#resetTimeoutID = setTimeout(() => {
      const { x: x1, y: y1 } = this.#getRandomCoordinates();

      this.#P1Projectiles = [];
      this.#P2Projectiles = [];

      this.#asteroids = [];

      this.#powerups = [];

      this.#resetPowerUpCooldowns();
      this.#resetPowerUpCounts();

      this.#playerOne.reset(x1, y1, getRandomAngle());
      this.#playerTwo.reset(
        this.#width - x1,
        this.#height - y1,
        getRandomAngle(),
      );

      this.#populateAsteroidsArray();
    }, this.#gameResetTimeoutMS);
  }

  #destroyInactivePlayes(): void {
    // 3rd argument is the player to update the score of
    this.#destroyPlayer(this.#playerTwo, this.#P1Projectiles, "one");
    this.#destroyPlayer(this.#playerOne, this.#P2Projectiles, "two");
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
    if (!this.#playerOne.active || !this.#playerTwo.active) return;
    if (this.#checkCollision(this.#playerOne, this.#playerTwo)) {
      const { nx, ny } = calculateCollisionNormal(
        this.#playerOne,
        this.#playerTwo,
      );
      this.#playerOne.bounce(nx, ny);
      this.#playerTwo.bounce(nx, ny);
    }
  }

  #setKey(e: KeyboardEvent, state: boolean): void {
    let key = e.key;
    if (e.key.length === 1) key = key.toLowerCase();
    if (key in this.#keys) {
      this.#setLastPressedKeyByPlayer(
        key as KeyName,
        this.#playerOne,
        PLAYER_ONE_CONTROLS,
      );
      this.#setLastPressedKeyByPlayer(
        key as KeyName,
        this.#playerTwo,
        PLAYER_TWO_CONTROLS,
      );

      this.#keys[key as KeyName] = state;
    }
  }

  #setLastPressedKeyByPlayer(
    key: KeyName,
    player: Ship,
    playerControls: ControlsType,
  ) {
    if (!Object.values(playerControls).includes(key)) return;
    if (key == playerControls.shoot) return;

    const now = performance.now();

    const last = player.lastKeyPressTimeMS[key] ?? 0;

    const isDoubleClick =
      last !== 0 &&
      !this.#keys[key] &&
      key === player.lastPressedKey &&
      now - last < this.#doubleClickThreshold;

    if (isDoubleClick) {
      player.thrust();
    }

    player.lastPressedKey = key;
    player.lastKeyPressTimeMS[key] = now;

    const directionalKeys = Object.values(playerControls).filter(
      (k) => k !== playerControls.shoot && k !== key,
    );
    for (const k of directionalKeys) {
      player.lastKeyPressTimeMS[k] = 0;
    }
  }

  // x, y within bounds and maxObstacleSize pixels off the borders
  #getRandomCoordinates(): { x: number; y: number } {
    const randomX = Math.floor(Math.random() * this.#width);
    const randomY = Math.floor(Math.random() * this.#height);
    const x = Math.min(
      this.#width - maxObstacleSize,
      Math.max(randomX, maxObstacleSize),
    );
    const y = Math.min(
      this.#height - maxObstacleSize,
      Math.max(randomY, maxObstacleSize),
    );
    return { x, y };
  }
}
