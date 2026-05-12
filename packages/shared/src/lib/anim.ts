import { wait } from './clock';

export const encryptText = async (
	element: HTMLElement,
	finalText: string,
	opt: { tickDelay: number; wait: number } = {
		tickDelay: 50,
		wait: 500,
	}
) => {
	const symbols = '1 0';

	const getRandomSymbol = () =>
		symbols[Math.floor(Math.random() * symbols.length)];

	const originalText = element.textContent || '';
	const maxLength = Math.max(originalText.length, finalText.length);

	const paddedFinal = finalText.padEnd(maxLength, ' ');

	// Current visible chars
	const current = originalText.padEnd(maxLength, ' ').split('');

	// 1. Randomly replace chars with symbols
	const touchedIndices = new Set<number>();

	const encryptionLoop = async (): Promise<void> =>
		new Promise((resolve) => {
			const tick = () => {
				if (touchedIndices.size >= maxLength) {
					resolve();
					return;
				}

				let idx: number;

				do {
					idx = Math.floor(Math.random() * maxLength);
				} while (touchedIndices.has(idx));

				current[idx] = getRandomSymbol();
				element.textContent = current.join('');
				touchedIndices.add(idx);

				setTimeout(tick, opt.tickDelay);
			};

			tick();
		});

	const decryptionLoop = async (): Promise<void> =>
		new Promise((resolve) => {
			const tick = () => {
				if (touchedIndices.size === 0) {
					element.textContent = finalText;
					resolve();
					return;
				}

				let idx: number;

				do {
					idx = Math.floor(Math.random() * maxLength);
				} while (!touchedIndices.has(idx));

				current[idx] = paddedFinal[idx];
				element.textContent = current.join('');
				touchedIndices.delete(idx);

				setTimeout(tick, opt.tickDelay);
			};

			tick();
		});

	await encryptionLoop();
	await wait(opt.wait); // Stupid grace time?
	await decryptionLoop();
};

export const shakeElement = (element: HTMLElement) => {
	// default.css will perform the shake animation when aria-invalid is set to true
	if (element.ariaInvalid === 'true') {
		// Restart the animation by toggling the aria-invalid attribute
		element.removeAttribute('aria-invalid');
		// Force a reflow to ensure the animation can be restarted
		void element.offsetWidth;
	}
	element.ariaInvalid = 'true';
};
