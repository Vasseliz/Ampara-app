import "./Toggle.css";

const Toggle = ({ checked, onChange}) => {
  return (
    <div className="checkbox-wrapper">
      <div className="check">
        <input type="checkbox" id="check-toggle" checked={checked} onChange={onChange} />
        <label className="toggle" htmlFor="check-toggle">
          <span className="toggle__slider" />
        </label>
      </div>
    </div>
  );
};

export { Toggle };
