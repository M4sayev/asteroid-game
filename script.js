import { Ship } from "./Ship.js";

window.onload = () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let asteroidGame = new AsteroidGame(ctx, canvas.width, canvas.height);

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    asteroidGame = new AsteroidGame(ctx, canvas.width, canvas.height);
  });
};

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

    this.#player = new Ship(45, 64, 3.5, 0.05);

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
    this.#player.update(this.#ctx, this.#keys, this.#width, this.#height);
    requestAnimationFrame(() => this.loop());
  }
}
