export const DIAGONAL_MODIFIER = Math.SQRT1_2;

export const PLAYER_ONE_CONTROLS = {
  up: "w",
  down: "s",
  left: "a",
  right: "d",
  shoot: "t",
} as const;

export const PLAYER_TWO_CONTROLS = {
  up: "ArrowUp",
  down: "ArrowDown",
  left: "ArrowLeft",
  right: "ArrowRight",
  shoot: "m",
} as const;

export const defaultKeys = {
  w: false,
  s: false,
  d: false,
  a: false,
  t: false,
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
  m: false,
};
