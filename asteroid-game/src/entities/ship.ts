import {
  DIAGONAL_MODIFIER,
  PLAYER_ONE_CONTROLS,
} from "../constants/constants.js";
import { Projectile } from "./projectile.js";
import type {
  ColorType,
  ControlsType,
  InitialCoordinates,
  KeyName,
  KeyState,
} from "../types/types.js";
import { BaseEntity } from "./entity.js";
import { SoundManager } from "./soundManager.js";
import { gameState } from "../menu/menuState.js";

interface ShipConstructorArgs {
  width?: number;
  height?: number;
  controls?: ControlsType;
  initialCoordinates?: InitialCoordinates;
  initialAngle?: number;
  color?: ColorType;
}

export class Ship extends BaseEntity {
  #controls: ControlsType;
  #color: ColorType;

  #horizontal = 0;
  #vertical = 0;
  #cooldown = 0;
  active = true;

  // shotgun powerup
  hasPowerupShotgun = false;

  public static shotgunTimeoutConst = 500;
  #shotgunTimeout = Ship.shotgunTimeoutConst;

  #explosionScale: number = 0;
  #explosionMaxScale: number = 2;
  #explosionScaleCoeff: number = 0.05;
  #explosionImage?: HTMLImageElement;

  #soundService: SoundManager = SoundManager.getInstance();

  // constants
  #projectileSpeed = 10;
  #shootCooldown = 150;
  #maxVelocity = 10;
  #acceleration = 0.01;
  #rotationSpeed = 0.02;
  #friction = 0.99;
  #aoeProjectileCount = 6;
  #shotgunSpreadCoeff = 0.2;

  // thrust
  public static thrustTimeoutConst = 1000;
  lastPressedKey?: KeyName;
  lastKeyPressTimeMS = {} as Record<KeyName, number>;
  #thrustTimeout = 0;

  #thrustFlameImg?: HTMLImageElement;
  #thrustCoefficient = 3;

  #thrustingTime = 920;

  #thrustFlameAngle = 0;

  constructor({
    width = 45,
    height = 64,
    controls = PLAYER_ONE_CONTROLS,
    initialCoordinates = { x: 0, y: 0 },
    initialAngle = 0,
    color = "black",
  }: ShipConstructorArgs) {
    const { x, y } = initialCoordinates;
    super(x, y, width, height);
    this.#controls = controls;
    this.angle = initialAngle;
    this.#color = color;

    const explosionImg = new Image(64, 64);

    explosionImg.onload = () => (this.#explosionImage = explosionImg);

    explosionImg.src = "assets/ship/ship_explosion.png";

    const thrustFlame = new Image(11, 7);

    thrustFlame.onload = () => (this.#thrustFlameImg = thrustFlame);

    thrustFlame.src = "assets/ship/thrust_flame.png";

    this.#initPlayerImage();
  }

  public update(
    ctx: CanvasRenderingContext2D,
    keys: KeyState,
    canvasWidth: number,
    canvasHeight: number,
  ): void {
    if (!this.active) {
      ctx.save();
      ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
      this.#explode(ctx);
      ctx.restore();
    } else {
      this.#rotate(ctx);
      this.#move(keys);
      this.#handleThrustTimeout();
      this.#handleCooldown();
    }
    this.handleOutOfBounds(canvasWidth, canvasHeight);
  }
  public bounce(nx: number, ny: number): void {
    const r = this.reflectVelocity(nx, ny);
    this.vx = r.vx;
    this.vy = r.vy;
  }

  #handleThrustTimeout() {
    if (this.#thrustTimeout === 0) return;
    this.#thrustTimeout -= 1;
  }

  #canApplyThrust() {
    if (this.#thrustTimeout === 0) return true;
    return false;
  }

  thrust(): boolean {
    // to prevent thrusting in the main menu
    if (gameState !== "PLAYING") return false;
    if (!this.#canApplyThrust() || !this.active) return false;

    this.#soundService.playThrust();
    this.vx -= Math.sin(this.angle) * this.#thrustCoefficient;
    this.vy += Math.cos(this.angle) * this.#thrustCoefficient;

    this.#thrustTimeout = Ship.thrustTimeoutConst;
    return true;
  }

  #singleShoot(): Projectile[] {
    this.#cooldown = this.#shootCooldown;
    this.#soundService.playShoot();
    return [
      new Projectile(
        this.x + this.width / 2,
        this.y + this.height / 2,
        -Math.sin(this.angle) * this.#projectileSpeed + this.vx,
        Math.cos(this.angle) * this.#projectileSpeed + this.vy,
        Math.PI + this.angle,
      ),
    ];
  }

  public shoot(keys: KeyState): null | Projectile[] {
    if (!this.active || gameState !== "PLAYING") return null;

    const { shoot: shootKey } = this.#controls;
    if (!(keys[shootKey] && this.#cooldown === 0)) return null;

    if (!this.hasPowerupShotgun) return this.#singleShoot();

    return this.#shotGunPowerUp();
  }

  public useAoEPowerUp(): Projectile[] {
    const projectiles: Projectile[] = [];
    this.#soundService.playShoot();
    for (let i = 1; i <= this.#aoeProjectileCount; i++) {
      const newProjectile = new Projectile(
        this.x + this.width / 2,
        this.y + this.height / 2,
        -Math.sin(this.angle + i) * this.#projectileSpeed + this.vx,
        Math.cos(this.angle + i) * this.#projectileSpeed + this.vy,
        this.angle + i,
      );
      projectiles.push(newProjectile);
    }
    return projectiles;
  }

  #shotGunPowerUp(): Projectile[] {
    const projectiles: Projectile[] = [];
    this.#soundService.playShoot();
    for (let i = -1; i <= 1; i += 1) {
      this.#cooldown = this.#shootCooldown;
      const newAngle = this.angle + this.#shotgunSpreadCoeff * i;
      const newProjectile = new Projectile(
        this.x + this.width / 2,
        this.y + this.height / 2,
        -Math.sin(newAngle) * this.#projectileSpeed + this.vx,
        Math.cos(newAngle) * this.#projectileSpeed + this.vy,
        newAngle,
      );
      projectiles.push(newProjectile);
    }
    return projectiles;
  }

  public changeColor(newColor: ColorType): void {
    this.#color = newColor;

    this.#initPlayerImage();
  }

  public getColor(): ColorType {
    return this.#color;
  }

  public keepInBounds(canvasWidth: number, canvasHeight: number): void {
    if (this.x + this.width > canvasWidth) {
      this.x = canvasWidth - this.width;
    }

    if (this.y + this.height > canvasHeight) {
      this.y = canvasHeight - this.height;
    }

    this.x = Math.max(0, this.x);
    this.y = Math.max(0, this.y);
  }

  public reset(x: number, y: number, angle: number) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.#thrustTimeout = 0;
    this.angle = angle;
    this.active = true;
    this.#explosionScale = 0;
  }

  #explode(ctx: CanvasRenderingContext2D) {
    // two scale up the explosion more
    if (this.#explosionScale > this.#explosionMaxScale) return;
    this.#explosionScale += this.#explosionScaleCoeff;
    ctx.scale(this.#explosionScale, this.#explosionScale);
    // this.revolve(ctx, 0.4);
    if (this.#explosionImage) ctx.drawImage(this.#explosionImage, -32, -32);
  }

  #initPlayerImage() {
    const img = new Image(this.width, this.height);

    img.onload = () => {
      this.img = img;
    };

    img.src = `assets/ship/ship_${this.#color}.png`;
  }
  #readInput(keys: KeyState): void {
    const { left, right, up, down } = this.#controls;
    this.#horizontal = Number(keys[right]) - Number(keys[left]);
    this.#vertical = Number(keys[down]) - Number(keys[up]);
  }

  #applyAcceleration(): void {
    this.vx += this.#horizontal * this.#acceleration;
    this.vx = Math.max(
      -this.#maxVelocity,
      Math.min(this.#maxVelocity, this.vx),
    );

    this.vy += this.#vertical * this.#acceleration;
    this.vy = Math.max(
      -this.#maxVelocity,
      Math.min(this.#maxVelocity, this.vy),
    );
  }

  #applyFriction(): void {
    if (!this.#horizontal) {
      this.vx *= this.#friction;
    }
    if (!this.#vertical) {
      this.vy *= this.#friction;
    }
  }

  #applyMovement(): void {
    const currentCoeff = this.vx && this.vy ? DIAGONAL_MODIFIER : 1;

    this.x += this.vx * currentCoeff;
    this.y += this.vy * currentCoeff;
  }

  #handleCooldown(): void {
    if (this.#cooldown > 0) {
      this.#cooldown--;
    }
    this.#handleShotGunTimeout();
  }

