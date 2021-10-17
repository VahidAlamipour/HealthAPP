// import React from 'react';
// import { FormFeedback } from 'reactstrap';

// const VDropdownField = ({
//    name,
//    val,
//    label,
//    className,
//    options,
//    placeholder,
//    required,
//    readonly, disabled,
//    onChange,
//    onClick,
//    error
// }) => {
//    let handleChange = (e) => {
//       if (readonly || onChange == undefined) { return; }
//       onChange(e);
//    };

//    let requiredSpan = required && (<span className="required">*</span>);
//    const selectClass = className + ' form-control' + (error ? ' is-invalid' : '');

//    return (
//    <div>
//       {label &&
//          <label>{label} {requiredSpan}</label>
//       }
//       <select name={name} className={selectClass} value={val}
//          onChange={handleChange} onClick={onClick} readOnly={readonly} disabled={disabled}>
//          <option value="null">{placeholder}</option>
//          {
//             options &&
//             options.map((option, i) => {
//                if (typeof option.optGroup !== 'undefined') {
//                   return (<optgroup key={i} label={option.optGroup} />);
//                }

//                return (<option key={i} value={option.value}>{option.label}</option>);
//             })
//          }
//       </select>
//       {error && <FormFeedback>{error}</FormFeedback>}
//    </div>
//   )
// };

import React, { Component } from 'react';
import { FormFeedback } from 'reactstrap';

class VDropdownField extends Component {
   constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
      this.handleBlur = this.handleBlur.bind(this);
      this.reset = this.reset.bind(this);
   }
   handleChange(e) {
      if (this.props.readonly || this.props.onChange == undefined || this.props.onBlur == false) { return; }
      this.props.onChange(e);
   };
   handleBlur(e){
      if (this.props.onBlur == undefined || this.props.onBlur == false) { return; }
      this.props.onBlur(e);
   }
   requiredSpan = this.props.required && (<span className="required">*</span>);
   
   reset(){
      this.selEle.value = null;
   }
   render() {
      var selectClass = this.props.className + ' form-control' + (this.props.error ? ' is-invalid' : '');
      var { label, name, val, onClick, readonly, disabled, placeholder, options, error } = this.props;
      return (
         <div>
            {label &&
               <label>{label} {this.requiredSpan}</label>
            }
            <select name={name} className={selectClass} value={val} ref={sel => this.selEle = sel} 
               onChange={this.handleChange} onClick={onClick} readOnly={readonly} disabled={disabled}
               onBlur={this.handleBlur}>
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
            {error && <FormFeedback>{error}</FormFeedback>}
         </div>
      )
   }

}




export default VDropdownField;