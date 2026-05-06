import "./Tag.css";

export function Tag({ label, variant = "default" }) {
  return (
    <span className={`tag tag--${variant}`}>
      {label}
    </span>
  );
}