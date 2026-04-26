import { effect } from '@repo/shared/stateful';

import './styles.css';

effect(async () => {
  const container = document.querySelector('#challenge-page');

  if (container) {
    const isDev = import.meta.env.DEV;
    const url = isDev
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
