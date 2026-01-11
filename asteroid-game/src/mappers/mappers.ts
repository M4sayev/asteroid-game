// to convert ArrowUp to just arrows
import type { KeyName } from "../types/types";

export const playerTwoKeysMap: Partial<Record<KeyName, string>> = {
  ArrowDown: `<img aria-hidden="true" src="assets/icons/arrow.svg" style="transform: rotate(180deg);"></img>`,
  ArrowLeft: `<img aria-hidden="true" src="assets/icons/arrow.svg" style="transform: rotate(90deg);"></img>`,
  ArrowRight: `<img aria-hidden="true" src="assets/icons/arrow.svg" style="transform: rotate(-90deg);"></img>`,
  ArrowUp: `<img aria-hidden="true" src="assets/icons/arrow.svg"></img>`,
  m: "m",
};
