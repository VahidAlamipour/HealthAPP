import React from "react";
import { FormFeedback } from "reactstrap";

const DropdownField = ({
  input,
  label,
  className,
  options,
  placeholder,
  required,
  readonly,
  disabled,
  onChange,
  onClick,
  val,
  meta: { touched, error }
}) => {
  let isError = touched && typeof error !== "undefined";
  let handleChange = e => {
    if (readonly) {
      return;
    }
    input.onChange(e);
  };

  let requiredSpan = required && <span className="required">*</span>;
  const selectClass =
    className + " form-control" + (isError ? " is-invalid" : "");
  const disStatus = disabled ? "disabled" : "";
  var finalVal = val == undefined ? input.value : val;
  return (
    <div>
      {label && (
        <label>
          {label} {requiredSpan}
        </label>
      )}
      <select
        name={input.name}
        className={selectClass}
        value={finalVal}
        onChange={handleChange}
        onClick={onClick}
        readOnly={readonly}
        disabled={disStatus}
      >
        {placeholder && <option value="null">{placeholder}</option>}
        {options &&
          options.map((option, i) => {
            if (typeof option.optGroup !== "undefined") {
              return <optgroup key={i} label={option.optGroup} />;
            }
            return (
              <option key={i} value={option.value}>
                {option.label}
              </option>
            );
          })}
      </select>
      {isError && <FormFeedback>{error}</FormFeedback>}
    </div>
  );
};

export default DropdownField;
