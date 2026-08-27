/**
 * The rules of a round, as opposed to the data it is played with.
 *
 * Motifs, players and board sizes live in `src/ts/data/`, because they are
 * the content the settings screen offers. What is left here are the few
 * numbers the engine and the board read while a round runs.
 */

import type { PlayerId } from "./types.js";

/**
 * Whose turn follows whose.
 *
 * Both players always sit at the table - the settings only pick who opens,
 * and the engine walks this list from there.
 */
export const TURN_ORDER: readonly PlayerId[] = ["blue", "orange"];

/**
 * How long a wrong pair stays face up, in milliseconds.
 *
 * Long enough to memorize the two cards, short enough not to slow the round
 * down. The engine keeps the board locked for exactly that long.
 */
export const MISS_DELAY = 900;
