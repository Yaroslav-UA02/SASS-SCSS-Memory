/**
 * User story 5 - the board.
 *
 * The screen renders the engine and nothing more: a click is passed on, and
 * whatever the engine reports back decides what the board does next. No rule
 * is repeated here, so the two can never disagree about whose turn it is.
 */

import { renderScorecards } from "../components/scoreboard.js";
import { MISS_DELAY } from "../config.js";
import { getBoardSize } from "../data/board-sizes.js";
import { getPlayer } from "../data/players.js";
import { motifSrc } from "../data/themes.js";
import { qs } from "../dom.js";
import { navigate } from "../router.js";
import { endGame, requireEngine } from "../store.js";
import type { Card, FlipOutcome, GameConfig, ThemeId } from "../types.js";

/**
 * How long the last matched pair stays on screen before the result.
 *
 * Without it the board would vanish in the same moment the player completes
 * it, and the last pair would never be seen.
 */
const FINISH_DELAY = 800;

/**
 * Wires the board up. Called once at start-up.
 *
 * The click handler sits on the board rather than on every card, so the cards
 * can be dealt and re-dealt without ever re-registering anything.
 */
export function initGame(): void {
  qs<HTMLElement>(".board").addEventListener("click", (event) => {
    const index = clickedCardIndex(event);
    if (index !== null) handleFlip(index);
  });

  qs<HTMLButtonElement>(".btn--exit").addEventListener("click", () => {
    endGame();
    navigate("home");
  });
}

/**
 * Finds the card a click landed on.
 *
 * @param event - The click, caught on the board rather than on a card.
 * @returns The card's place on the board, or `null` if the click missed the
 * cards altogether - the gap between them counts as no click at all.
 */
function clickedCardIndex(event: MouseEvent): number | null {
  const target = event.target;
  if (!(target instanceof Element)) return null;

  const card = target.closest<HTMLButtonElement>(".card");
  if (card === null) return null;

  const index = Number(card.dataset["index"]);
  return Number.isNaN(index) ? null : index;
}

/** Deals a fresh board. Runs on every visit to the screen. */
export function renderGame(): void {
  const engine = requireEngine();
  const board = qs<HTMLElement>(".board");

  applyBoardLayout(board, engine.config);
  board.replaceChildren(
    ...engine.cards.map((card, index) => buildCard(card, index, engine.config.theme)),
  );

  syncCards();
  syncTopbar();
}

/**
 * Hands the SCSS what it needs to draw the board: the theme picks the
 * colours, the grid numbers lay the cards out.
 *
 * @param board - Element both are written onto.
 * @param config - The settings the round runs on.
 */
function applyBoardLayout(board: HTMLElement, config: GameConfig): void {
  const size = getBoardSize(config.size);
  board.dataset["theme"] = config.theme;
  board.dataset["size"] = size.id;
  board.style.setProperty("--columns", String(size.columns));
  board.style.setProperty("--rows", String(size.rows));
}

/**
 * Stamps one card out of the template in the markup.
 *
 * @param card - The card to show once it is turned over.
 * @param index - Its place on the board, which is how a click finds it again.
 * @param theme - The theme the motif file belongs to.
 * @returns The finished card, face down.
 */
function buildCard(card: Card, index: number, theme: ThemeId): HTMLButtonElement {
  const template = qs<HTMLTemplateElement>(".card-template");
  const copy = template.content.cloneNode(true) as DocumentFragment;

  const button = qs<HTMLButtonElement>(".card", copy);
  button.dataset["index"] = String(index);

  const motif = qs<HTMLImageElement>(".card__motif", copy);
  motif.src = motifSrc(theme, card.motif.id);
  // the button's own label already names the motif, so the image stays silent
  motif.alt = "";

  return button;
}

/**
 * Turns one card over and plays out what that led to.
 *
 * @param index - The card that was clicked.
 */
function handleFlip(index: number): void {
  const outcome = requireEngine().flip(index);

  switch (outcome.kind) {
    case "ignored": return;
    case "first": return syncCards();
    case "match": return showMatch(outcome.finished);
    case "miss": return showMiss();
    default: return assertNever(outcome);
  }
}

/**
 * Draws a found pair, and moves on to the result once it was the last one.
 *
 * @param finished - Whether that pair completed the board.
 */
function showMatch(finished: boolean): void {
  syncCards();
  syncTopbar();
  if (finished) window.setTimeout(() => navigate("gameover"), FINISH_DELAY);
}

/**
 * Draws a missed turn.
 *
 * Both cards stay up long enough to be memorized; then the engine turns them
 * back over and the turn passes.
 */
function showMiss(): void {
  syncCards();
  window.setTimeout(() => {
    requireEngine().settle();
    syncCards();
    syncTopbar();
  }, MISS_DELAY);
}

/**
 * Writes the deck's state onto the cards.
 *
 * Only classes are set, never the markup - replacing a card mid-turn would
 * restart the flip animation from the beginning.
 */
function syncCards(): void {
  const board = qs<HTMLElement>(".board");

  requireEngine().cards.forEach((card, index) => {
    const button = board.children[index];
    if (button instanceof HTMLButtonElement) syncCard(button, card, index);
  });
}

/**
 * Puts one card into the state the engine has it in.
 *
 * @param button - The card on the board.
 * @param card - What the engine says about it.
 * @param index - Its place, which is what the spoken label counts from.
 */
function syncCard(button: HTMLButtonElement, card: Card, index: number): void {
  const open = card.state !== "hidden";
  button.classList.toggle("is-flipped", open);
  button.classList.toggle("is-matched", card.state === "matched");

  // a found pair stays on the board but is out of play
  button.disabled = card.state === "matched";
  button.setAttribute(
    "aria-label",
    open ? `Card ${index + 1}, ${card.motif.label}` : `Card ${index + 1}, face down`,
  );
}

/** Puts the scores and the active player in the topbar. */
function syncTopbar(): void {
  const engine = requireEngine();
  // the result screen carries a second pair of chips, so the lookup stays
  // inside the topbar
  const topbar = qs<HTMLElement>(".topbar");

  renderScorecards(topbar, engine.scores, engine.currentPlayer);

  const turn = qs<HTMLElement>(".topbar__player", topbar);
  turn.textContent = getPlayer(engine.currentPlayer).label;
  turn.dataset["player"] = engine.currentPlayer;
}

/**
 * Marks the branch the type system has already ruled out.
 *
 * @param outcome - Whatever is left over, which is `never` by now.
 * @throws Always. Adding an outcome without handling it here stops compiling
 * first, so this only ever fires if the engine is changed at runtime.
 */
function assertNever(outcome: never): never {
  throw new Error(`Unhandled flip outcome: ${JSON.stringify(outcome as FlipOutcome)}`);
}
