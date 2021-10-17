import React, { Component } from "react";
import { FormFeedback, Input } from "reactstrap";

class InputAmount extends Component {
  constructor() {
    super();
    this.state = {
      val: "",
      reseter: null
    };
    this.sizeOnChange = this.sizeOnChange.bind(this);
  }
  componentDidMount() {
    this.props.onRef(this);
    if (this.props.amounNewValue) {
      this.setState({ val: this.props.amounNewValue });
    }
  }
  valueChenger(val) {
    this.setState({ val: val });
  }
  getValue() {
    return this.state.val;
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.reseter != this.state.reseter) {
      this.valueChenger(nextProps.amounNewValue);
      this.setState({ reseter: nextProps.reseter });
    }
  }
  sizeOnChange(evt) {
    const financialGoal = evt.target.validity.valid
      ? evt.target.value
      : this.state.val;
    this.setState({ val: financialGoal });
  }
  render() {
    var dis = this.props.disabled ? "disabled" : "";
    return (
      <Input
        autoComplete="off"
        {...this.props.input}
        placeholder={this.props.placeholder}
        onInput={this.sizeOnChange}
        value={this.state.val}
        className={this.props.className}
        //pattern="[0-9./]*"
        pattern={this.props.pattern}
        disabled={dis}
        onKeyUp={this.props.onKeyUp}
      />
    );
  }
}
export default InputAmount;
