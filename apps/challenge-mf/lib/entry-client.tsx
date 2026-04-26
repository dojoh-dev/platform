import { createRoot } from 'react-dom/client';
import App from '../src/App';
import css from '../dist/challenge-mf.css?inline';

export function mountApp(container: HTMLElement, props?: any) {
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const root = createRoot(container);
  root.render(<App {...props} />);
}
