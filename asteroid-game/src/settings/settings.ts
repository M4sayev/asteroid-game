import { closeSettings } from "../menu/menu.js";
import { createPlayerSettingSection } from "./createPlayerSettings.js";

export function initSettings() {
  const settingsMenu = document.querySelector(
    ".settings-menu"
  ) as HTMLDivElement;
  const closeBtn = document.querySelector(".close-btn") as HTMLButtonElement;

  if (closeBtn && settingsMenu) {
    closeBtn.addEventListener("click", () => {
      closeSettings(settingsMenu);
    });
  }

  settingsMenu.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      closeSettings(settingsMenu);
    }
  });

  const keyboardSettings = document.getElementById("keyboardSettings");
  if (keyboardSettings)
    keyboardSettings.innerHTML = createPlayerSettingSection();
}
