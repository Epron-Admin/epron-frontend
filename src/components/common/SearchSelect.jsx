import React from "react";
import "./searchSelect.css";
import Select from "react-select";

function SearchSelect({
  name,
  selectData,
  value,
  onChange,
  isDisabled,
  defaultValue,
  hasLabel,
  hasError,
  placeholder,
  noError
}) {
  return (
    <div className="relative">
      {hasLabel && <label className="filter-label text-xs">{name}</label>}
      <Select
        className={hasError ? "border-2 border-red-500 rounded-md" : null}
        classNamePrefix="select"
        defaultValue={defaultValue}
        isDisabled={isDisabled}
        isLoading={false}
        isClearable={true}
        isRtl={false}
        isSearchable={true}
        name={name}
        options={selectData}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      {noError ? null : (
        <p className="text-red-500 text-xs error-text h-8">
          {hasError ? "This field is required" : null}
        </p>
      )}
    </div>
  );
}

export default SearchSelect;
