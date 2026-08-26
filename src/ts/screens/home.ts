/**
 * User story 1 - the home screen.
 *
 * It holds a single control: `Play` leads on to the settings.
 */

import { qs } from "../dom.js";
import { navigate } from "../router.js";

/** Wires the play button up. Called once at start-up. */
export function initHome(): void {
  qs<HTMLButtonElement>(".btn--play").addEventListener("click", () => {
    navigate("settings");
  });
}
