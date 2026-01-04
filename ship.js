export class Ship {
  #height;
  #width;
  #img;
  #horizontal;
  #vertical;

  #x = 0;
  #y = 0;
  #angle = 0;
  #friction = 0.99;
  #rotationSpeed = 0.02;
  #maxV = 10;
  #vx = 0;
  #vy = 0;
  #a = 0.01;

  static #DIAGONAL_MODIFIER = Math.SQRT1_2;

  constructor(width, height) {
    this.#width = width;
    this.#height = height;

    const img = new Image(this.#width, this.#height);

    img.onload = () => {
      this.#img = img;
    };

    img.src = "assets/ship_64_45.png";
  }

  update(ctx, keys, width, height) {
    this.rotate(ctx);
    this.move(keys);
    this.#handleOutOfBounds(width, height);
  }

  rotate(ctx) {
    if (!this.#img) return;
    ctx.save();

    ctx.translate(this.#x + this.#width / 2, this.#y + this.#height / 2);

    ctx.rotate(this.#angle);
    ctx.drawImage(this.#img, -this.#width / 2, -this.#height / 2);

    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.strokeRect(
      -this.#width / 2,
      -this.#height / 2,
      this.#width,
      this.#height
    );

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

  move(keys) {
    this.#horizontal = keys.d - keys.a;
    this.#vertical = keys.s - keys.w;

    this.#vx += this.#horizontal * this.#a;
    this.#vx = Math.max(-this.#maxV, Math.min(this.#maxV, this.#vx));

    this.#vy += this.#vertical * this.#a;
    this.#vy = Math.max(-this.#maxV, Math.min(this.#maxV, this.#vy));

    if (!this.#horizontal) {
      this.#vx *= this.#friction;
    }

    if (!this.#vertical) {
      this.#vy *= this.#friction;
    }

    const currentCoeff = this.#vx && this.#vy ? Ship.#DIAGONAL_MODIFIER : 1;

    this.#x += this.#vx * currentCoeff;
    this.#y += this.#vy * currentCoeff;

    this.updateAngle();
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
    if (!this.#img) return;

    ctx.drawImage(this.#img, this.#x, this.#y);
  }
}
