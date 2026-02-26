import { effect } from '@repo/shared/stateful';

import './styles.css';

effect(async () => {
  const container = document.querySelector('#challenge-page');

  if (container) {
    const { mountApp } =
      await import('http://localhost:4000/lib/entry-client.tsx');
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
