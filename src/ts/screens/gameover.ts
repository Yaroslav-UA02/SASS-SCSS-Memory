/**
 * User story 6 - the result screen.
 *
 * The round is already over by the time this screen is entered, so nothing is
 * worked out here: the engine hands out the final standings and the screen
 * only puts them into words. The engine is kept alive until the player leaves,
 * because the standings are read on every entry.
 */

import { PLAYERS, getPlayer } from "../data/players.js";
import { qs } from "../dom.js";
import { navigate } from "../router.js";
import { endGame, requireEngine, startGame } from "../store.js";

/** Wires the two ways on from the result up. Called once at start-up. */
export function initGameover(): void {
  // same settings, fresh deck - the engine deals a new one on every start
  qs<HTMLButtonElement>(".btn--again").addEventListener("click", () => {
    startGame();
    navigate("game");
  });

  qs<HTMLButtonElement>(".btn--home").addEventListener("click", () => {
    endGame();
    navigate("home");
  });
}

/** Writes the final standings out. Runs on every visit to the screen. */
export function renderGameover(): void {
  const { scores, winner } = requireEngine().result;
  const gameover = qs<HTMLElement>(".gameover");

  const headline = qs<HTMLElement>(".gameover__title", gameover);
  headline.textContent = winner === null ? "It's a draw!" : `${getPlayer(winner).label} wins!`;
  // the headline is written in the winner's colour; a draw belongs to neither
  // player, so the attribute comes off again rather than keeping the last one
  if (winner === null) delete headline.dataset["player"];
  else headline.dataset["player"] = winner;

  // the chips are the ones from the topbar, so the score is read the same way
  // it was read all round
  for (const player of PLAYERS) {
    const scorecard = qs<HTMLElement>(`.scorecard[data-player="${player.id}"]`, gameover);
    qs<HTMLElement>(".scorecard__value", scorecard).textContent = String(scores[player.id]);
    scorecard.classList.toggle("is-active", player.id === winner);
  }
}
