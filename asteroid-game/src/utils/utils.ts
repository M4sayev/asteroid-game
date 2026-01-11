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
