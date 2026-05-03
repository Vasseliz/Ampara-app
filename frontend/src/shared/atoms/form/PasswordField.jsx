import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

export function PasswordField({
    id,
    label,
    value,
    onChange,
    placeholder,
    autoComplete,
    required = false,
    error,
    inputClassName = "",
    wrapperClassName = "",
}) {
    const [visible, setVisible] = useState(false);
    const inputClasses = [
        "auth__form-field__input",
        "auth__form-field__input--with-eye",
        error ? "auth__form-field__input--error" : "",
        inputClassName,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div className={`auth__form-field ${wrapperClassName}`.trim()}>
            <label htmlFor={id}>{label}</label>
            <div className="auth__form-field__input-wrap">
                <span className="auth__form-field__icon"><Lock size={16} /></span>
                <input
                    id={id}
                    type={visible ? "text" : "password"}
                    className={inputClasses}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    autoComplete={autoComplete}
                    required={required}
                />
                <button type="button" className="auth__form-field__eye" onClick={() => setVisible((v) => !v)}>
                    {visible ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
            </div>
            {error ? <span className="auth__form-field__error">{error}</span> : null}
        </div>
    );
}
