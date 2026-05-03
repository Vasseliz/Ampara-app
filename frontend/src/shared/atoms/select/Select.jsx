import { ChevronDown } from "lucide-react";
import "./Select.css";

export function Select({ value, onChange, options }) {
  return (
    <div className="select">
      <select
        className="select__field"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <ChevronDown className="select__icon" size={16} />
    </div>
  );
}