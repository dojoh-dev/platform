export const effect = (fn: () => void) => {
	setTimeout(fn, 25);
};
