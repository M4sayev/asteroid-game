import type { ColorType, GameStateType, PlayerNumber } from "../types/types.js";

export let isStarted = false;
export let isPaused = false;
export let isSettingsOpen = false;

export let gameState: GameStateType = "READY";

export let currentColorP1: ColorType = "purple";
export let currentColorP2: ColorType = "purple";
export let playerOneScore: number = 0;
export let playerTwoScore: number = 0;

export const setCurrentPlayerColor = (
  color: ColorType,
  player: PlayerNumber
) => {
  document.documentElement.style.setProperty(`--player-${player}-clr`, color);
  if (player === "one") currentColorP1 = color;
  else if (player === "two") currentColorP2 = color;
};

export const setIsSettingsOpen = (state: boolean) => (isSettingsOpen = state);

export const setScore = (
  player: PlayerNumber,
  updater: (prev: number) => number
) => {
  if (player === "one") playerOneScore = updater(playerOneScore);
  else if (player === "two") playerTwoScore = updater(playerTwoScore);
};

export const setGameState = (state: GameStateType) => (gameState = state);

export const setIsStarted = (state: boolean) => (isStarted = state);
export const setIsPaused = (state: boolean) => (isPaused = state);
