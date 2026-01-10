import { AsteroidGame, asteroidGameAnimation } from "./game.js";
import { initMenu } from "./menu/menu.js";

let asteroidGame: AsteroidGame;

initMenu();

export function initGame() {
  cancelAnimationFrame(asteroidGameAnimation);
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  if (ctx) {
    asteroidGame = new AsteroidGame(ctx, canvas.width, canvas.height);

    window.addEventListener("resize", () => {
      cancelAnimationFrame(asteroidGameAnimation);
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      asteroidGame = new AsteroidGame(ctx, canvas.width, canvas.height);
    });
  }
}

window.onload = () => {
  initGame();
};
