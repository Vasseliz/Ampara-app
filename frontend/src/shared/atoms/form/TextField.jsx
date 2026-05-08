export function TextField({
    id,
    label,
    icon: Icon,
    optionalLabel,
    error,
    inputClassName = "",
    wrapperClassName = "",
    ...inputProps
}) {
    const inputClasses = ["auth__form-field__input", inputClassName].filter(Boolean).join(" ");

    return (
        <div className={`auth__form-field ${wrapperClassName}`.trim()}>
            <label htmlFor={id}>
                {label}
                {optionalLabel ? <span className="auth__form-field__optional"> {optionalLabel}</span> : null}
            </label>
            <div className="auth__form-field__input-wrap">
                {Icon ? <span className="auth__form-field__icon"><Icon size={16} /></span> : null}
                <input id={id} className={inputClasses} {...inputProps} />
            </div>
            {error ? <span className="auth__form-field__error">{error}</span> : null}
        </div>
    );
}
