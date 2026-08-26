/**
 * Small typed wrappers around the DOM lookups.
 *
 * `querySelector` returns `Element | null`, so under `strict` every call site
 * would need its own null check. These two helpers do that check once and hand
 * back the element type the caller asked for.
 */

/**
 * Looks up the first element matching the selector.
 *
 * @param selector - CSS selector to search for.
 * @param root - Node to search in, the whole document by default.
 * @returns The element, typed as `T`.
 * @throws If nothing matches - that means the markup and the code drifted apart.
 */
export function qs<T extends Element>(selector: string, root: ParentNode = document): T {
  const element = root.querySelector(selector);
  if (element === null) throw new Error(`Element not found: ${selector}`);
  return element as T;
}

/**
 * Looks up every element matching the selector.
 *
 * @param selector - CSS selector to search for.
 * @param root - Node to search in, the whole document by default.
 * @returns A real array, so `map` and `filter` work on it.
 */
export function qsa<T extends Element>(selector: string, root: ParentNode = document): T[] {
  return Array.from(root.querySelectorAll(selector)) as T[];
}
