import { defaultKeys } from "../constants/constants.js";
import { initGame } from "../main.js";
import { initColorPickers } from "./colorPicker.js";
import {
  closeMenu,
  keyHandlers,
  openMainMenu,
  startGame,
} from "./menuControls.js";
import { gameState, setIsSettingsOpen } from "./menuState.js";
import { initSettings } from "../settings/settings.js";
import { trapFocus } from "../utils/utils.js";
import { SoundManager } from "../entities/soundManager.js";

const soundeService = SoundManager.getInstance();

export function initMenu() {
  const resumeBtn = document.getElementById("resumeBtn") as HTMLButtonElement;
  const restartBtn = document.getElementById("restartBtn") as HTMLButtonElement;

  const startButton = document.getElementById("startBtn") as HTMLButtonElement;
  const playBtn = document.getElementById("playBtn") as HTMLButtonElement;

  // attach event listener to settings
  const settingsButton = document.getElementById(
    "settingsBtn"
  ) as HTMLButtonElement;

  const settingsMenu = document.querySelector(
    ".settings-menu"
  ) as HTMLDivElement;

  playBtn.addEventListener("click", startGame);

  settingsButton.addEventListener("click", () => {
    settingsMenu.style.display = "block";
    soundeService.playSelectMenuItem();
    setIsSettingsOpen(true);
    trapFocus(settingsMenu);
  });

  // set players
  const imgP1 = document.getElementById("playerOneImage") as HTMLImageElement;
  const imgP2 = document.getElementById("playerTwoImage") as HTMLImageElement;

  initColorPickers(imgP1, imgP2);

  startButton.addEventListener("click", handleButtonClick);

  resumeBtn.addEventListener("click", closeMenu);

  restartBtn.addEventListener("click", restartGame);

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);

  initSettings();
}
const shouldBlockMoveKeys = (key: string) => {
  return gameState !== "PLAYING" && key in defaultKeys;
};

function handleKeyUp(event: KeyboardEvent) {
  if (event.key === "Tab") closeMenu();
}

function handleKeyDown(event: KeyboardEvent) {
  if (shouldBlockMoveKeys(event.key)) {
    event.stopImmediatePropagation();
  }

  keyHandlers[event.key]?.(event);
}

function handleButtonClick() {
  closeMenu();
}

function restartGame() {
  openMainMenu();
  initGame();
}

export function closeSettings(menu: HTMLDivElement) {
  soundeService.playSelectMenuItem();
  menu.style.display = "none";
  setIsSettingsOpen(false);
}
