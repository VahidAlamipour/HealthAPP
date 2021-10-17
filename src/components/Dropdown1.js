import React from 'react';
import { FormFeedback } from 'reactstrap';

const Dropdown1Field = ({
  input,
  label,
  className,
  options,
  placeholder,
  required,
  readonly,
  onChange,
    onClick,
  meta: { touched, error }
}) => {
  let isError = touched && (typeof error !== 'undefined');

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
        onChange={handleChange} onClick={onClick} readonly={readonly}>
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

export default Dropdown1Field;