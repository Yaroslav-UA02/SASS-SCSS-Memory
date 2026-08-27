/**
 * Entry point: sets the screens up and shows the first one.
 *
 * Loaded as a module, so the script waits for the markup by itself and the
 * lookups in the init functions always find their elements.
 */
import { navigate, onEnter } from "./router.js";
import { initGame, renderGame } from "./screens/game.js";
import { initHome } from "./screens/home.js";
import { initSettings, renderSettings } from "./screens/settings.js";
/** Registers every screen's event handlers, then opens the home screen. */
function boot() {
    initHome();
    initSettings();
    initGame();
    // both are drawn on every visit: the settings from the current selection,
    // the board from the round that was just started
    onEnter("settings", renderSettings);
    onEnter("game", renderGame);
    navigate("home");
}
boot();
//# sourceMappingURL=main.js.map