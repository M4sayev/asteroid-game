window.onload = () => {
  const canvas = document.getElementById("canvas");
  const rect = canvas.getBoundingClientRect();
  const ctx = canvas.getContext("2d");
  // canvas.width = canvas.clientWidth;
  // canvas.height = canvas.clientHeight;

  const asteroidGame = new AsteroidGame(ctx, canvas.width, canvas.height);
};

class Rectangle {
  #x = 0;
  #y = 0;
  #boxSize;
  #speed;
  #coeff;
  constructor(boxSize, speed) {
    this.#speed = speed;
    this.#boxSize = boxSize;
  }

  update(keys, width, height) {
    if ((keys.d || keys.a) && (keys.s || keys.w))
      this.#coeff = Math.sqrt(1 / 2);
    else this.#coeff = 1;

    this.#x += (keys.d - keys.a) * this.#speed * this.#coeff;
    this.#y += (keys.s - keys.w) * this.#speed * this.#coeff;

    this.#handleOutOfBounds(width, height);

    console.log({ x: this.#x, y: this.#y });
  }

  #handleOutOfBounds(width, height) {
    if (this.#x >= width) {
      this.#x = -this.#boxSize;
    } else if (this.#x < -this.#boxSize) {
      this.#x = width;
    }
    if (this.#y >= height) {
      this.#y = -this.#boxSize;
    } else if (this.#y < -this.#boxSize) {
      this.#y = height;
    }
  }

  draw(ctx) {
    ctx.fillRect(this.#x, this.#y, this.#boxSize, this.#boxSize);
  }
}

class AsteroidGame {
  #ctx;
  #width;
  #height;
  #player;
  #keys = {
    w: false,
    s: false,
    d: false,
    a: false,
  };

  constructor(ctx, width, height) {
    this.#ctx = ctx;
    this.#width = width;
    this.#height = height;

    this.#player = new Rectangle(10, 0.8);

    window.addEventListener("keydown", (e) => this.#setKey(e, true));
    window.addEventListener("keyup", (e) => this.#setKey(e, false));

    this.loop();
  }

  #setKey(e, state) {
    const key = e.key.toLowerCase();
    if (key in this.#keys) this.#keys[key] = state;
  }

  loop() {
    this.#ctx.clearRect(0, 0, this.#width, this.#height);
    this.#player.draw(this.#ctx);
    this.#player.update(this.#keys, this.#width, this.#height);
    requestAnimationFrame(() => this.loop());
  }
}
