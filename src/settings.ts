import {
  PLAYER_ONE_CONTROLS,
  PLAYER_TWO_CONTROLS,
} from "./constants/constants.js";
import { setIsSettingsOpenFalse } from "./menu.js";
import { PlayerNumber } from "./types/types.js";

const border = `
                <span class="border-span left"></span>
                <span class="border-span right"></span>
                <span class="border-span top"></span>
                <span class="border-span bottom"></span>
            `;

function playerSettingsTemplate(
  player: PlayerNumber,
  motionKeys: string,
  instructions: string
): string {
  return `
    <article>
        <h3 style="text-align: center">Player ${player}</h3>
        <div class="settings-player-section">
            <div aria-hidden="true" class="setting-player-keys">
            <div class="motion-keys">
                ${motionKeys}
            </div>
            <dl>
            ${instructions}
            </dl>
        </div>
    </article>
    `;
}
// to convert ArrowUp to just arrows

type PlayerTwoKeys =
  (typeof PLAYER_TWO_CONTROLS)[keyof typeof PLAYER_TWO_CONTROLS];

const playerTwoKeysMap: Record<PlayerTwoKeys, string> = {
  ArrowDown: `<img aria-hidden="true" src="assets/icons/arrow.svg" style="transform: rotate(180deg);"></img>`,
  ArrowLeft: `<img aria-hidden="true" src="assets/icons/arrow.svg" style="transform: rotate(90deg);"></img>`,
  ArrowRight: `<img aria-hidden="true" src="assets/icons/arrow.svg" style="transform: rotate(-90deg);"></img>`,
  ArrowUp: `<img aria-hidden="true" src="assets/icons/arrow.svg"></img>`,
  m: "m",
};

export function initSettings() {
  const settingsMenu = document.querySelector(
    ".settings-menu"
  ) as HTMLDivElement;
  const closeBtn = document.querySelector(".close-btn") as HTMLButtonElement;

  if (closeBtn && settingsMenu) {
    closeBtn.addEventListener("click", () => {
      settingsMenu.style.display = "none";
      setIsSettingsOpenFalse();
    });
  }

  window.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      settingsMenu.style.display = "none";
      setIsSettingsOpenFalse();
    }
  });

  const keyboardSettings = document.getElementById("keyboardSettings");
  if (keyboardSettings)
    keyboardSettings.innerHTML = createPlayerSettingSection();
}

function createPlayerSettingSection(): string {
  let motionKeys = "";
  let instructions = "";
  let settings = "";

  motionKeys += `<span class="control-span">${PLAYER_ONE_CONTROLS["up"]} ${border}</span>`;
  motionKeys += `<div><div class="control-span-group">`;

  Object.entries(PLAYER_ONE_CONTROLS).forEach(([key, value]) => {
    if (key !== "up" && key !== "shoot")
      motionKeys += `<span class="control-span">${value} ${border}</span>`;
    instructions += `<div class="instruction-item">
                    <dt style="display: inline">'${value}'</dt>
                    <dd style="display: inline">to move ${key}</dd>
                </div>`;
  });
  motionKeys += `</div></div></div><span class="control-span">${PLAYER_ONE_CONTROLS["shoot"]}${border}</span>`;
  settings += playerSettingsTemplate("one", motionKeys, instructions);

  motionKeys = "";
  instructions = "";

  motionKeys += `<span class="control-span">${
    playerTwoKeysMap[PLAYER_TWO_CONTROLS["up"]]
  } ${border}</span>`;
  motionKeys += `<div><div class="control-span-group">`;

  Object.entries(PLAYER_TWO_CONTROLS).forEach(([key, value]) => {
    if (key !== "up" && key !== "shoot")
      motionKeys += `<span class="control-span">${playerTwoKeysMap[value]} ${border}</span>`;
    instructions += `<div class="instruction-item">
                    <dt style="display: inline;">'${value
                      .replace(/([a-z])([A-Z])/g, "$1 $2")
                      .toLowerCase()}'</dt>
                    <dd style="display: inline">to move ${key}</dd>
                </div>`;
  });
  motionKeys += `</div></div></div><span class="control-span">${
    playerTwoKeysMap[PLAYER_TWO_CONTROLS["shoot"]]
  }${border}</span>`;
  settings += playerSettingsTemplate("two", motionKeys, instructions);

  return settings;
}
