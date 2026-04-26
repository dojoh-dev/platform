import { effect } from '@repo/shared/stateful';

import './styles.css';

export const metadata = {
	title: 'Challenge',
	head: [
		{
			tag: 'link',
			attributes: {
				rel: 'stylesheet',
				href: '/challenge-mf/entry-client.css',
				type: 'text/css',
				crossorigin: 'anonymous',
			},
		},
	],
};

effect(async () => {
	const container = document.querySelector('#challenge-page');

	if (container) {
		// @ts-expect-error - dynamic import of a module that may not exist at build time
		const url = import.meta.env.DEV
			? 'http://localhost:4000/lib/entry-client.tsx'
			: '/challenge-mf/lib/entry-client.mjs';
		const { mountApp } = await import(url);
		mountApp(container, {
			matchId: 'abc123',
		});
	}
});

export default function component() {
	return /*html*/ `
    <div id="challenge-page"></div>
  `;
}
