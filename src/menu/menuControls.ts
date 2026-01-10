import { setIsPaused, setIsStarted } from "./menuState.js";

let menu: HTMLDivElement;
let resumeMenu: HTMLDivElement;

export function initMenuControls() {
  menu = document.getElementById("menu") as HTMLDivElement;
  resumeMenu = document.getElementById("esc-menu") as HTMLDivElement;
}

export function openMenu() {
  menu.style.display = "flex";
  setIsStarted(false);
}

export function closeMenu() {
  menu.style.display = "none";
  setIsStarted(true);
}

export function closeResumeMenu() {
  resumeMenu.style.display = "none";
  setIsPaused(false);
  document.documentElement.style.setProperty("--btn-theme", "#770d8f");
}

export function openResumeMenu() {
  resumeMenu.style.display = "flex";
  setIsPaused(true);
  document.documentElement.style.setProperty("--btn-theme", "#deab14");
}
