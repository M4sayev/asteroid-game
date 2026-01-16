import {
  defaultKeys,
  PLAYER_ONE_CONTROLS,
  PLAYER_TWO_CONTROLS,
  type powerUpCountMap,
} from "../constants/constants.js";
import { Asteroid } from "../entities/asteroid.js";
import type { PowerUp } from "../entities/powerup.js";
import { Projectile } from "../entities/projectile.js";
import { Ship } from "../entities/ship.js";

type Actions = keyof typeof PLAYER_ONE_CONTROLS;

export type KeyName =
  | (typeof PLAYER_ONE_CONTROLS)[Actions]
  | (typeof PLAYER_TWO_CONTROLS)[Actions];

export type ControlsType = { [A in Actions]: KeyName };

export type InitialCoordinates = { x: number; y: number };

export type KeyState = typeof defaultKeys;

export type EntityType = Ship | Projectile | Asteroid | PowerUp;

export type ColorType = "green" | "yellow" | "black" | "purple";

export type AsteroidType = {
  tag: string;
  img: string;
  diameter: number;
  mass: number;
};

export type PlayerNumber = "one" | "two";

export type PowerUpType = keyof typeof powerUpCountMap;

export type GameStateType = "PLAYING" | "READY" | "MAIN" | "PAUSED" | "SCORE";
