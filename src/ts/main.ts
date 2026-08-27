/**
 * Entry point: sets the screens up and shows the first one.
 *
 * Loaded as a module, so the script waits for the markup by itself and the
 * lookups in the init functions always find their elements.
 */

import { navigate, onEnter } from "./router.js";
import { initHome } from "./screens/home.js";
import { initSettings, renderSettings } from "./screens/settings.js";

/** Registers every screen's event handlers, then opens the home screen. */
function boot(): void {
  initHome();
  initSettings();

  // the settings screen is drawn from the current selection on every visit
  onEnter("settings", renderSettings);

  navigate("home");
}

boot();
