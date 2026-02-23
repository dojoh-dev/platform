import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('challenge-console')
export class ChallengeConsole extends LitElement {
  static styles = css`
    * {
      box-sizing: border-box;
    }

    .console {
      padding: var(--spacing);
      height: 100%;
      width: 100%;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
    }

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
  `;

  @state() history: string[] = [];
  @state() currentLine = '';

  render() {
    return html`<div class="console">
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
    </div>`;
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
