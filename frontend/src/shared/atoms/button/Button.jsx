import "./Button.css";

export function Button({
	children,
	type = "button",
	variant = "primary",
	size = "md",
	fullWidth = false,
	className = "",
	...props
}) {
	const classes = [
		"btn",
		`btn--${variant}`,
		`btn--${size}`,
		fullWidth ? "btn--full" : "",
		className,
	]
		.filter(Boolean)
		.join(" ");

	return (
		<button type={type} className={classes} {...props}>
			{children}
		</button>
	);
}

export default Button;
