import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import Readme from '../services/readme.service';
import readmeStyles from '../services/readme.css?inline';

@customElement('challenge-summary')
export class ChallengeSummary extends LitElement {
  static styles = [
    css`
      * {
        box-sizing: border-box;
      }
      div {
        height: 100%;
        overflow-y: auto;
      }
    `,
    unsafeCSS(readmeStyles),
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
    return html` <div class="readme-content" .innerHTML=${content}></div> `;
  }

  connectedCallback() {
    super.connectedCallback();
  }
}
