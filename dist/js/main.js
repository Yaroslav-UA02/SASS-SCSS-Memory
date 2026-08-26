/**
 * Entry point: sets the screens up and shows the first one.
 *
 * Loaded as a module, so the script waits for the markup by itself and the
 * lookups in the init functions always find their elements.
 */
import { navigate } from "./router.js";
import { initHome } from "./screens/home.js";
/** Registers every screen's event handlers, then opens the home screen. */
function boot() {
    initHome();
    navigate("home");
}
boot();
//# sourceMappingURL=main.js.map