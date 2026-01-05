import { DIAGONAL_MODIFIER } from "./constants.js";
import { Projectile } from "./projectile.js";

export class Ship {
  #height;
  #width;
  #img;
  #horizontal;
  #vertical;
  #controls;
  #x;
  #y;

  #angle = 0;
  #vx = 0;
  #vy = 0;
  #cooldown = 0;

  // constants
  #shootCooldown = 150;
  #maxVelocity = 10;
  #acceleration = 0.01;
  #rotationSpeed = 0.02;
  #friction = 0.99;
  constructor(
    width,
    height,
    controls = { up: "w", down: "s", left: "a", right: "d", shoot: "t" },
    initialCoordinates = { x: 0, y: 0 }
  ) {
    console.log(controls);
    this.#width = width;
    this.#height = height;
    this.#controls = controls;
    this.#x = initialCoordinates.x;
    this.#y = initialCoordinates.y;

    const img = new Image(this.#width, this.#height);

    img.onload = () => {
      this.#img = img;
    };

    img.src = "assets/ship_64_45.png";
  }

  get x() {
    return this.#x;
  }

  get y() {
    return this.#y;
  }

  get width() {
    return this.#width;
  }

  get height() {
    return this.#height;
  }

  update(ctx, keys, canvasWidth, canvasHeight) {
    this.rotate(ctx);
    this.move(keys);
    this.#handleCooldown();
    this.#handleOutOfBounds(canvasWidth, canvasHeight);
  }

  drawHitBox(ctx) {
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.strokeRect(
      -this.#width / 2,
      -this.#height / 2,
      this.#width,
      this.#height
    );
  }

  rotate(ctx) {
    if (!this.#img) return;
    ctx.save();

    ctx.translate(this.#x + this.#width / 2, this.#y + this.#height / 2);

    ctx.rotate(this.#angle);
    this.draw(ctx);

    this.drawHitBox(ctx);

    ctx.restore();
  }

  updateAngle() {
    if (this.#horizontal || this.#vertical) {
      const targetAngle = Math.atan2(-this.#horizontal, this.#vertical);
      let rawGap = targetAngle - this.#angle;
      const gap = ((rawGap + Math.PI) % (Math.PI * 2)) - Math.PI;

      this.#angle += gap * this.#rotationSpeed;
    }
  }

  bounce() {
    this.#vx *= -1;
    this.#vy *= -1;
  }

  move(keys) {
    this.#readInput(keys);
    this.#applyAcceleration();
    this.#applyFriction();
    this.#applyMovement();
    this.updateAngle();
  }

  #readInput(keys) {
    const { left, right, up, down } = this.#controls;
    this.#horizontal = keys[right] - keys[left];
    this.#vertical = keys[down] - keys[up];
  }

  #applyAcceleration() {
    this.#vx += this.#horizontal * this.#acceleration;
    this.#vx = Math.max(
      -this.#maxVelocity,
      Math.min(this.#maxVelocity, this.#vx)
    );

    this.#vy += this.#vertical * this.#acceleration;
    this.#vy = Math.max(
      -this.#maxVelocity,
      Math.min(this.#maxVelocity, this.#vy)
    );
  }

  #applyFriction() {
    if (!this.#horizontal) {
      this.#vx *= this.#friction;
    }

    if (!this.#vertical) {
      this.#vy *= this.#friction;
    }
  }

  #applyMovement() {
    const currentCoeff = this.#vx && this.#vy ? DIAGONAL_MODIFIER : 1;

    this.#x += this.#vx * currentCoeff;
    this.#y += this.#vy * currentCoeff;
  }

  #handleCooldown() {
    if (this.#cooldown > 0) {
      this.#cooldown--;
    }
  }

  #handleOutOfBounds(width, height) {
    if (this.#x >= width) {
      this.#x = -this.#width;
    } else if (this.#x < -this.#width) {
      this.#x = width;
    }
    if (this.#y >= height) {
      this.#y = -this.#height;
    } else if (this.#y < -this.#height) {
      this.#y = height;
    }
  }

  draw(ctx) {
    ctx.drawImage(this.#img, -this.#width / 2, -this.#height / 2);
  }

  shoot(keys) {
    const { shoot: shootKey } = this.#controls;
    if (keys[shootKey] && this.#cooldown === 0) {
      this.#cooldown = this.#shootCooldown;
      return new Projectile(
        this.#x + this.#width / 2,
        this.#y + this.#height / 2,
        -Math.sin(this.#angle) * 10,
        Math.cos(this.#angle) * 10,
        this.#angle
      );
    }
    return null;
  }
}
