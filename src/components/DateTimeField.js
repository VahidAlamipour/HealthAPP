import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import moment from "moment";
import DateTime from "react-datetime";

const DateTimeField = ({
  tooltip,
  tooltipPlacement,
  disabled,
  input,
  label,
  inputProps,
  placeholder,
  timeFormat,
  closeOnSelect,
  endDate,
  meta: { valid, touched, error },
  ...props
}) => {
  const classes = classNames("form-group dateTimeField", {
    "has-error": touched && !valid,
    "has-success": touched && valid
  });
  var showProps = {
    placeholder: placeholder,
    readonly: "readonly"
  };
  if (inputProps) {
    showProps = { ...showProps, ...inputProps };
  }
  if (disabled) {
    showProps.disabled = "disabled";
  }
  return (
    <div className={classes}>
      {label && <label htmlFor={input.name}>{label}</label>}
      <DateTime
        name={input.name}
        value={input.value}
        inputProps={showProps}
        //placeholder={input.placeholder}
        locale="en"
        dateFormat="DD MMM YYYY,"
        timeFormat={timeFormat != undefined && !timeFormat ? false : "hh:mm A"}
        onChange={param => {
          input.onChange && input.onChange(param);
        }}
        onBlur={param => {
          input.onBlur && input.onBlur(param);
        }}
        //disabled={disabled}
        closeOnSelect={closeOnSelect}
      />
      {!valid && touched && <p className="help-block">{error}</p>}
    </div>
  );
};

DateTimeField.propTypes = {
  disabled: PropTypes.bool,
  input: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  meta: PropTypes.object.isRequired,
  placeholder: PropTypes.string,
  tooltip: PropTypes.string,
  tooltipPlacement: PropTypes.string
};
export default DateTimeField;
