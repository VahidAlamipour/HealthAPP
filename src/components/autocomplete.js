import React from 'react';
import { FormFeedback } from 'reactstrap';
import {AutoComplete} from "redux-form-material-ui";


const DropdownField = ({
  input,
  label,
  className,
  options,
  placeholder,
  required,
  readonly, disabled,
  onChange,
  onClick,
  meta: { touched, error }
}) => {
  //let isError = touched && (typeof error !== 'undefined');
  let isError = typeof error !== 'undefined';
  let handleChange = (e) => {
    if (readonly) { return; }
    input.onChange(e);
  };
  
  let requiredSpan = required && (<span className="required">*</span>);
  const selectClass = className + ' form-control' + (isError ? ' is-invalid' : '');

  return (
    <div>
      {label &&
        <label>{label} {requiredSpan}</label>
      }
      <select name={input.name} className={selectClass} value={input.value}
        onChange={handleChange} onClick={onClick} readOnly={readonly} disabled={disabled}>
        <option value="null">{placeholder}</option>
        {
          options &&
          options.map((option, i) => {
            if (typeof option.optGroup !== 'undefined') {
              return (<optgroup key={i} label={option.optGroup} />);
            }

            return (<option key={i} value={option.value}>{option.label}</option>);
          })
        }
      </select>
      { isError && <FormFeedback>{error}</FormFeedback> }
    </div>
  )
};

export default DropdownField;