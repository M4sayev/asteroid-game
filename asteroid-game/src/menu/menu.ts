import { defaultKeys } from "../constants/constants.js";
import { initGame } from "../main.js";
import { initColorPickers } from "./colorPicker.js";
import {
  closeMenu,
  closeResumeMenu,
  openMenu,
  openResumeMenu,
  startGame,
} from "./menuControls.js";
import { isPaused, isStarted, setIsSettingsOpen } from "./menuState.js";
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

  resumeBtn.addEventListener("click", closeResumeMenu);

  restartBtn.addEventListener("click", restartGame);

  window.addEventListener("keydown", handleKeyDown);

  initSettings();
}

function handleKeyDown(event: KeyboardEvent) {
  if (!isStarted && event.key === "Tab") soundeService.playSelectMenuItem();
  if (event.key === "Escape" && isStarted) {
    isPaused ? closeResumeMenu() : openResumeMenu();
  }
  if ((!isStarted || isPaused) && event.key in defaultKeys) {
    event.stopImmediatePropagation();
  }
}

function handleButtonClick() {
  closeMenu();
  closeResumeMenu();
}

function restartGame() {
  closeResumeMenu();
  openMenu();
  initGame();
}

export function closeSettings(menu: HTMLDivElement) {
  soundeService.playSelectMenuItem();
  menu.style.display = "none";
  setIsSettingsOpen(false);
}
