import { memo } from 'react';

interface GridBackground8ColProps {
  className?: string;
  lineColor?: string;
}

/**
 * 8-box-per-row background grid with light greyish lines
 * Renders exactly 8 columns across the width with matching row heights
 * to form a clean technical grid of 8 boxes per row.
 */
function GridBackground8Col({
  className = '',
  lineColor = 'rgba(228, 228, 231, 0.08)' // light greyish color
}: GridBackground8ColProps) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none select-none overflow-hidden z-0 ${className}`}
      aria-hidden="true"
    >
      {/* 8 explicit column dividers */}
      <div className="w-full h-full grid grid-cols-8 absolute inset-0">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-full relative"
            style={{
              borderRight: `1px solid ${lineColor}`,
              borderLeft: i === 0 ? `1px solid ${lineColor}` : undefined,
            }}
          />
        ))}
      </div>

      {/* Repeating horizontal lines spaced at 12.5vw to form exact square boxes (8 per row) */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `linear-gradient(to bottom, ${lineColor} 1px, transparent 1px)`,
          backgroundSize: '100% 12.5vw',
        }}
      />
    </div>
  );
}

export default memo(GridBackground8Col);
