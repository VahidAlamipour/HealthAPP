// import React from 'react';
// import { FormFeedback, Input } from 'reactstrap';

// const VInputText = ({
//    name,
//    val,
//    className,
//    label,
//    type,
//    placeholder,
//    required,
//    disabled,
//    readonly,
//    onChange,
//    onClick,
//    error
// }) => {
//    //let isError = touched && (typeof error !== 'undefined');
//    let requiredSpan = required && (<span className="required">*</span>);
//    let handleChange = (e) => {
//       if (readonly || onChange == undefined) { return; }
//       onChange(e);
//    };
//    let reset = ()=>{
//       this.selEle.value = null;
//    }

//    const selectClass = className + ' form-control' + (error ? ' is-invalid' : '');
//    return (
//       <div>
//          {label &&
//             <label>{label} {requiredSpan}</label>
//          }
//          <Input name={name} className={selectClass} type={type} placeholder={placeholder} disabled={disabled} 
//          readonly={readonly} onClick={onClick} autoComplete="off" onChange={handleChange}  ref={sel => this.selEle = sel}/>
//          {error && <FormFeedback>{error}</FormFeedback>}
//       </div>
//    );
// };
import React, { Component } from 'react';
import { FormFeedback, Input } from 'reactstrap';

class VInputText extends Component {
   constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
      this.reset = this.reset.bind(this);
      this.state = {val : ""}
   }
   requiredSpan = this.props.required && (<span className="required">*</span>);
   handleChange(e) {
      this.setState({val:e.target.val});
      if (this.props.readonly || this.props.onChange == undefined) { return; }
      this.props.onChange(e);
      
   };
   reset() {
      this.setState({val:""});
   }
   
   render() {
      var selectClass = this.props.className + ' form-control' + (this.props.error ? ' is-invalid' : '');
      var {name,label,type,placeholder,disabled,readonly,onClick,error} = this.props;
      var type = this.props.type ? this.props.type : "text";
      return (
         <div>
            {label &&
               <label>{label} {this.requiredSpan}</label>
            }
            <Input name={name} ref={sel => this.selEle = sel} value={this.state.val} className={selectClass} type={type} placeholder={placeholder} disabled={disabled}
               readonly={readonly} onClick={onClick} autoComplete="off" onChange={this.handleChange}  />
            {error && <FormFeedback>{error}</FormFeedback>}
         </div>
      );
   }

}

export default VInputText;
