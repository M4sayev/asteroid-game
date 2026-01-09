import { Asteroid } from "../entities/asteroid.js";
import { Projectile } from "../entities/projectile.js";
import { Ship } from "../entities/ship.js";

export type KeyName =
  | "w"
  | "a"
  | "s"
  | "d"
  | "ArrowUp"
  | "ArrowDown"
  | "ArrowLeft"
  | "ArrowRight"
  | "t"
  | "m";

export interface ControlsType {
  up: KeyName;
  down: KeyName;
  left: KeyName;
  right: KeyName;
  shoot: KeyName;
}

export type InitialCoordinates = { x: number; y: number };

export interface KeyState {
  w: boolean;
  s: boolean;
  d: boolean;
  a: boolean;
  t: boolean;
  ArrowUp: boolean;
  ArrowDown: boolean;
  ArrowLeft: boolean;
  ArrowRight: boolean;
  m: boolean;
}

export type EntityType = Ship | Projectile | Asteroid;

export type ColorType = "green" | "yellow" | "black" | "purple";

export type AsteroidType = {
  tag: string;
  img: string;
  diameter: number;
  mass: number;
};
