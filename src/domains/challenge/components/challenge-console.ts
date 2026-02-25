import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import { play, testTubeDiagonal } from '@shared/ui/icons';
import resetStyles from '@shared/styles/reset.css?inline';
import defaultStyles from '@shared/styles/default.css?inline';

@customElement('challenge-console')
export class ChallengeConsole extends LitElement {
  static styles = [
    unsafeCSS(resetStyles),
    unsafeCSS(defaultStyles),
    css`
      .console-hero {
        width: 100%;
        height: 100%;

        .console-header {
          min-height: 50px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          column-gap: 8px;
          border-bottom: 1px solid var(--border-color);
          padding-inline: 10px;

          ul {
            display: flex;
            align-items: center;
            justify-content: center;
            column-gap: 6px;
            list-style: none;

            li {
              display: grid;
              place-items: center;
            }
          }

          h3 {
            font-weight: 500;
            font-family: var(--font-sans);
            font-size: var(--font-sm);
            color: var(--foreground-color);
          }
        }

        .console-body {
          padding: var(--spacing);
          height: calc(100% - 50px);
          width: 100%;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-start;

          span {
            display: block;
            font-family: var(--font-mono);
            font-size: var(--font-md);
            color: var(--foreground-color);
            line-height: 1.5;
          }

          .input {
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            column-gap: 5px;
            justify-content: flex-start;
            width: 100%;
            line-height: 1.5;

            input[type='text'] {
              width: 100%;
              background: transparent;
              border: none;
              color: var(--foreground-color);
              font-family: var(--font-mono);
              font-size: var(--font-md);
              outline: none;
            }
          }
        }
      }
    `,
  ];

  @state() history: string[] = [];
  @state() currentLine = '';

  render() {
    return html`
      <div class="console-hero">
        <header class="console-header">
          <ul>
            <li>${testTubeDiagonal}</li>
            <li>
              <h3>Test Runner</h3>
            </li>
          </ul>

          <ul>
            <li>
              <button type="button" class="icon-button">${play}</button>
            </li>
          </ul>
        </header>

        <div class="console-body">
          ${this.history.map((line) => html`<span>&gt; ${line}</div>`)}

          <div class="input">
            <span>&gt;</span>
            <input
              type="text"
              @input="${this.handleChange}"
              @keydown="${this.handleInput}"
              .value="${this.currentLine}"
            />
          </div>
        </div>
      </div>
    `;
  }

  public handleChange(e: Event) {
    this.currentLine = (e.target as HTMLInputElement).value;
  }

  public handleInput(e: KeyboardEvent) {
    const target = e.target as HTMLInputElement;
    if (e.key === 'Enter' && target.value.trim() !== '') {
      const input = target.value.trim();
      this.history = [...this.history, input];
      this.currentLine = '';
    }
  }

  connectedCallback() {
    super.connectedCallback();
  }
}
