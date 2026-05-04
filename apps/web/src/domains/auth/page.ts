import { effect } from '@repo/shared/stateful';

import eyeClosedIcon from '../../assets/lucid-icons/eye-closed.svg?import';
import eyeIcon from '../../assets/lucid-icons/eye.svg?import';
import styles from './page.module.css';

export const metadata = {
	title: 'Dojoh.dev – Get access to your account',
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const encryptText = async (
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

export default function component() {
	// Typewriter effect
	effect(() => {
		const typewritter =
			document.querySelector<HTMLHeadingElement>('#typewriter');
		const cursor = document.querySelector<HTMLSpanElement>(`#cursor`);

		if (!cursor) throw new Error('Cursor element not found');
		if (!typewritter) throw new Error('Typewritter element not found');

		const phrases = [
			'Join, Play, have fun!',
			'Challenge yourself and others!',
			'Compete with friends and climb the leaderboard!',
		];

		let currentPhraseIdx = 0;
		let currentPhrase = phrases[currentPhraseIdx];
		let currentCharIdx = 0;
		let isDeleting = false;

		const typeLoop = async () => {
			if (cursor.dataset.stillTyping !== 'false') {
				cursor.dataset.stillTyping = 'false';
			}

			if (isDeleting) {
				currentCharIdx--;
				typewritter.textContent = currentPhrase.slice(
					0,
					currentCharIdx
				);

				if (currentCharIdx === 0) {
					isDeleting = false;
					currentPhraseIdx = (currentPhraseIdx + 1) % phrases.length;
					currentPhrase = phrases[currentPhraseIdx];
				}
			} else {
				currentCharIdx++;
				typewritter.textContent = currentPhrase.slice(
					0,
					currentCharIdx
				);

				if (currentCharIdx === currentPhrase.length) {
					isDeleting = true;

					cursor.dataset.stillTyping = 'true';
					await wait(3000); // Pause to read the full phrase
				}
			}

			setTimeout(typeLoop, 150);
		};

		typeLoop();
	});

	// Bubble cursor effect
	effect(() => {
		const bubbleCursor =
			document.querySelector<HTMLSpanElement>('#bubble-cursor');
		const leftSide = document.querySelector<HTMLDivElement>('#left-side');

		if (!leftSide) throw new Error('Left side element not found');
		if (!bubbleCursor) throw new Error('Bubble cursor element not found');

		// Keep track of current scale and translate
		let currentScale = 0;
		const currentTranslate = { x: 0, y: 0 };

		const updateTransform = () => {
			bubbleCursor.style.transform = `translate(${currentTranslate.x}px, ${currentTranslate.y}px) scale(${currentScale})`;
		};

		let isCursorInside = false;

		leftSide.addEventListener('mouseleave', () => {
			isCursorInside = false;
			document.documentElement.style.cursor = 'default';
		});

		leftSide.addEventListener('mouseenter', () => {
			isCursorInside = true;
			document.documentElement.style.cursor = 'none';
			bubbleCursor.style.height = '200px';
			bubbleCursor.style.width = '200px';
		});

		const FIXED_OFFSET = 20;

		document.addEventListener('mousemove', (e) => {
			const elementOnCursor = document.elementFromPoint(
				e.clientX,
				e.clientY
			);

			const isHeadingOrText =
				elementOnCursor &&
				[
					HTMLHeadingElement,
					HTMLParagraphElement,
					HTMLImageElement,
				].some((instance) => elementOnCursor instanceof instance);

			currentScale = isCursorInside ? (isHeadingOrText ? 0.25 : 1) : 0;

			const width = bubbleCursor.offsetWidth;
			const height = bubbleCursor.offsetHeight;

			currentTranslate.x = e.clientX - width / 2 - FIXED_OFFSET;
			currentTranslate.y = e.clientY - height / 2 - FIXED_OFFSET;

			updateTransform();
		});
	});

	// Password visibility toggle
	effect(() => {
		const toggleButton = document.querySelector<HTMLButtonElement>(
			'#toggle-password-visibility'
		);
		const passwordInput =
			document.querySelector<HTMLInputElement>('#password');

		if (!toggleButton) throw new Error('Toggle button not found');
		if (!passwordInput) throw new Error('Password input not found');

		toggleButton.addEventListener('click', () => {
			const isPasswordVisible = passwordInput.type === 'text';
			passwordInput.type = isPasswordVisible ? 'password' : 'text';
			toggleButton.querySelector('img')!.src = isPasswordVisible
				? eyeIcon
				: eyeClosedIcon;
			toggleButton.setAttribute(
				'aria-label',
				isPasswordVisible ? 'Show password' : 'Hide password'
			);
		});
	});

	// Switch to sign-up page (encryption animation)
	effect(() => {
		const signUpLink =
			document.querySelector<HTMLAnchorElement>('#redirect-link');
		const title = document.querySelector<HTMLHeadingElement>('#title');
		const subtitle =
			document.querySelector<HTMLParagraphElement>('#subtitle');

		if (!signUpLink) throw new Error('Sign-up link not found');

		signUpLink.addEventListener('click', (e) => {
			e.preventDefault();
		});

		const titles = ['Welcome back!', 'Join the battle'];
		const subtitles = [
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus.',
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ac diam sit amet quam vehicula elementum sed.',
		];
		const links = ['Join the battle', 'Back to login'];

		let currentIndex = 0;

		signUpLink.addEventListener('click', () => {
			currentIndex = (currentIndex + 1) % titles.length;

			encryptText(title!, titles[currentIndex], {
				tickDelay: 30,
				wait: 300,
			});
			// Subtitle has a longer text, so we give it more time to encrypt/decrypt for better effect
			encryptText(subtitle!, subtitles[currentIndex], {
				tickDelay: 8,
				wait: 50,
			});
			encryptText(signUpLink, links[currentIndex], {
				tickDelay: 30,
				wait: 300,
			});
		});
	});

	return /*html*/ `
	<section class="${styles.login}">
	    <div id="left-side" class="${styles.leftSide}">
			<span id="bubble-cursor" class="${styles.bubbleCursor}"></span>

			<span id="logo" class="${styles.logo}">
				<img src="/rounded.png" alt="logo" width="24" height="24" />
				<h1>dojoh<p>.dev</p></h1>
			</span>

			<span class="${styles.text}">
				<div class="${styles.typewriterContainer}">
					<h2 id="typewriter" class="${styles.typewriter}">Join, Play, have fun!</h2>
					<span id="cursor" class=${styles.cursor} data-still-typing="false"></span>
				</div>

				<p>Yorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan.</p>
			</span>

			<video autoplay muted loop inline playsinline>
				<source src="/black-waves.mp4" type="video/mp4" />
			</video>
	    </div>

	    <div class="${styles.rightSide}">
			<h1 id="title">Welcome back!</h1>
			<p id="subtitle">
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus.
			</p>

			<form id="login-form">
				<div class="${styles.inputGroup}">
					<label for="email">Email / Nickname</label>
					<div>
						<input type="text" id="email" name="email" placeholder="johndoe@gmail.com / johndoe" />
					</div>
				</div>

				<div class="${styles.inputGroup}">
					<label for="password">Password</label>
					<div>
						<input type="password" id="password" name="password" placeholder="· · · · · · · · · · · ·" />
						<span
							id="toggle-password-visibility"
							data-append
							type="button"
							aria-label="Toggle password visibility"
						>
							<img src="${eyeIcon}" alt="Toggle password visibility" width="16" height="16" />
						</span>
					</div>
				</div>

				<a href="/forgot-password">Forgot password?</a>

				<button type="submit">Login</button>
			</form>

			<span class="${styles.or}"></span>

			<div class="${styles.stackY}">
				<button class="${styles.oauthButton}" data-provider="google">
					<div aria-label="Google logo" width="16" height="16" ></div>
					Continue with Google
				</button>

				<button class="${styles.oauthButton}" data-provider="github">
					<div aria-label="Github logo" width="16" height="16" ></div>
					Continue with Github
				</button>

				<button class="${styles.oauthButton}" data-provider="discord">
					<div aria-label="Discord logo" width="16" height="16" ></div>
					Continue with Discord
				</button>
			</div>

			<p class="${styles.signUpPrompt}">
				Ready to prove your skills?
				<a
					id="redirect-link"
					href="#redirect-up"
					title="Create account"
				>
					Join the battle.
				</a>
			</p>
	    </div>
	</section>`;
}
