import React, { useEffect } from 'react';
import $$ from '@repo/shared/double-dollar';
import styles from './index.module.css';

const MIN_WIDTH = window.innerWidth * 0.25; // 25% of the viewport width
const MIN_HEIGHT = 200;

export default function Grid({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const gutterY = $$<HTMLElement>('#gutterY');
    const gutterX = $$<HTMLElement>('#gutterX');
    const grid = $$<HTMLElement>('#grid');

    const savedRows = localStorage.getItem('grid-template-rows');
    const savedColumns = localStorage.getItem('grid-template-columns');

    if (savedRows) grid.style.gridTemplateRows = savedRows;
    if (savedColumns) grid.style.gridTemplateColumns = savedColumns;

    const dragging = { x: false, y: false };
    const startMouse = { x: 0, y: 0 };
    const offset = { x: 0, y: 0 };

    const getGridMetrics = () => {
      const rect = grid.getBoundingClientRect();
      const computed = getComputedStyle(grid);

      const paddingTop = parseFloat(computed.paddingTop);
      const paddingLeft = parseFloat(computed.paddingLeft);
      const rowGap = parseFloat(computed.rowGap);
      const columnGap = parseFloat(computed.columnGap);

      return {
        rect,
        paddingTop,
        paddingLeft,
        rowGap,
        columnGap,
      };
    };

    gutterY.addEventListener('mousedown', (event) => {
      event.preventDefault();

      dragging.y = true;
      document.body.style.userSelect = 'none';

      const { rect, paddingTop, columnGap } = getGridMetrics();
      const gutterRect = gutterY.getBoundingClientRect();

      startMouse.y = event.clientY;
      offset.y = gutterRect.top - (rect.top + paddingTop + columnGap);
    });

    gutterX.addEventListener('mousedown', (event) => {
      event.preventDefault();

      dragging.x = true;
      document.body.style.userSelect = 'none';

      const { rect, paddingLeft, rowGap } = getGridMetrics();
      const gutterRect = gutterX.getBoundingClientRect();

      startMouse.x = event.clientX;
      offset.x = gutterRect.left - (rect.left + paddingLeft + rowGap);
    });

    document.addEventListener('mouseup', () => {
      dragging.y = false;
      dragging.x = false;
      document.body.style.userSelect = '';
    });

    document.addEventListener('mousemove', (event) => {
      if (!dragging.x && !dragging.y) return;

      if (dragging.y) {
        const deltaY = event.clientY - startMouse.y;
        const offsetY = Math.round(offset.y + deltaY);

        const gridTemplateRows = `minmax(${MIN_HEIGHT}px, ${offsetY}px) 4px minmax(${MIN_HEIGHT}px, 1fr)`;
        grid.style.gridTemplateRows = gridTemplateRows;
        localStorage.setItem('grid-template-rows', gridTemplateRows);
      }

      if (dragging.x) {
        const deltaX = event.clientX - startMouse.x;
        const offsetX = Math.round(offset.x + deltaX);

        const gridTemplateColumns = `minmax(${MIN_WIDTH}px, ${offsetX}px) 4px minmax(${MIN_WIDTH}px, 1fr)`;
        grid.style.gridTemplateColumns = gridTemplateColumns;
        localStorage.setItem('grid-template-columns', gridTemplateColumns);
      }
    });
  }, []);

  return (
    <div id="grid" className={styles.grid}>
      {children}
      <span
        id="gutterY"
        className={styles.gutter}
        style={{ gridArea: 'gutter-y', cursor: 'row-resize' }}
      />
      <span
        id="gutterX"
        className={styles.gutter}
        style={{ gridArea: 'gutter-x', cursor: 'col-resize' }}
      />
    </div>
  );
}
