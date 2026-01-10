import { defaultKeys, playerColors } from "./constants/constants.js";
import { initSettings } from "./settings.js";
import { ColorType, PlayerNumber } from "./types/types.js";

let isStarted = false;
let menu: HTMLDivElement;

let colorPickerPlayerOne: HTMLDivElement;
let colorPickerPlayerTwo: HTMLDivElement;

let settingsMenu: HTMLDivElement;
let settingsButton: HTMLButtonElement;

const closeBtn = document.querySelector(".close-btn") as HTMLButtonElement;
let isSettingsOpen = false;

const focusableElements: string =
  "button:not([disabled]), input:not([disabled]):not([type='hidden']), select:not([disabled]), textarea, [tabindex]:not([tabindex='-1'])";

export const setIsSettingsOpenFalse = () => (isSettingsOpen = false);

export let currentColorP1: ColorType = "purple";
export let currentColorP2: ColorType = "purple";

export function initMenu() {
  const button = document.getElementById("startBtn") as HTMLButtonElement;

  // attach event listener to settings
  settingsButton = document.getElementById("settingsBtn") as HTMLButtonElement;

  settingsMenu = document.querySelector(".settings-menu") as HTMLDivElement;

  settingsButton.addEventListener("click", () => {
    settingsMenu.style.display = "block";
    isSettingsOpen = true;
    trapFocus();
  });

  menu = document.getElementById("menu") as HTMLDivElement;

  // set players
  const imgP1 = document.getElementById("playerOneImage") as HTMLImageElement;
  const imgP2 = document.getElementById("playerTwoImage") as HTMLImageElement;

  colorPickerPlayerOne = document.getElementById(
    "colorPickerPlayerOne"
  ) as HTMLDivElement;

  colorPickerPlayerTwo = document.getElementById(
    "colorPickerPlayerTwo"
  ) as HTMLDivElement;

  populateColorBtns(colorPickerPlayerOne, "one", currentColorP1);
  colorPickerPlayerOne.addEventListener("click", (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains("color-btn")) {
      const color = target.dataset.color as ColorType;
      currentColorP1 = color;
      populateColorBtns(colorPickerPlayerOne, "one", color);
      imgP1.src = `assets/ship/ship_${color}.png`;
      imgP1.setAttribute("alt", `${color} ship`);
    }
  });

  populateColorBtns(colorPickerPlayerTwo, "two", currentColorP2);
  colorPickerPlayerTwo.addEventListener("click", (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains("color-btn")) {
      const color = target.dataset.color as ColorType;
      currentColorP2 = color;
      populateColorBtns(colorPickerPlayerTwo, "two", color);

      imgP2.src = `assets/ship/ship_${color}.png`;
      imgP2.setAttribute("alt", `${color} ship`);
    }
  });

  button.addEventListener("click", handleButtonClick);

  window.onkeydown = handleKeyDown;

  initSettings();
}

function trapFocus() {
  const elements = settingsMenu.querySelectorAll(focusableElements);

  const first = elements[0] as HTMLElement;
  const last = elements[elements.length - 1] as HTMLElement;

  first.focus();

  settingsMenu.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key !== "Tab") return;

    if (event.shiftKey) {
      if (document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
}

function populateColorBtns(
  element: HTMLDivElement,
  player: PlayerNumber,
  pickedColor: ColorType
) {
  element.innerHTML = "";
  Object.entries(playerColors).forEach(([color, hexCode]) => {
    const button = document.createElement("button");

    button.style.backgroundColor = hexCode;
    button.setAttribute(
      "aria-label",
      `Select color ${color} for player ${player}`
    );
    button.setAttribute("class", "color-btn");
    button.setAttribute("role", "radio");
    button.setAttribute("data-color", color);
    button.setAttribute("data-checked", `${pickedColor === color}`);
    button.setAttribute("aria-checked", `${pickedColor === color}`);

    element?.appendChild(button);
  });
}

function handleKeyDown(event: KeyboardEvent) {
  console.log(event.key);
  if (event.key === "Escape") {
    isStarted = false;
    menu.style.display = "flex";
    // initMenu();
  }
  if (!isStarted && event.key in defaultKeys) {
    event.stopImmediatePropagation();
  }
}

function handleButtonClick() {
  menu.style.display = "none";
  isStarted = true;
}
