export class Ship {
  #x = 0;
  #y = 0;
  #boxSize;
  #speed;
  #coeff;
  #img;
  #angle;
  constructor(boxSize, speed) {
    this.#speed = speed;
    this.#boxSize = boxSize;

    const img = new Image(this.#boxSize, this.#boxSize);

    img.onload = () => {
      this.#img = img;
    };

    img.src = "assets/ship.png";
  }

  update(ctx, keys, width, height) {
    this.rotate(ctx);
    this.move(keys);
    this.#handleOutOfBounds(width, height);
  }

  rotate(ctx) {
    if (!this.#img) return;
    ctx.save();

    ctx.translate(this.#x + this.#boxSize / 2, this.#y + this.#boxSize / 2);

    ctx.rotate(this.#angle);
    ctx.drawImage(this.#img, -this.#boxSize, -this.#boxSize);

    ctx.restore();
  }

  updateAngle(horizontal, vertical) {
    if (horizontal || vertical) {
      this.#angle = Math.atan2(
        horizontal * this.#speed,
        -vertical * this.#speed
      );
    }
  }

  move(keys) {
    const horizontal = keys.d - keys.a;
    const vertical = keys.s - keys.w;

    if ((keys.d || keys.a) && (keys.s || keys.w))
      this.#coeff = Math.sqrt(1 / 2);
    else this.#coeff = 1;

    this.#x += horizontal * this.#speed * this.#coeff;
    this.#y += vertical * this.#speed * this.#coeff;

    this.updateAngle(horizontal, vertical);
  }

  #handleOutOfBounds(width, height) {
    if (this.#x >= width) {
      this.#x = -2 * this.#boxSize;
    } else if (this.#x < -2 * this.#boxSize) {
      this.#x = width;
    }
    if (this.#y >= height + this.#boxSize) {
      this.#y = -2 * this.#boxSize;
    } else if (this.#y < -2 * this.#boxSize) {
      this.#y = height;
    }
  }

  draw(ctx) {
    if (!this.#img) return;

    ctx.drawImage(this.#img, this.#x, this.#y);
  }
}
