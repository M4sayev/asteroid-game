import { SoundManager } from "../entities/soundManager.js";
import { setIsPaused, setIsStarted } from "./menuState.js";

const menu = document.getElementById("menu") as HTMLDivElement;
const resumeMenu = document.getElementById("esc-menu") as HTMLDivElement;
const playMenu = document.getElementById("playMenu") as HTMLDivElement;
const soundService = SoundManager.getInstance();

export function openMenu() {
  soundService.playSelectMenuItem();
  menu.style.display = "flex";
  setIsStarted(false);
}

export function closeMenu() {
  soundService.playSelectMenuItem();
  menu.style.display = "none";
  setIsStarted(true);
}

export function closeResumeMenu() {
  soundService.playSelectMenuItem();
  resumeMenu.style.display = "none";
  setIsPaused(false);
  document.documentElement.style.setProperty("--btn-theme", "#770d8f");
}

export function openResumeMenu() {
  soundService.playSelectMenuItem();
  resumeMenu.style.display = "flex";
  setIsPaused(true);
  document.documentElement.style.setProperty("--btn-theme", "#deab14");
}

export function startGame() {
  playMenu.style.display = "none";
  playMenu.style.pointerEvents = "none";

  soundService.playSelectMenuItem();
  soundService.playBgMusic();
  openMenu();
}
