import { Heart } from "lucide-react";
import "./PageHeader.css";

export function PageHeader({
  title,
  iconTitle: IconTitle,
  subtitle,
  icon: Icon = Heart,
  comment,
  handleIcon,
}) {
  return (
    <header className="page-header">
      <div className="page-header__side">
        <div className="page-header__icon-wrap">
          <Icon
            className="page-header__icon page-header__icon--side"
            size={25}
            onClick={handleIcon}
            style={{ cursor: "pointer" }}
          />
        </div>
      </div>

      <div className="page-header__center">
        <h1 className="page-header__title">
          {IconTitle && (
            <IconTitle className="page-header__title-icon" size={20} />
          )}
          {title}
        </h1>
        {subtitle && <span className="page-header__subtitle">{subtitle}</span>}
      </div>

      {comment ? (
        <div className="page-header__status">
          <span>{comment}</span>
        </div>
      ) : (
        <div className="page-header__side" />
      )}
    </header>
  );
}
