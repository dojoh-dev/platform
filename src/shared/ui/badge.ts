import { genId } from '@shared/helpers/id';
import { html } from 'lit';

const badge = (children: string, props: { colorPallete?: string }) => {
  const id = genId();
  const { colorPallete = 'var(--primary-color)' } = props;

  const styles = /*css*/ `
    .${id}-badge {
      --color-pallete: ${colorPallete};
      display: inline-block;
      padding: 2px 8px;
      font-size: var(--font-xs);
      font-weight: 600;
      color: var(--color-pallete);
      border: 1px solid color-mix(in srgb, var(--color-pallete) 12.5%, transparent);
      background-color: color-mix(in srgb, var(--color-pallete) 12.5%, transparent);
      border-radius: var(--radii);
      font-family: var(--font-sans);
      user-select: none;
      cursor: default;
      transition: transform 100ms ease;

      &:hover {
        transform: scale(0.98);
      }
    }
  `;

  return html`
    <style style="display: none;">
      ${styles}
    </style>
    <div class="${id}-badge">${children}</div>
  `;
};

export default badge;
