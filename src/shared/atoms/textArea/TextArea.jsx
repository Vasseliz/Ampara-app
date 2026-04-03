import "./TextArea.css";

export default function Textarea({
  value,
  onChange,
  placeholder,
  maxLength,
  showCounter = true,
  required = false,
  counterClassName = "",
}) {
  const length = value?.length || 0;
  const hasLimit = typeof maxLength === "number";
  const counterClasses = ["textarea__counter", counterClassName].filter(Boolean).join(" ");

  return (
    <div className="textarea">
      <textarea
        className="textarea__control form-field__textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        required={required}
      />

      {showCounter && (
        <span className={counterClasses}>
          {hasLimit ? `${length} / ${maxLength}` : `${length}`} caracteres
        </span>
      )}
    </div>
  );
}