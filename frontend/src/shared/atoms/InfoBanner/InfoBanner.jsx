import "./InfoBanner.css";

export function InfoBanner({ text, icon: Icon, iconColor }) {
  return (
    <div className="info-banner">
      {Icon && <Icon size={16} color={iconColor} className="info-banner__icon" />}
      <p className="info-banner__text">{text}</p>
    </div>
  );
}