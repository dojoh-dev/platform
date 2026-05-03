import { effect } from '@repo/shared/stateful';

import styles from './page.module.css';

export const metadata = {
	title: 'Dojoh.dev – Get access to your account',
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const traverseNodes = (node: NodeListOf<ChildNode>): Array<ChildNode> => {
	const childNodes: Array<ChildNode> = [];
	node.forEach((child) => {
		if (child.childNodes.length > 0) {
			childNodes.push(...traverseNodes(child.childNodes));
		} else {
			childNodes.push(child);
		}
	});
	return childNodes;
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

		const setScaleOnly = (scale: number) => {
			currentScale = scale;
			updateTransform();
		};

		let isCursorInside = false;

		leftSide.addEventListener('mouseleave', () => {
			isCursorInside = false;
			document.documentElement.style.cursor = 'default';
		});

		leftSide.addEventListener('mouseenter', () => {
			isCursorInside = true;
			document.documentElement.style.cursor = 'none';
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
	    </div>
	</section>`;
}
