/**
 * User story 4 - the settings screen.
 *
 * Three things get picked here: theme, starting player and board size. The
 * screen keeps nothing of its own - every choice goes straight into the store
 * and the whole screen is redrawn from it afterwards. That way the preview,
 * the breadcrumb and the start button can never drift apart from the state a
 * round would actually be started with.
 */

import { BOARD_SIZES } from "../data/board-sizes.js";
import { PLAYERS, getPlayer } from "../data/players.js";
import { THEMES, getTheme, motifSrc } from "../data/themes.js";
import { qs, qsa } from "../dom.js";
import { navigate } from "../router.js";
import { getDraft, isDraftComplete, setPlayer, setSize, setTheme, startGame } from "../store.js";
import type { BoardSizeId, PlayerId, ThemeId } from "../types.js";

/**
 * Narrows a radio's value to a theme id.
 *
 * The DOM only ever hands out `string`, so the value gets checked against the
 * data before it is written into the store - a typo in the markup then shows
 * up as an ignored click instead of a broken state.
 */
function isThemeId(value: string): value is ThemeId {
  return THEMES.some((theme) => theme.id === value);
}

/** Narrows a radio's value to a player id. */
function isPlayerId(value: string): value is PlayerId {
  return PLAYERS.some((player) => player.id === value);
}

/** Narrows a radio's value to a board size id. */
function isBoardSizeId(value: string): value is BoardSizeId {
  return BOARD_SIZES.some((size) => size.id === value);
}

/**
 * Wires the settings form and the start button up. Called once at start-up.
 *
 * The `change` handler sits on the form instead of on every single radio, so
 * the three groups share one listener.
 */
export function initSettings(): void {
  qs<HTMLFormElement>(".settings__form").addEventListener("change", (event) => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) return;

    if (input.name === "theme" && isThemeId(input.value)) setTheme(input.value);
    if (input.name === "player" && isPlayerId(input.value)) setPlayer(input.value);
    if (input.name === "size" && isBoardSizeId(input.value)) setSize(input.value);

    renderSettings();
  });

  qs<HTMLButtonElement>(".btn--start").addEventListener("click", () => {
    // the button is disabled while something is missing; the check is the
    // second lock, for a click that arrives via the keyboard anyway
    if (!isDraftComplete()) return;
    startGame();
    navigate("game");
  });
}

/** Redraws preview, breadcrumb and start button from the current draft. */
export function renderSettings(): void {
  const draft = getDraft();

  renderPreview();
  renderBreadcrumb();

  qs<HTMLButtonElement>(".btn--start").disabled = !isDraftComplete();

  // the screen carries the theme, so the SCSS can tint the preview
  const settings = qs<HTMLElement>(".settings");
  if (draft.theme === null) delete settings.dataset["theme"];
  else settings.dataset["theme"] = draft.theme;
}

/**
 * Fills the sample card with the chosen theme and names the starting player.
 *
 * Before a theme is picked the card stays empty on purpose - showing some
 * random motif would suggest a choice that has not been made.
 */
function renderPreview(): void {
  const { theme, player } = getDraft();
  const preview = qs<HTMLElement>(".preview");
  const motif = qs<HTMLImageElement>(".preview__motif");

  if (theme === null) {
    motif.hidden = true;
    motif.removeAttribute("src");
    motif.alt = "";
  } else {
    // the first motif stands in for the whole set
    const [sample] = getTheme(theme).motifs;
    if (sample) {
      motif.src = motifSrc(theme, sample.id);
      motif.alt = sample.label;
      motif.hidden = false;
    }
  }

  preview.dataset["player"] = player ?? "";
  qs<HTMLElement>(".preview__player").textContent = player === null ? "-" : getPlayer(player).label;
}

/** Ticks off the breadcrumb steps that are already picked. */
function renderBreadcrumb(): void {
  const draft = getDraft();
  const done: Record<string, boolean> = {
    theme: draft.theme !== null,
    player: draft.player !== null,
    size: draft.size !== null,
  };

  for (const step of qsa<HTMLElement>(".breadcrumb__step")) {
    step.classList.toggle("is-done", done[step.dataset["step"] ?? ""] === true);
  }
}
