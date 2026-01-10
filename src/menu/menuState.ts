import { ColorType } from "../types/types.js";

export let isStarted = false;
export let isPaused = false;

export let isSettingsOpen = false;

export let currentColorP1: ColorType = "purple";
export let currentColorP2: ColorType = "purple";

export const setCurrentColorP1 = (color: ColorType) => (currentColorP1 = color);
export const setCurrentColorP2 = (color: ColorType) => (currentColorP2 = color);

export const setIsSettingsOpen = (state: boolean) => (isSettingsOpen = state);
export const setIsStarted = (state: boolean) => (isStarted = state);
export const setIsPaused = (state: boolean) => (isPaused = state);
