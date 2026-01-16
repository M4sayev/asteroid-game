import { playerColors } from "../constants/constants.js";
import { SoundManager } from "../entities/soundManager.js";
import type { ColorType, PlayerNumber } from "../types/types.js";
import {
  currentColorP1,
  currentColorP2,
  setCurrentPlayerColor,
} from "./menuState.js";

const colorPickerPlayerOne = document.getElementById(
  "colorPickerPlayerOne"
) as HTMLDivElement;

const colorPickerPlayerTwo = document.getElementById(
  "colorPickerPlayerTwo"
) as HTMLDivElement;

const playerColorPickerMap: Record<PlayerNumber, HTMLDivElement> = {
  one: colorPickerPlayerOne,
  two: colorPickerPlayerTwo,
};

const soundService = SoundManager.getInstance();

export function initColorPickers(
  imgP1: HTMLImageElement,
  imgP2: HTMLImageElement
) {
  populateColorBtns(colorPickerPlayerOne, "one", currentColorP1);
  colorPickerPlayerOne.addEventListener("click", (event: MouseEvent) => {
    handleColorSelect(imgP1, "one", event);
  });

  populateColorBtns(colorPickerPlayerTwo, "two", currentColorP2);
  colorPickerPlayerTwo.addEventListener("click", (event: MouseEvent) => {
    handleColorSelect(imgP2, "two", event);
  });
}

function handleColorSelect(
  img: HTMLImageElement,
  player: PlayerNumber,
  event: MouseEvent
) {
  const target = event.target as HTMLElement;
  if (target.classList.contains("color-btn")) {
    soundService.playSelectMenuItem();
    const color = target.dataset.color as ColorType;
    setCurrentPlayerColor(color, player);

    const colorPicker = playerColorPickerMap[player];
    populateColorBtns(colorPicker, player, color);

    img.src = `assets/ship/ship_${color}.png`;
    img.setAttribute("alt", `${color} ship`);
  }
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
