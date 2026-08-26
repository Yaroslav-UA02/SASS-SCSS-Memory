/**
 * The router: exactly one screen is visible, every other one carries `hidden`.
 *
 * It reads the screens off the markup instead of a hard-coded list, so a screen
 * that does not exist yet simply cannot be navigated to - no dead lookups while
 * the app is still being built up.
 */

import { qsa } from "./dom.js";
import type { ScreenId } from "./types.js";

/** Runs every time its screen is entered, before it becomes visible. */
type EnterHook = () => void;

const hooks = new Map<ScreenId, EnterHook>();

/**
 * Registers a callback for a screen.
 *
 * Screens that have to be redrawn from the current settings - the board, for
 * instance - hook in here instead of drawing themselves once at start-up.
 *
 * @param id - Screen the hook belongs to.
 * @param hook - Callback, called on every visit to that screen.
 */
export function onEnter(id: ScreenId, hook: EnterHook): void {
  hooks.set(id, hook);
}

/**
 * Shows one screen and hides all the others.
 *
 * @param id - Screen to show; its element is `#screen-<id>`.
 */
export function navigate(id: ScreenId): void {
  for (const screen of qsa<HTMLElement>(".screen")) {
    screen.hidden = screen.id !== `screen-${id}`;
  }

  // the body knows the current screen, so the SCSS can react to it
  document.body.dataset["screen"] = id;

  hooks.get(id)?.();
}
