/**
 * Shorthand for `document.querySelector` that throws an error if the element is not found.
 *
 * @param selector The CSS selector to query.
 * @returns The found element.
 */
export const $$ = <S extends Element>(selector: string): S => {
	const element = document.querySelector<S>(selector);
	if (!element) {
		throw new Error(`Element not found: ${selector}`);
	}
	return element;
};
