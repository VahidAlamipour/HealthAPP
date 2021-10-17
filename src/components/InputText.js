import React from "react";
import { FormFeedback, Input } from "reactstrap";

const InputText = ({
  input,
  label,
  type,
  className,
  placeholder,
  required,
  disabled,
  readonly,
  onClick,
  onKeyPress,
  meta: { touched, error }
}) => {
  let isError = touched && typeof error !== "undefined";
  let requiredSpan = required && <span className="required">*</span>;
  if (readonly) {
    input.onChange = null;
  }
  const selectClass = className + " form-control";

  return (
    <div>
      {label && (
        <label>
          {label} {requiredSpan}
        </label>
      )}
      <Input
        {...input}
        type={type}
        className={selectClass}
        placeholder={placeholder}
        invalid={isError}
        disabled={disabled}
        readonly={readonly}
        onClick={onClick}
        autoComplete="off"
        onKeyPress={onKeyPress}
      />
      {isError && <FormFeedback>{error}</FormFeedback>}
    </div>
  );
};

export default InputText;
