import { defaultKeys } from "./constants/constants.js";
import { AsteroidGame, asteroidGameAnimation } from "./game.js";

let asteroidGame: AsteroidGame;

let button: HTMLButtonElement;
let menu: HTMLDivElement;

let isStarted = false;

function handleKeyDown(event: KeyboardEvent) {
  if (!isStarted && event.key in defaultKeys) {
    event.stopImmediatePropagation();
  }
}

function handleButtonClick() {
  menu.style.display = "none";
  isStarted = true;
}

window.onload = () => {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  button = document.getElementById("startBtn") as HTMLButtonElement;
  menu = document.getElementById("menu") as HTMLDivElement;

  button.addEventListener("click", handleButtonClick);

  window.onkeydown = handleKeyDown;

  if (ctx) {
    asteroidGame = new AsteroidGame(ctx, canvas.width, canvas.height);

    window.addEventListener("resize", () => {
      cancelAnimationFrame(asteroidGameAnimation);
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      asteroidGame = new AsteroidGame(ctx, canvas.width, canvas.height);
    });
  }
};
