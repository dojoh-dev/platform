'use client';

import React, { useState } from 'react';
import { Play, TestTubeDiagonal } from 'lucide-react';

import styles from './index.module.css';

export default function Console() {
  const [history, setHistory] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentLine(e.target.value);
  };

  const handleInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    if (e.key === 'Enter' && target.value.trim() !== '') {
      const input = target.value.trim();
      setHistory((prev) => [...prev, input]);
      setCurrentLine('');
    }
  };

  return (
    <div className={styles.testRunnerHero}>
      <header className={styles.testRunnerHeader}>
        <ul>
          <li>
            <TestTubeDiagonal size={18} />
          </li>
          <li>
            <h3>Test Runner</h3>
          </li>
        </ul>

        <ul>
          <li>
            <button type="button" className="icon-button">
              <Play size={18} />
            </button>
          </li>
        </ul>
      </header>

      <div className={styles.testRunnerBody}>
        {history.map((line, index) => (
          <span key={index}>&gt; {line}</span>
        ))}

        <div className={styles.inputLine}>
          <span>&gt;</span>
          <input
            type="text"
            onChange={handleChange}
            onKeyDown={handleInput}
            value={currentLine}
          />
        </div>
      </div>
    </div>
  );
}
