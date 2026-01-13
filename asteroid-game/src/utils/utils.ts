import type { BaseEntity } from "../entities/entity";

const focusableElements: string =
  "button:not([disabled]), input:not([disabled]):not([type='hidden']), select:not([disabled]), textarea, [tabindex]:not([tabindex='-1'])";

export function trapFocus(element: HTMLElement) {
  const elements = element.querySelectorAll(focusableElements);

  const first = elements[0] as HTMLElement;
  const last = elements[elements.length - 1] as HTMLElement;

  first.focus();

  element.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key !== "Tab") return;

    if (event.shiftKey) {
      if (document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
}

export function camelToNormal(str: string) {
  return str.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();
}

export function getRandomIndex(len: number) {
  return Math.floor(Math.random() * len);
}

export function calculateCollisionNormal(
  entityOne: BaseEntity,
  entityTwo: BaseEntity
): { nx: number; ny: number } {
  const { x: ax, y: ay } = entityOne.getCoordinates();
  const { width: aWidth, height: aHeight } = entityOne.getSize();

  const { x: bx, y: by } = entityTwo.getCoordinates();
  const { width: bWidth, height: bHeight } = entityTwo.getSize();

  const dx = ax + aWidth / 2 - (bx + bWidth / 2);
  const dy = ay + aHeight / 2 - (by + bHeight / 2);
  const dist = Math.hypot(dx, dy) || 1;

  const nx = dx / dist;
  const ny = dy / dist;
  return { nx, ny };
}
