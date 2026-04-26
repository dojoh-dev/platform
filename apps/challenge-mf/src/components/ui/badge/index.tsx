import styles from './index.module.css';

export default function Badge({
  label,
  colorPallete,
}: {
  label: string;
  colorPallete: string;
}) {
  return (
    <span
      style={{ '--color-pallete': colorPallete } as React.CSSProperties}
      className={styles.badge}
    >
      {label}
    </span>
  );
}
