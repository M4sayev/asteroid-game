import { SoundManager } from "../entities/soundManager.js";
import type { GameStateType } from "../types/types.js";
import {
  gameState,
  playerOneScore,
  playerTwoScore,
  setGameState,
} from "./menuState.js";

const menu = document.getElementById("menu") as HTMLDivElement;
const resumeMenu = document.getElementById("esc-menu") as HTMLDivElement;
const playMenu = document.getElementById("playMenu") as HTMLDivElement;
const scoreMenu = document.getElementById("scoreMenu") as HTMLDivElement;

const soundService = SoundManager.getInstance();

const playerOneScoreSpan = document.getElementById(
  "playerOneScore"
) as HTMLSpanElement;
const playerTwoScoreSpan = document.getElementById(
  "playerTwoScore"
) as HTMLSpanElement;

export function updateUI(state: GameStateType) {
  soundService.playSelectMenuItem();
  const menus: Record<GameStateType, HTMLDivElement | null> = {
    PLAYING: null,
    READY: playMenu,
    MAIN: menu,
    PAUSED: resumeMenu,
    SCORE: scoreMenu,
  };

  const activeMenu = menus[state];

  Object.values(menus).forEach((el) => {
    if (el) el.style.display = "none";
  });

  if (activeMenu) {
    activeMenu.style.display = "flex";
  }

  if (state === "SCORE") {
    playerOneScoreSpan.textContent = playerOneScore.toString();
    playerTwoScoreSpan.textContent = playerTwoScore.toString();
  }

  const themeColor = state === "PAUSED" ? "#deab14" : "#770d8f";
  document.documentElement.style.setProperty("--btn-theme", themeColor);
  setGameState(state);
}

export const openResumeMenu = () => updateUI("PAUSED");
export const openMainMenu = () => updateUI("MAIN");
export const closeMenu = () => updateUI("PLAYING");
export const openScoreMenu = () => updateUI("SCORE");

export function startGame() {
  playMenu.style.display = "none";
  playMenu.style.pointerEvents = "none";

  soundService.playSelectMenuItem();
  soundService.playBgMusic();
  openMainMenu();
}

export const keyHandlers: Record<string, (event?: KeyboardEvent) => void> = {
  Tab: (event) => {
    if (gameState === "PLAYING" || gameState === "SCORE") {
      event?.preventDefault();
    }
    if (gameState !== "PLAYING" && gameState !== "SCORE") {
      soundService.playSelectMenuItem();
    } else if (gameState === "PLAYING") {
      openScoreMenu();
    }
  },
  Escape: () => {
    if (gameState === "PAUSED") closeMenu();
    else if (gameState === "PLAYING") openResumeMenu();
  },
};
