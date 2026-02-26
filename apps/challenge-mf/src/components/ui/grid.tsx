import React, { useEffect } from 'react';
import $$ from '@repo/shared/double-dollar';

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
    <>
      <div id="grid">
        {children}
        <div id="gutterY" className="gutter gutter-y" />
        <div id="gutterX" className="gutter gutter-x" />
      </div>
      <style jsx>{`
        #grid {
          display: grid;
          grid-template:
            'summary gutter-x code'
            'summary gutter-x gutter-y'
            'summary gutter-x test-runner';
          grid-template-columns: 1fr 4px 1fr;
          grid-template-rows: 1fr 4px 250px;
          height: 100%;
          padding: 10px;
          gap: 4px;
        }

        #gutterX {
          grid-area: gutter-x;
          cursor: col-resize;
        }

        #gutterY {
          grid-area: gutter-y;
          cursor: row-resize;
        }

        .gutter {
          user-select: none;
          transition:
            background-color 150ms ease,
            box-shadow 150ms ease;
          transition-delay: 300ms;
          opacity: 0.85;
        }

        .gutter:hover {
          background-color: var(--primary-color);
        }
      `}</style>
    </>
  );
}
