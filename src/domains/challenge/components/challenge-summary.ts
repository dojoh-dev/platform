import resetStyles from '@shared/styles/reset.css?inline';
import badge from '@shared/ui/badge';
import { file } from '@shared/ui/icons';
import { css, html, LitElement, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import readmeStyles from '../services/readme.css?inline';
import Readme from '../services/readme.service';

@customElement('challenge-summary')
export class ChallengeSummary extends LitElement {
  static styles = [
    unsafeCSS(resetStyles),
    unsafeCSS(readmeStyles),
    css`
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      div {
        height: 100%;
        overflow-y: auto;
      }

      .summary-hero {
        width: 100%;
        height: 100%;

        .summary-header {
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
    `,
  ];

  @property() readme = `
# Code Challenge: Find the Unique Element

### Summary

You are given an array of integers in which:

* Every element appears **exactly twice**
* Except for **one element**, which appears **only once**

Your task is to implement a function that returns the element that appears only once.

### Requirements

* Time complexity: **O(n)**
* Space complexity: **O(1)** (no additional data structures such as maps or sets)
* The function must return the unique element as a number.

### Example

\`\`\`ts
Input:  [4, 1, 2, 1, 2]
Output: 4
\`\`\`

\`\`\`ts
Input:  [3, 5, 3]
Output: 5
\`\`\`
  `;

  render() {
    const content = Readme.transform(this.readme);
    const div = document.createElement('div');
    div.innerHTML = content;
    return html` <div class="summary-hero">
      <header class="summary-header">
        <ul>
          <li>${file}</li>
          <li>
            <h3>CHALLENGE.md</h3>
          </li>
        </ul>

        <ul>
          <li>${badge('Logic', { colorPallete: '#cbcbcb' })}</li>
          <li>${badge('86% of 3.821', { colorPallete: '#cbcbcb' })}</li>
          <li>${badge('Hard', { colorPallete: '#fc3d3d' })}</li>
        </ul>
      </header>
      <div class="readme-content" .innerHTML=${content}></div>
    </div>`;
  }

  connectedCallback() {
    super.connectedCallback();
  }
}
