import React, { Component } from "react";
import { Input } from "reactstrap";
class Valert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      valertSectionDisplay: props.display
    };
    this.changeStatus = this.changeStatus.bind(this);
    this.clickPositive = this.clickPositive.bind(this);
    this.clickNegative = this.clickNegative.bind(this);
    this.clickThirdAction = this.clickThirdAction.bind(this);

    this.getInputValue = this.getInputValue.bind(this);
  }
  componentDidUpdate(prevProp) {
    if (prevProp.display != this.props.display) {
      this.setState({
        valertSectionDisplay: this.props.display
      });
    }
  }
  componentDidMount() {
    this.props.onRef && this.props.onRef(this);
  }
  componentWillReceiveProps(newProps) {
    this.setState({ inputValue: newProps.inputValue });
  }
  changeStatus() {
    this.setState({
      valertSectionDisplay: !this.state.valertSectionDisplay,
      inputValue: this.props.inputValue
    });
  }
  async clickPositive() {
    this.props.positiveAction && (await this.props.positiveAction());
    !this.props.disableAutoClose && this.changeStatus();
  }
  async clickNegative() {
    this.props.negativeAction && (await this.props.negativeAction());
    !this.props.disableAutoClose && this.changeStatus();
  }
  async clickThirdAction() {
    this.props.ThirdAction && (await this.props.ThirdAction());
    !this.props.disableAutoClose && this.changeStatus();
  }
  getInputValue() {
    return this.state.inputValue;
  }

  render() {
    const { question } = this.props;
    var valertSectionDisplay = "none";
    if (this.state.valertSectionDisplay) {
      valertSectionDisplay = "flex";
    } else {
      valertSectionDisplay = "none";
    }
    return (
      <section
        className="valertSection"
        style={{ display: valertSectionDisplay }}
      >
        <div className="valertContianer">
          {this.props.title && <h4>{this.props.title}</h4>}
          <p>{question}</p>
          {this.props.inputField && (
            <div className="inputContainer">
              <Input
                type="text"
                autoComplete={false}
                value={this.state.inputValue}
                onChange={e => this.setState({ inputValue: e.target.value })}
              />
            </div>
          )}
          <div className="ButtonsContainer">
            <button
              type="button"
              className="btn btn-primary"
              onClick={this.clickPositive}
            >
              {this.props.positiveText ? this.props.positiveText : "Yes"}
            </button>
            {!this.props.readonly && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.clickNegative}
              >
                {this.props.negativeText ? this.props.negativeText : "Cancel"}
              </button>
            )}
            {this.props.thirdActionText && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.clickThirdAction}
              >
                {this.props.thirdActionText}
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }
}
export default Valert;
