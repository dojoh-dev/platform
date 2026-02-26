'use client';

import Badge from '@/components/ui/badge';
import Readme from '@/services/readme/index.service';

import { File } from 'lucide-react';
import { memo } from 'react';

import styles from './index.module.css';
import '@/services/readme/styles.css';

function Summary({
  readme = `
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
  `,
}: {
  readme?: string;
}) {
  const content = Readme.transform(readme);

  return (
    <div className={styles.summaryHero}>
      <header className={styles.summaryHeader}>
        <ul>
          <li>
            <File size={18} />
          </li>
          <li>
            <h3>CHALLENGE.md</h3>
          </li>
        </ul>

        <ul>
          <li>
            <Badge label="Logic" colorPallete="#cbcbcb" />
          </li>
          <li>
            <Badge label="86% of 3.521" colorPallete="#cbcbcb" />
          </li>
          <li>
            <Badge label="Hard" colorPallete="#fc3d3d" />
          </li>
        </ul>
      </header>
      <div
        className="readme-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}

export default memo(Summary);
