import React from 'react';
import { FormFeedback } from 'reactstrap';

import './styles/checkbox.css';


const CheckBox = ({
  input,
  label,
  meta: { touched, error }
}) => {
  let isError = touched && (typeof error !== 'undefined');

  // Fix for warning when input value is none
  input.value = input.value || false;

  const checkBoxClass = 'form-control' + (isError ? ' is-invalid' : '');

  const inputStyle = {
    width: 'auto',
    display: 'inline',
    postition: 'static',
    marginRight: '0.5rem',
    marginTop: '0.3rem'
  };

  const labelStyle = {
    display: 'inline',
    textAlign: 'justify'
  };

  return (
    <div>
      <label /*style={labelStyle}*/ className="component-container">
        {label}
        <input
            {...input} 
            style={inputStyle} 
            type="checkbox" 
            /*className={checkBoxClass}*/ 
         />
         <span className="component-checkmark" />
      </label>
      { isError && <FormFeedback>{error}</FormFeedback> }
    </div>
  );
};

export default CheckBox;
