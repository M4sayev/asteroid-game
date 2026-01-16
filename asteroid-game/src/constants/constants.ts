import type { AsteroidType, ColorType, KeyName } from "../types/types.js";

export const DIAGONAL_MODIFIER = Math.SQRT1_2;

export const PLAYER_ONE_CONTROLS = {
  up: "w",
  left: "a",
  down: "s",
  right: "d",
  shoot: "t",
} as const;

export const PLAYER_TWO_CONTROLS = {
  up: "ArrowUp",
  left: "ArrowLeft",
  down: "ArrowDown",
  right: "ArrowRight",
  shoot: "m",
} as const;

export const allKeys = [
  ...Object.values(PLAYER_ONE_CONTROLS),
  ...Object.values(PLAYER_TWO_CONTROLS),
];

export const defaultKeys = {} as Record<KeyName, boolean>;

allKeys.forEach((key: KeyName) => (defaultKeys[key] = false));

export const asteroids: AsteroidType[] = [
  {
    tag: "gray asteroid",
    img: "assets/obstacles/asteroid_gray.png",
    diameter: 64,
    mass: 50,
  },
  {
    tag: "purple asteroid",
    img: "assets/obstacles/asteroid_purple.png",
    diameter: 64,
    mass: 30,
  },
  {
    tag: "small asteroid",
    img: "assets/obstacles/asteroid_28.png",
    diameter: 28,
    mass: 10,
  },
];

export const maxObstacleSize = 80;

export const asteroidCount = 5;

export const powerUpCountMap = {
  aoe: 1,
  shotgun: 1,
};

export const playerColors: Record<ColorType, string> = {
  black: "#1F1919",
  purple: "#770D8F",
  green: "#4BB524",
  yellow: "#DEAB14",
};
