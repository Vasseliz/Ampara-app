import "./RangeSlider.css";

const RangeSlider = ({ min = 0, max = 100, value, onChange, ...props }) => {
  return (
    <input
      type="range"
      className="range-slider"
      min={min}
      max={max}
      value={value}
      onChange={onChange}
      {...props}
    />
  );
};

export { RangeSlider };
