import { defaultKeys, playerColors } from "./constants/constants.js";
import { ColorType } from "./types/types.js";

let isStarted = false;
let menu: HTMLDivElement;

let colorPickerPlayerOne: HTMLDivElement;
let colorPickerPlayerTwo: HTMLDivElement;

export let currentColorP1: ColorType = "purple";
export let currentColorP2: ColorType = "purple";

export function initMenu() {
  const button = document.getElementById("startBtn") as HTMLButtonElement;
  menu = document.getElementById("menu") as HTMLDivElement;

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
    if (target.classList.contains("color__btn")) {
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
    if (target.classList.contains("color__btn")) {
      const color = target.dataset.color as ColorType;
      currentColorP2 = color;
      populateColorBtns(colorPickerPlayerTwo, "two", color);

      imgP2.src = `assets/ship/ship_${color}.png`;
      imgP2.setAttribute("alt", `${color} ship`);
    }
  });

  button.addEventListener("click", handleButtonClick);

  window.onkeydown = handleKeyDown;
}

function populateColorBtns(
  element: HTMLDivElement,
  player: "one" | "two",
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
    button.setAttribute("class", "color__btn");
    button.setAttribute("role", "radio");
    button.setAttribute("data-color", color);
    button.setAttribute("data-checked", `${pickedColor === color}`);
    button.setAttribute("aria-checked", `${pickedColor === color}`);

    element?.appendChild(button);
  });
}

function handleKeyDown(event: KeyboardEvent) {
  if (!isStarted && event.key in defaultKeys) {
    event.stopImmediatePropagation();
  }
}

function handleButtonClick() {
  menu.style.display = "none";
  isStarted = true;
}
