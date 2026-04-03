import { Link } from "react-router-dom";
import { Tag } from "../../atoms/tag/Tag";
import "./NavigationCard.css";

export function NavigationCard({ to, icon: Icon, tag, tagVariant, title, description }) {
  return (
    <Link to={to} className="nav-card">
      {(Icon || tag) && (
        <div className="nav-card__top">
          {Icon && (
            <div className="nav-card__icon-wrap">
              <Icon className="nav-card__icon" />
            </div>
          )}
          {tag && <Tag label={tag} variant={tagVariant} />}
        </div>
      )}
      {title && <p className="nav-card__title">{title}</p>}
      {description && <p className="nav-card__desc">{description}</p>}
    </Link>
  );
}