  #handleShotGunTimeout(): void {
    if (this.#shotgunTimeout < 0) {
      this.#shotgunTimeout = Ship.shotgunTimeoutConst;
      this.hasPowerupShotgun = false;
    }
    if (this.hasPowerupShotgun) {
      this.#shotgunTimeout--;
    }
  }

  #animateFlame(ctx: CanvasRenderingContext2D) {
    this.#thrustFlameAngle += 0.1;
    const scaleCoeff = Math.abs(Math.sin(this.#thrustFlameAngle));
    ctx.scale(1, scaleCoeff);
  }

  #drawThrustFlames(ctx: CanvasRenderingContext2D) {
    if (this.#thrustTimeout > this.#thrustingTime && this.#thrustFlameImg) {
      ctx.fillStyle = "orange";
      ctx.lineWidth = 3;

      ctx.save();

      ctx.translate(0, -this.height / 2 - 5);
      this.#animateFlame(ctx);

      ctx.drawImage(this.#thrustFlameImg, this.width / 2 - 15, 0);
      ctx.drawImage(this.#thrustFlameImg, -15, 0);

      ctx.restore();
    }
  }

  #rotate(ctx: CanvasRenderingContext2D) {
    if (!this.img) return;
    ctx.save();

    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);

    ctx.rotate(this.angle);

    this.drawRelativeImage(ctx);

    this.#drawThrustFlames(ctx);
    // this.drawHitBox(ctx);

    ctx.restore();
  }

  #updateAngle(): void {
    if (this.#horizontal !== 0 || this.#vertical !== 0) {
      const targetAngle = Math.atan2(-this.#horizontal, this.#vertical);
      let rawGap = targetAngle - this.angle;
      const gap = ((rawGap + Math.PI) % (Math.PI * 2)) - Math.PI;

      this.angle += gap * this.#rotationSpeed;
    }
  }

  #move(keys: KeyState): void {
    this.#readInput(keys);
    this.#applyAcceleration();
    this.#applyFriction();
    this.#applyMovement();
    this.#updateAngle();
  }
}
