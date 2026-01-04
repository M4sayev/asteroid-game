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
  #playerOne;
  #playerTwo;
  #keys = {
    w: false,
    s: false,
    d: false,
    a: false,
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
  };

  constructor(ctx, width, height) {
    this.#ctx = ctx;
    this.#width = width;
    this.#height = height;

    console.log({ width, height });
    this.#playerOne = new Ship(45, 64);
    this.#playerTwo = new Ship(
      45,
      64,
      {
        up: "ArrowUp",
        down: "ArrowDown",
        left: "ArrowLeft",
        right: "ArrowRight",
      },
      { x: width - 45, y: height - 64 }
    );

    window.addEventListener("keydown", (e) => this.#setKey(e, true));
    window.addEventListener("keyup", (e) => this.#setKey(e, false));

    this.loop();
  }

  #checkCollision(objOne, objTwo) {
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

  #setKey(e, state) {
    let key = e.key;
    if (e.key.length === 1) key = key.toLowerCase();
    if (key in this.#keys) this.#keys[key] = state;
  }

  loop() {
    this.#ctx.clearRect(0, 0, this.#width, this.#height);
    this.#playerOne.update(this.#ctx, this.#keys, this.#width, this.#height);
    this.#playerTwo.update(this.#ctx, this.#keys, this.#width, this.#height);

    if (this.#checkCollision(this.#playerOne, this.#playerTwo)) {
      this.#playerOne.bounce();
      this.#playerTwo.bounce();
    }
    requestAnimationFrame(() => this.loop());
  }
}
