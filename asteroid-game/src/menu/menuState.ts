import type { ColorType, PlayerNumber } from "../types/types.js";

export let isStarted = false;
export let isPaused = false;

export let isSettingsOpen = false;

export let currentColorP1: ColorType = "purple";
export let currentColorP2: ColorType = "purple";

export const setCurrentPlayerColor = (
  color: ColorType,
  player: PlayerNumber
) => {
  document.documentElement.style.setProperty(`--player-${player}-clr`, color);
  if (player === "one") currentColorP1 = color;
  else if (player === "two") currentColorP2 = color;
};

export const setIsSettingsOpen = (state: boolean) => (isSettingsOpen = state);
export const setIsStarted = (state: boolean) => (isStarted = state);
export const setIsPaused = (state: boolean) => (isPaused = state);
