export default function Badge({
  label,
  colorPallete,
}: {
  label: string;
  colorPallete: string;
}) {
  return (
    <>
      <span className="badge">{label}</span>
      <style jsx>{`
        .badge {
          --color-pallete: ${colorPallete};
          display: inline-block;
          padding: 2px 8px;
          font-size: var(--font-xs);
          font-weight: 600;
          color: var(--color-pallete);
          border: 1px solid
            color-mix(in srgb, var(--color-pallete) 12.5%, transparent);
          background-color: color-mix(
            in srgb,
            var(--color-pallete) 12.5%,
            transparent
          );
          border-radius: var(--radii);
          font-family: var(--font-sans);
          user-select: none;
          cursor: default;
          transition: transform 100ms ease;
        }

        .badge:hover {
          transform: scale(0.98);
        }
      `}</style>
    </>
  );
}
