/**
 * The pair of score chips, shared by the board and the result screen.
 *
 * Both screens show the same two chips and fill them from the same scores -
 * they only disagree about who is highlighted: whoever is to move while the
 * round runs, the winner once it is over. Keeping the drawing in one place is
 * what stops the final score from being read differently to the running one.
 */

import { PLAYERS } from "../data/players.js";
import { qs } from "../dom.js";
import type { PlayerId, Scores } from "../types.js";

/**
 * Writes the scores onto the chips of one screen.
 *
 * @param root - Element the chips live in; both screens carry a pair, so the
 * lookup is never left to the whole document.
 * @param scores - What to show per player.
 * @param highlight - Player to mark as active, `null` for neither.
 */
export function renderScorecards(root: ParentNode, scores: Scores, highlight: PlayerId | null): void {
  for (const player of PLAYERS) {
    const scorecard = qs<HTMLElement>(`.scorecard[data-player="${player.id}"]`, root);
    qs<HTMLElement>(".scorecard__value", scorecard).textContent = String(scores[player.id]);
    scorecard.classList.toggle("is-active", player.id === highlight);
  }
}
