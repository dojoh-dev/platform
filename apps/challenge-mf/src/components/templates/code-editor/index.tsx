'use client';

import { useState } from 'react';
import { Bolt, Braces } from 'lucide-react';

import styles from './index.module.css';

const DEFAULT_CODE = `/**
 * Returns the number that appears only once.
 * All other numbers appear exactly twice.
 */
export function findUnique(nums: number[]): number {
  // TODO: Implement your solution here
}`;

export default function CodeEditor() {
  const [code, setCode] = useState(DEFAULT_CODE);

  const lines = code.split('\n').length;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };

  return (
    <div className={styles.editorHero}>
      <div className={styles.editorHeader}>
        <ul>
          <li>
            <button type="button" className="icon-button">
              <Braces size={18} />
            </button>
          </li>
          <li>
            <h3>TypeScript</h3>
          </li>
        </ul>

        <ul>
          <li>
            <button type="button" className="icon-button">
              <Bolt size={18} />
            </button>
          </li>
        </ul>
      </div>

      <div className={styles.editorBody}>
        <ul>
          {Array.from({ length: lines }, (_, i) => (
            <li key={i}>{i + 1}</li>
          ))}
        </ul>
        <textarea
          className="code-area"
          name="code"
          onChange={handleChange}
          value={code}
        />
      </div>
    </div>
  );
}
