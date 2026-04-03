import { Lock } from "lucide-react";
import "./PrivateBadge.css";

export function PrivateBadge({ label = "Privado" }) {
  return (
    <span className="private-badge">
      <Lock size={10} />
      {label}
    </span>
  );
}