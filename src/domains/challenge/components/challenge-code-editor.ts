import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('challenge-code-editor')
export class ChallengeCodeEditor extends LitElement {
  static styles = css`
    * {
      box-sizing: border-box;
    }

    div {
      display: flex;
      flex-direction: row;
      width: 100%;
      height: 100%;
      overflow-y: auto;

      ul {
        list-style: none;
        padding: 10px;
        margin: 0;

        li {
          text-align: right;
          font-family: var(--font-sans);
          font-size: var(--font-md);
          color: var(--secondary-color);
          line-height: 1.5;
        }
      }

      textarea {
        width: 100%;
        height: 100%;
        padding: 10px;
        font-family: var(--font-mono);
        font-size: var(--font-md);
        color: var(--foreground-color);
        resize: none;
        border: none;
        background: transparent;
        outline: none;
        line-height: 1.5;
      }
    }
  `;

  @state() private code = `/**
 * Returns the number that appears only once.
 * All other numbers appear exactly twice.
 */
export function findUnique(nums: number[]): number {
  // TODO: Implement your solution here  
}`;

  private get lines() {
    return this.code.split('\n').length;
  }

  render() {
    return html`
      <div>
        <ul>
          ${Array.from(
            { length: this.lines },
            (_, i) => html`<li>${i + 1}</li>`
          )}
        </ul>
        <textarea
          name="code"
          @input="${this.handleChange}"
          .value="${this.code}"
        ></textarea>
      </div>
    `;
  }

  public handleChange(e: Event) {
    this.code = (e.target as HTMLTextAreaElement).value;
    console.log(this.code);
  }

  connectedCallback() {
    super.connectedCallback();
  }
}
