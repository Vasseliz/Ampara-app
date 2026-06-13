import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import "./Select.css";

export function Select({ value, onChange, options = [], placeholder }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selectedOption = options.find((o) => String(o.value) === String(value));
  const displayLabel = selectedOption?.label ?? placeholder ?? options[0]?.label ?? "";
  const isPlaceholder = !selectedOption || (selectedOption && selectedOption.value === "" && !value);

  useEffect(() => {
    if (!open) return;
    function handleOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  function handleSelect(optValue) {
    onChange(optValue);
    setOpen(false);
  }

  return (
    <div ref={ref} className="select">
      <button
        type="button"
        className={`select__trigger${open ? " select__trigger--open" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={isPlaceholder ? "select__trigger-placeholder" : "select__trigger-value"}>
          {displayLabel}
        </span>
        <ChevronDown
          size={16}
          className={`select__chevron${open ? " select__chevron--open" : ""}`}
        />
      </button>

      {open && (
        <ul className="select__list" role="listbox">
          {options.map((opt) => {
            const isActive = String(opt.value) === String(value);
            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isActive}
                className={`select__option${isActive ? " select__option--active" : ""}`}
                onClick={() => handleSelect(opt.value)}
              >
                <span>{opt.label}</span>
                {isActive && opt.value !== "" && (
                  <Check size={14} className="select__check" />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}