import React, { Component } from "react";
import { translate } from "react-i18next";
import { bindActionCreators } from "redux";
import graphActions from "../actions/graphActions";
import connect from "react-redux/es/connect/connect";
import { Field, reduxForm } from "redux-form";
import Validations from "../components/Validations";
import moment from "moment";
import { Row, Col, Button, Form, FormGroup, Alert } from "reactstrap";
import { isLoggedIn, getLoggedInUser } from "../services/AuthenticationService";
import DatePicker from "react-datepicker";
import "./styles/graph.css";
import "react-datepicker/dist/react-datepicker.css";
import {
  Dropdown,
  Loading,
  DateTimeField,
  Vchart,
  VdateTimePicker
} from "../components";
import { Bubble } from "react-chartjs-2";

//import { Chart, Axis, Series, Tooltip, Cursor, Bubble } from "react-charts";
//import { Scatter, Bar } from "react-chartjs-2";

class OptionForm extends Component {
  constructor(props) {
    super(props);
    this.changeStartDate = this.changeStartDate.bind(this);
    this.changeEndDate = this.changeEndDate.bind(this);
    this.plot = this.plot.bind(this);
    this.state = {
      start: moment(),
      end: moment()
    };
    this.props.change("start", moment().format("Y-M-D"));
    this.props.change("end", moment().format("Y-M-D"));
  }

  changeStartDate(e, t) {
    this.setState({ start: e });
    this.props.change("start", e.format("Y-M-D"));
  }

  changeEndDate(e, t) {
    this.setState({ end: e });
    this.props.change("end", e.format("Y-M-D"));
  }

  plot() {
    this.props.submit();
  }

  render() {
    const {
      disabled,
      onChangeForm,
      factors,
      ListOfWhile,
      nutrients
    } = this.props;
    return (
      <Form onSubmit={this.props.handleSubmit}>
        <FormGroup>
          <Field
            name="user"
            className="chooseUser"
            component={Dropdown}
            onChange={e => onChangeForm(e)}
            options={this.props.users}
          />
        </FormGroup>
        <FormGroup>
          <Field
            name="symptom"
            className="chooseUser"
            component={Dropdown}
            options={this.props.symptoms}
            placeholder="Symptom"
            onChange={e => onChangeForm(e)}
            //validate={Validations.select_required}
          />
        </FormGroup>
        <FormGroup>
          <Row>
            <Col>
              <Field
                name="factor"
                //disabled={disabled.factor}
                className="chooseUser"
                component={Dropdown}
                options={factors}
                placeholder="Factor"
                onChange={e => {
                  var selectedItem = factors.find(element => {
                    return element.value == e.target.value;
                  });
                  selectedItem &&
                    this.props.onChangefactor(
                      e.target.value,
                      selectedItem.label,
                      this.props.selectedUser._id
                    );
                }}
                //validate={Validations.select_required}
              />
            </Col>

            <Col>
              <Field
                name="nutrients"
                disabled={disabled.nutrients}
                className="chooseUser"
                component={Dropdown}
                options={nutrients}
                placeholder="nutrients"
                onChange={e => onChangeForm(e)}
                validate={Validations.select_required}
              />
            </Col>
          </Row>
        </FormGroup>
        <FormGroup>
          <Row>
            <Col xs="6">
              {/* <Field
                name="start"
                disabled={disabled.start}
                component={DateTimeField}
                placeholder="Start"
                dateFormat="YYYY-MM-DD"
                className="form-control"
                //selected={this.state.start}
                popperPlacement="center"
                onChange={this.props.onDateChange}
                //validate={Validations.required}
                inputProps={{
                  className: "dateTimeInBlack form-control"
                }}
              /> */}
              <VdateTimePicker
                placeholder="start"
                value={this.props.optForm.start}
                onChange={this.props.onDateChange}
                dateFormat="DD MMM YYYY, hh:mm A"
                disabled={disabled.start}
                dark={true}
              />
            </Col>
            <Col xs="4">
              <Field
                name="end"
                className="chooseUser"
                component={Dropdown}
                options={ListOfWhile}
                placeholder="End"
                disabled={disabled.end}
                onChange={e => onChangeForm(e)}
              />
              {/* <Field
                name="end"
                disabled={disabled.end}
                component={DateTimeField}
                placeholder="End"
                dateFormat="YYYY-MM-DD"
                className="form-control"
                //minDate={this.state.start}
                //selected={this.state.end}
                popperPlacement="center"
                onSelect={this.changeEndDate}
                inputProps={{
                  className: "dateTimeInBlack form-control"
                }}
                //validate={Validations.required}
              /> */}
            </Col>
            <Col xs="2">
              <button
                type="button"
                className="btn btn-primary  btnWide editInputSearchBtn"
                //style={{ width: "100%" }}
                onClick={() => this.props.plot(this.props.optForm)}
                disabled={disabled.plotBtn}
              >
                <i style={{ fontSize: "20px" }} className="fa fa-chart-line" />
                {/* {this.props.t("stocks.plot")} */}
              </button>
            </Col>
          </Row>
        </FormGroup>
      </Form>
    );
  }
}

OptionForm = reduxForm({
  form: "formGraphOption",
  enableReinitialize: true
})(OptionForm);

OptionForm = connect(state => ({
  initialValues: state.graphManagement.OptionForm
}))(OptionForm);
class Graph extends Component {
  constructor(props) {
    super(props);
    this.yRightList = { data: [20, 40, 60, 80], min: 0, max: 100 };
  }
  componentWillUnmount() {
    this.props.resetPage();
  }
  componentDidMount() {
    if (!isLoggedIn()) {
      this.props.history.push("/");
      return;
    }
    var baseUser = localStorage.getItem("user");
    let user = JSON.parse(baseUser);
    this.props.graphInitialization(user._id);
  }

  render() {
    const {
      isLoading,
      t,
      disabled,
      onChangeForm,
      counterState,
      factors,
      ListOfWhile,
      selectedUser,
      nutrients,
      onDateChange,
      OptionForm: optForm,
      plot,
      graphSymptoms,
      graphFactors,
      chartPeriod,
      yLabels
    } = this.props;
    return (
      <div className="black-container analyzePage">
        <Loading isLoading={isLoading} />

        <div className="stock">
          <div className="formContainer">
            <OptionForm
              plot={plot}
              optForm={optForm}
              symptoms={this.props.symptoms}
              users={this.props.users}
              factors={factors}
              onSubmit={this.updateGraph}
              t={t}
              disabled={disabled}
              onChangeForm={onChangeForm}
              counterState={counterState}
              ListOfWhile={ListOfWhile}
              onChangefactor={this.props.onChangefactor}
              selectedUser={selectedUser}
              nutrients={nutrients}
              onDateChange={onDateChange}
            />
          </div>
          <div className="graphPageChartContainer">
            <Vchart
              data={graphSymptoms}
              secondData={graphFactors}
              xLabels={chartPeriod}
              yLabels={yLabels}
              yRightLabels={this.yRightList}
            />
          </div>
        </div>
      </div>
    );
  }
}

Graph = translate("translations")(Graph);

const mapStateToProps = state => ({
  ...state.graphManagement,
  formGraphOption: state.form.formGraphOption
});

const matchDispatchToProps = dispatch =>
  bindActionCreators({ ...graphActions }, dispatch);

export default connect(mapStateToProps, matchDispatchToProps)(Graph);
