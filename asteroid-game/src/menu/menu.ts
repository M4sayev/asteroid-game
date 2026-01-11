import { defaultKeys } from "../constants/constants.js";
import { initGame } from "../main.js";
import { initColorPickers } from "./colorPicker.js";
import {
  closeMenu,
  closeResumeMenu,
  openMenu,
  openResumeMenu,
} from "./menuControls.js";
import { isPaused, isStarted, setIsSettingsOpen } from "./menuState.js";
import { initSettings } from "../settings/settings.js";
import { trapFocus } from "../utils/utils.js";

export function initMenu() {
  const resumeBtn = document.getElementById("resumeBtn") as HTMLButtonElement;
  const restartBtn = document.getElementById("restartBtn") as HTMLButtonElement;

  const startButton = document.getElementById("startBtn") as HTMLButtonElement;

  // attach event listener to settings
  const settingsButton = document.getElementById(
    "settingsBtn"
  ) as HTMLButtonElement;

  const settingsMenu = document.querySelector(
    ".settings-menu"
  ) as HTMLDivElement;

  settingsButton.addEventListener("click", () => {
    settingsMenu.style.display = "block";
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
