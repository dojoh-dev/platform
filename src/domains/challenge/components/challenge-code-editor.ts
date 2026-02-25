import defaultStyles from '@shared/styles/default.css?inline';
import resetStyles from '@shared/styles/reset.css?inline';
import { bolt, braces } from '@shared/ui/icons';
import { css, html, LitElement, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('challenge-code-editor')
export class ChallengeCodeEditor extends LitElement {
  static styles = [
    unsafeCSS(resetStyles),
    unsafeCSS(defaultStyles),
    css`
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      .editor-hero {
        width: 100%;
        height: 100%;

        .editor-header {
          height: 50px;
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

        .editor-body {
          display: flex;
          flex-direction: row;
          width: 100%;
          height: calc(100% - 50px);
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
      }
    `,
  ];

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
      <div class="editor-hero">
        <div class="editor-header">
          <ul>
            <li>${braces}</li>
            <li>
              <h3>TypeScript</h3>
            </li>
          </ul>

          <ul>
            <li>
              <button type="button" class="icon-button">${bolt}</button>
            </li>
          </ul>
        </div>
        <div class="editor-body">
          <ul class="gutter-lines">
            ${Array.from(
              { length: this.lines },
              (_, i) => html`<li>${i + 1}</li>`
            )}
          </ul>
          <textarea
            class="code-area"
            name="code"
            @input="${this.handleChange}"
            .value="${this.code}"
          ></textarea>
        </div>
      </div>
    `;
  }

  public handleChange(e: Event) {
    this.code = (e.target as HTMLTextAreaElement).value;
  }

  connectedCallback() {
    super.connectedCallback();
  }
}
