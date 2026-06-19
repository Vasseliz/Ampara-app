import { Select } from "../../atoms/select/Select";

export function DateFilter({ value, onChange, options, dataCy }) {
  return (
    <div className="date-filter">
      <Select
        value={value}
        onChange={onChange}
        options={options}
        dataCy={dataCy}
      />
    </div>
  );
}