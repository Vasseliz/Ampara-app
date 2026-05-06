import "./SectionHeading.css";

export function SectionHeading({ title }) {
  return (
    <div className="section-heading">
      <div className="section-heading__border" />
      <h2 className="section-heading__title">{title}</h2>
    </div>
  );
}