import { playerColors } from "../constants/constants.js";
import type { ColorType, PlayerNumber } from "../types/types.js";
import {
  currentColorP1,
  setCurrentColorP1,
  setCurrentColorP2,
} from "./menuState.js";

let colorPickerPlayerOne: HTMLDivElement;
let colorPickerPlayerTwo: HTMLDivElement;

export function initColorPickers(
  imgP1: HTMLImageElement,
  imgP2: HTMLImageElement
) {
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
      setCurrentColorP1(color);
      populateColorBtns(colorPickerPlayerOne, "one", color);
      imgP1.src = `assets/ship/ship_${color}.png`;
      imgP1.setAttribute("alt", `${color} ship`);
    }
  });

  populateColorBtns(colorPickerPlayerTwo, "two", currentColorP1);
  colorPickerPlayerTwo.addEventListener("click", (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains("color-btn")) {
      const color = target.dataset.color as ColorType;
      setCurrentColorP2(color);

      populateColorBtns(colorPickerPlayerTwo, "two", color);

      imgP2.src = `assets/ship/ship_${color}.png`;
      imgP2.setAttribute("alt", `${color} ship`);
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
