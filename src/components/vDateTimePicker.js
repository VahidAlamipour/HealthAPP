import React from "react";
import DatePicker from "react-datepicker";
//import "./styles/vDateTimePicker.css";
import { Input } from "reactstrap";
import { Vmodal } from "../components";
import moment from "moment";

class vDateTimePicker extends React.Component {
  constructor(props) {
    super(props);
    let startDate = moment();
    this.state = {
      modalStatus: false,
      selectedDate: startDate,
      hour: startDate.hour() > 12 ? startDate.hour() - 12 : startDate.hour(),
      pmAm: startDate.hour() >= 12 ? "PM" : "AM"
    };
    this.hours = [];
    for (let i = 1; i <= 12; i++) {
      this.hours.push(i);
    }
    this.mins = [];
    for (let it = 0; it < 60; it++) {
      this.mins.push(it);
    }
    this.changeDateTime = this.changeDateTime.bind(this);
    this.setHours = this.setHours.bind(this);
  }
  componentWillReceiveProps(newProp) {
    let propDate = newProp.value;
    if (!propDate) {
      propDate = moment();
    }
    this.setState({ selectedDate: propDate });
  }
  changeDateTime() {
    this.props.onChange(this.state.selectedDate);
    this.setState({ modalStatus: false });
  }
  async setHours(e) {
    var setObj = {};
    setObj[e.target.name] = e.target.value;
    await this.setState(setObj);
    let hour = this.state.hour;
    if (this.state.pmAm == "PM" && hour != 12) {
      hour = parseInt(hour) + 12;
    } else if (this.state.pmAm == "AM" && hour == 12) {
      hour = 0;
    }
    this.setState({ selectedDate: this.state.selectedDate.hour(hour) });
  }

  render() {
    const {
      input,
      placeholder,
      disabled,
      value,
      dateFormat,
      timeDisable,
      dark
    } = this.props;
    let format = "DD MMM YYYY, hh:mm A";
    if (dateFormat) {
      format = dateFormat;
    }
    let showVal = "";
    if (value) {
      showVal = value.format(format);
    }
    let hour24 = this.state.selectedDate.hour();
    let hour = hour24;
    let pmAm = "AM";
    if (hour24 >= 12) {
      pmAm = "PM";
    }
    if (hour24 > 12) {
      hour = hour24 - 12;
    }
    if (hour == 0) {
      hour = 12;
    }
    return (
      <div className="vDateTimeArea">
        <Vmodal
          displayStatus={this.state.modalStatus}
          data={
            <div className="TimeSelectionVdateTime">
              <h3>{this.state.selectedDate.format(format)}</h3>
              <div className="d-flex justify-content-center">
                <DatePicker
                  selected={this.state.selectedDate}
                  onChange={date => {
                    date.hour(this.state.selectedDate.hour());
                    date.minute(this.state.selectedDate.minute());
                    this.setState({ selectedDate: moment(date) });
                  }}
                  onYearChange={date => {
                    date.hour(this.state.selectedDate.hour());
                    date.minute(this.state.selectedDate.minute());
                    this.setState({ selectedDate: moment(date) });
                  }}
                  showYearDropdown
                  yearDropdownItemNumber={15}
                  scrollableYearDropdown
                  inline
                />
              </div>
              {!timeDisable && (
                <div className="d-flex justify-content-center margin-top-10">
                  <select value={hour} name="hour" onChange={this.setHours}>
                    {this.hours.map(item => {
                      return <option>{item}</option>;
                    })}
                  </select>
                  <select
                    value={this.state.selectedDate.minute()}
                    onChange={min => {
                      this.setState({
                        selectedDate: this.state.selectedDate.minute(
                          min.target.value
                        )
                      });
                    }}
                  >
                    {this.mins.map(i => {
                      return <option>{i}</option>;
                    })}
                  </select>
                  <select value={pmAm} name="pmAm" onChange={this.setHours}>
                    <option>AM</option>
                    <option>PM</option>
                  </select>
                </div>
              )}
              <div className="d-flex justify-content-end margin-top-10">
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ padding: "7px 25px" }}
                  onClick={this.changeDateTime}
                >
                  Ok
                </button>
              </div>
            </div>
          }
          closeFunc={() => {
            this.setState({ modalStatus: false });
          }}
        />
        <Input
          placeholder={placeholder}
          disabled={disabled}
          readonly="readonly"
          onClick={() => {
            this.setState({ modalStatus: true });
          }}
          autoComplete="off"
          value={showVal}
          className={`${dark ? "chooseUser" : ""}`}
        />
        <i
          className={`${
            disabled ? "fa fa-calendar-alt disable" : "fa fa-calendar-alt"
          } ${dark ? "iChooseUser" : ""}`}
        />
      </div>
    );
  }
}
export default vDateTimePicker;
