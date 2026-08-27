/**
 * The router: exactly one screen is visible, every other one carries `hidden`.
 *
 * It reads the screens off the markup instead of a hard-coded list, so a screen
 * that does not exist yet simply cannot be navigated to - no dead lookups while
 * the app is still being built up.
 */
import { qsa } from "./dom.js";
const hooks = new Map();
/**
 * Registers a callback for a screen.
 *
 * Screens that have to be redrawn from the current settings - the board, for
 * instance - hook in here instead of drawing themselves once at start-up.
 *
 * @param id - Screen the hook belongs to.
 * @param hook - Callback, called on every visit to that screen.
 */
export function onEnter(id, hook) {
    hooks.set(id, hook);
}
/**
 * Shows one screen and hides all the others.
 *
 * A screen that the markup does not carry yet is ignored instead of leaving
 * the app on an empty page - the current screen simply stays up.
 *
 * @param id - Screen to show; its element is `#screen-<id>`.
 */
export function navigate(id) {
    const screens = qsa(".screen");
    if (!screens.some((screen) => screen.id === `screen-${id}`))
        return;
    for (const screen of screens) {
        screen.hidden = screen.id !== `screen-${id}`;
    }
    // the body knows the current screen, so the SCSS can react to it
    document.body.dataset["screen"] = id;
    hooks.get(id)?.();
}
//# sourceMappingURL=router.js.map