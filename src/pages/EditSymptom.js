import React, { Component } from "react";
import { getLoggedInUser } from "../services/AuthenticationService";
import "./styles/symptoms.css";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import { Field, reduxForm, submit } from "redux-form";
import {
  InputText,
  Dropdown,
  Loading,
  Dropdown1,
  InputAmount,
  Valert,
  VautoComplete,
  VdateTimePicker
} from "../components";
import editSymptomActions from "../actions/editSymptomActions";
import { Row, Col, Form, FormGroup } from "reactstrap";
//import Validations from "../components/Validations";
//import { AutoComplete } from "redux-form-material-ui";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
//import DateTime from "react-datetime";
import moment from "moment";
//import { Prompt } from "react-router";

//import "react-datepicker/dist/react-datepicker.css";
//import { DatetimePickerTrigger } from "rc-datetime-picker";
//import "rc-datetime-picker/dist/picker.min.css";
import "react-datetime/css/react-datetime.css";
//import filterFrames from "material-ui/svg-icons/image/filter-frames";

class SearchSymptomForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      from: "",
      to: "",
      searchBtn: true
    };
    //this.onDateChange = this.onDateChange.bind(this);
  }
  componentWillReceiveProps(nextpro) {
    this.setState({ searchBtn: nextpro.disabled.searchBtn });
  }
  onDateRangeChange(val, type) {
    setTimeout(() => {
      this.props.submit();
    }, 10);
  }
  // onDateChange(val) {
  //   val = moment(val);
  //   val = val.format("DD/MM/YYYY hh:mm A");
  //   this.props.onDateChangeSearch(val);
  // }

  render() {
    const { disabled, categories, ListOfWhile } = this.props;
    return (
      <Form onSubmit={this.props.handleSubmit}>
        <FormGroup row>
          <Col>
            <Field
              name="user"
              component={Dropdown1}
              options={this.props.users}
              placeholder="Users"
              onChange={e => this.props.onChangeSearchForm(e)}
            />
          </Col>
          <Col>
            <Field
              name="category"
              component={Dropdown}
              options={categories}
              placeholder={this.props.t("symptoms.CATEGORY_TEXT")}
              onChange={this.props.categorySelected}
              //validate={Validations.select_required}
              //val={category}
            />
          </Col>
        </FormGroup>
        <FormGroup></FormGroup>
        <FormGroup row>
          <Col xs="6">
            {/* <label className="d-block popper-left">
              <Field
                name="start"
                placeholder={this.props.t("symptoms.FROM_DATE_TEXT")}
                component={DateTimeField}
                disabled={this.props.disabled.start}
                onChange={param => this.onDateChange(param)}
              />

              <span>
                <i className="fa fa-calendar-alt"></i>
              </span>
            </label> */}
            <VdateTimePicker
              name="start"
              placeholder={this.props.t("symptoms.FROM_DATE_TEXT")}
              value={this.props.searchForm.start}
              onChange={this.props.onDateChangeSearch}
              dateFormat="DD MMM YYYY, hh:mm A"
              disabled={this.props.disabled.start}
            />
          </Col>
          <Col xs="4">
            <Field
              name="to"
              component={Dropdown}
              disabled={this.props.disabled.to}
              options={ListOfWhile}
              placeholder="Number of Days"
              onChange={e => this.props.onChangeSearchForm(e)}
            />
          </Col>
          <Col xs="2">
            <button
              type="button"
              className="btn btn-primary btnWide editInputSearchBtn"
              disabled={this.state.searchBtn ? "disabled" : ""}
              onClick={this.onDateRangeChange.bind(this)}
            >
              <i className="fa fa-search"></i>
            </button>
          </Col>
        </FormGroup>
      </Form>
    );
  }
}
SearchSymptomForm = reduxForm({
  form: "formEditSymptom",
  enableReinitialize: true
  //keepDirtyOnReinitialize: false
})(SearchSymptomForm);

SearchSymptomForm = connect(state => ({
  initialValues: state.editSymptom.searchForm
}))(SearchSymptomForm);

class EditSymptomForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // created: '',
      created: moment()
    };
    this.handleChange = this.handleChange.bind(this);
    this.forceSubmit = this.forceSubmit.bind(this);
  }
  componentDidMount() {
    this.props.onRef(this);
  }
  componentWillReceiveProps(newProps) {
    this.setState({ created: newProps.symptomEditForm.created });
  }
  categoryClicked() {
    if (this.props.disabled.category)
      alert(this.props.t("symptoms.NO_USER_SELECTED_ERROR_TEXT"));
  }

  scaleClicked() {
    if (this.props.disabled.input)
      alert(this.props.t("symptoms.NO_ITEM_NAME_ERROR_TEXT"));
  }

  inputClicked() {
    if (this.props.disabled.input)
      alert(this.props.t("symptoms.NO_CATEGORY_ERROR_TEXT"));
  }

  submitSymptom() {
    var addFlag = true;
    if (!this.props.symptomEditForm.symptom) {
      this.props.noIdValert.changeStatus();
      return false;
    }
    if (addFlag) {
      this.props.submit();
    }
  }
  forceSubmit() {
    this.props.submit();
  }

  searchNameOptions(e) {
    let val = e.target.value;
    this.props.searchNameOptions(val, this.props.itemSelected.category);
  }
  handleChange(val) {
    this.setState({ created: val });
    this.props.change("created", val.format("DD/MM/YYYY hh:mm A"));
  }
  // deleteSymptom() {
  //     this.props.deleteSymptom(this.props.symptomEditForm._id, this.props.searchForm.category);
  // }
  // onDateChange(val) {
  //   val = moment(val);
  //   this.props.onDateChange(val);
  // }
  render() {
    const {
      deleteMode,
      updateMode,
      onChangeSyptomEditForm,
      categories,
      itemSelected,
      symptomEditForm
    } = this.props;
    return (
      <Form onSubmit={this.props.handleSubmit}>
        <Field component={InputText} type="hidden" name="_id" />
        <FormGroup>
          <Field
            name="name"
            component={VautoComplete}
            disabled={this.props.disabled.name}
            placeholder={this.props.t("symptoms.ITEM_INPUT_TEXT")}
            //show={this.state.show}
            onChangeText={val => {
              this.props.searchNameOptions(val, itemSelected.category);
            }}
            onSelect={this.props.symptomOptionSelected}
            val={symptomEditForm.name}
            category={
              itemSelected && itemSelected.category
                ? itemSelected.category
                : undefined
            }
            level="111111"
          />
        </FormGroup>
        <FormGroup row>
          <Col>
            {this.props.scaleOptions.length === 0 && (
              <Field
                component={InputAmount}
                name="scale"
                placeholder={this.props.t("symptoms.ITEM_VALUE_TEXT")}
                //className={`${this.state.sizeValidator && "is-invalid"}`}
                onRef={ref => (this.amountRef = ref)}
                disabled={this.props.disabled.scale}
                onKeyUp={e => this.props.onChangeSyptomEditForm(e)}
                reseter={this.props.amountReseter}
                amounNewValue={this.props.amounNewValue}
                pattern="[0-9./ ]*"
              />
            )}
            {this.props.scaleOptions.length !== 0 && (
              <Field
                name="scale"
                component={Dropdown}
                options={this.props.scaleOptions}
                placeholder={this.props.t("symptoms.ITEM_VALUE_TEXT_SYMPTOM")}
                readOnly={this.props.disabled.input}
                //validate={Validations.select_required}
                disabled={this.props.disabled.scale}
                val={symptomEditForm.scale}
                onChange={e => this.props.onChangeSyptomEditForm(e)}
              />
            )}
          </Col>
          <Col>
            <Field
              name="unit"
              component={Dropdown}
              options={this.props.unitOptions}
              placeholder={this.props.t("symptoms.ITEM_UNIT_TEXT")}
              disabled={this.props.disabled.unit}
              onChange={e => this.props.onChangeSyptomEditForm(e)}
            />
          </Col>
        </FormGroup>
        <FormGroup>
          <VdateTimePicker
            name="created"
            placeholder={this.props.t("symptoms.TIME_TEXT")}
            value={symptomEditForm.created}
            onChange={this.props.onDateChange}
            dateFormat="DD MMM YYYY, hh:mm A"
            disabled={this.props.disabled.time}
          />
          {/* <label className="d-block popper-up">
            <Field
              name="created"
              placeholder={this.props.t("symptoms.TIME_TEXT")}
              component={DateTimeField}
              disabled={this.props.disabled.time}
              onChange={param => this.onDateChange(param)}
            />
            <span>
              <i className="fa fa-calendar-alt"></i>
            </span>
          </label> */}
        </FormGroup>
        <FormGroup>
          <Field
            name="comment"
            component={InputText}
            type="textarea"
            placeholder={this.props.t("products.COMMENT_DEFAULT_TEXT")}
            disabled={this.props.disabled.comment}
            onChange={e => this.props.onChangeSyptomEditForm(e)}
          />
        </FormGroup>
        <div className="button-spacer"></div>
        <FormGroup>
          <Row>
            <Col>
              <button
                type="button"
                className="btn btn-primary btnWide"
                onClick={this.submitSymptom.bind(this)}
                disabled={this.props.disabled.addBtn ? "disabled" : ""}
              >
                Update Item
              </button>
            </Col>
            <Col>
              <button
                type="button"
                disabled={!this.props.symptomEditForm._id}
                className="btn btn-primary btnWide"
                onClick={this.props.savePage.bind(this)}
                disabled={this.props.disabled.saveBtn ? "disabled" : ""}
              >
                Save Page
              </button>
            </Col>
          </Row>
          <span></span>
        </FormGroup>
      </Form>
    );
  }
}

EditSymptomForm = reduxForm({
  form: "formSymptom",
  enableReinitialize: true
  //keepDirtyOnReinitialize: false,
})(EditSymptomForm);

EditSymptomForm = connect(state => ({
  initialValues: state.editSymptom.symptomEditForm
}))(EditSymptomForm);

class EditSymptom extends Component {
  constructor(props) {
    super(props);
    this.savePage = this.savePage.bind(this);
    this.savedAddItem = this.savedAddItem.bind(this);
    this.submitAfterAsk = this.submitAfterAsk.bind(this);
    this.resetNegativeFunction = this.resetNegativeFunction.bind(this);
    this.selectUser = this.selectUser.bind(this);
    this.searchSymptom = this.searchSymptom.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentWillUnmount() {
    // if (this.props.updatedList) {
    //     this.noSaveBeforExitValert.changeStatus();
    // }
    this.props.resetPage();
  }
  leave = location => {
    if (this.props.updatedList)
      return "Unsaved info will be lost. Are you sure to leave?";
  };
  componentDidMount() {
    this.loggedInUser = getLoggedInUser();
    this.props.editPageInitialization(this.loggedInUser._id);
  }

  selectUser(id) {
    this.props.selectUser(id);
  }

  onSuccess() {
    alert(this.props.t("symptoms.SAVED"));
  }

  onSubmit(val) {
    let form = this.props.symptomEditForm;
    let searchForm = this.props.searchForm;
    let data = {};

    if (this.props.itemSelected.category === "01") {
      data = {
        _id: val._id,
        participant: searchForm.user,
        symptom: form.symptom,
        date: val.created.unix() * 1000,
        type: form.type,
        severity: val.scale,
        label: val.unit || "",
        symptom_name: val.name,
        comment: form.comment || "",
        category: this.props.itemSelected.category
      };
    } else {
      data = {
        _id: val._id,
        participant: searchForm.user,
        date: val.created.unix() * 1000,
        comment: form.comment || "",
        category: this.props.itemSelected.category,
        meals: [
          {
            _id: form.symptom,
            size: val.scale,
            symbol: val.unit || "",
            recipe: val.name
          }
        ]
      };
    }
    var addFlag = true;
    if (this.props.itemSelected.category === "01") {
      var symptoms = this.props.symptoms.filter(item => item.category == "01");
      symptoms.forEach(item => {
        var newTime = {
          currentTime: data.date,
          nextTime: item.date + 300000,
          pastTime: item.date - 300000
        };
        if (
          item.symptom_name == data.symptom_name &&
          item.severity == data.severity &&
          item.label == data.label &&
          newTime.currentTime > newTime.pastTime &&
          newTime.currentTime < newTime.nextTime
        ) {
          if (addFlag) {
            alert(this.props.t("symptoms.DUPLICATE_ENTRY_ERROR_TEXT"));
          }
          addFlag = false;
        }
      });
    } else {
      var meals = this.props.symptoms.filter(item => item.category == "02");
      meals.forEach(item => {
        var newTime = {
          currentTime: data.date,
          nextTime: item.date + 300000,
          pastTime: item.date - 300000
        };
        item = item.meals[0];
        if (
          item.recipe == data.meals[0].recipe &&
          item.size == data.meals[0].size &&
          item.symbol == data.meals[0].symbol &&
          newTime.currentTime > newTime.pastTime &&
          newTime.currentTime < newTime.nextTime
        ) {
          if (addFlag) {
            alert(this.props.t("symptoms.DUPLICATE_ENTRY_ERROR_TEXT"));
          }
          addFlag = false;
        }
      });
    }

    if (addFlag) {
      this.props.updateSymptom(
        data,
        this.props.itemSelected.category,
        this.onSuccess
      );
    }
  }
  searchSymptom(val) {
    val.start = this.props.searchForm.start;
    this.props.getSymptomList(val);
  }
  symptomSelected(item, index) {
    this.props.symptomSelected(item, item.category, index);
  }
  savePage() {
    if (this.props.updateMode) {
      this.dataInFormValert.changeStatus();
    } else {
      this.props.savePage(
        this.props.symptoms,
        this.props.searchForm.category,
        () => {
          alert("successfull!");
          setTimeout(() => {
            this.props.history.push("/");
          }, 1000);
        }
      );
    }
  }
  submitAfterAsk() {
    this.props.savePage(
      this.props.symptoms,
      this.props.searchForm.category,
      () => {
        //alert("successfull!");
        this.props.history.push("/");
      }
    );
  }
  savedAddItem() {
    this.editSform.forceSubmit();
  }
  onChangeSearchForm(e) {
    if (this.props.updatedList) {
      this.resetFormalert.changeStatus();
      this.resetFormFunction = this.props.onChangeSearchForm;
      this.resetFormalertValue = e;
      this.resetNegativeVal = e.target.name;
    } else {
      this.props.onChangeSearchForm(e);
    }
  }
  onDateChangeSearch(e) {
    if (this.props.updatedList) {
      this.resetFormalert.changeStatus();
      this.resetFormFunction = this.props.onDateChangeSearch;
      this.resetFormalertValue = e;
      this.resetNegativeVal = "start";
    } else {
      this.props.onDateChangeSearch(e);
    }
  }
  categorySelected(e) {
    if (this.props.updatedList) {
      this.resetFormalert.changeStatus();
      this.resetFormFunction = this.props.categorySelected;
      this.resetFormalertValue = e;
      this.resetNegativeVal = "category";
    } else {
      this.props.categorySelected(e);
    }
  }
  resetNegativeFunction(name) {
    var val = "";
    switch (name) {
      case "category":
        val = this.props.searchForm.category;
        break;
      case "start":
        val = this.props.searchForm.start;
        break;
      case "to":
        val = this.props.searchForm.to;
        break;
      case "user":
        val = this.props.searchForm.user;
        break;
    }
    this.props.searchFormChanger(name, val);
  }
  render() {
    const {
      onChangeSyptomEditForm,
      deleteMode,
      updateMode,
      categories,
      ListOfWhile,
      itemSelected
    } = this.props;

    return (
      <div className="vPage symptom flex">
        <Loading isLoading={this.props.isLoading} />
        <Valert
          display={false}
          title="Warning!"
          question="Do you want to go out without save!"
          onRef={ref => (this.noSaveBeforExitValert = ref)}
          positiveAction={this.savedAddItem}
        />
        <Valert
          display={false}
          title="Warning!"
          question={this.props.t("symptoms.OTHER_ENTRY_ERROR_TEXT")}
          onRef={ref => (this.noIdValert = ref)}
          positiveAction={this.savedAddItem}
        />
        <Valert
          display={false}
          question={
            "You have changed data on form. Do you want to save your data without this item?"
          }
          onRef={ref => (this.dataInFormValert = ref)}
          positiveAction={this.submitAfterAsk}
          positiveText="Yes"
          negativeText="Cancel"
        />
        <Valert
          display={false}
          title="Delete Confirmation"
          question="Are you sure you want to delete this entry?"
          onRef={ref => (this.deleteValert = ref)}
          positiveAction={() => {
            this.props.deleteSymptom(this.vId);
          }}
          positiveText="Yes"
          negativeText="Cancel"
        />
        <Valert
          display={false}
          title="Warning!"
          question="Unsaved info will be lost. Are you sure to change?"
          onRef={ref => (this.resetFormalert = ref)}
          positiveAction={() => {
            this.resetFormFunction(this.resetFormalertValue);
          }}
          negativeAction={() => {
            this.resetNegativeFunction(this.resetNegativeVal);
          }}
          positiveText="Yes"
          negativeText="Cancel"
        />
        <MuiThemeProvider>
          <SearchSymptomForm
            t={this.props.t}
            disabled={this.props.disabled}
            searchForm={this.props.searchForm}
            category={this.props.searchForm.category}
            users={this.props.users}
            onSubmit={this.searchSymptom}
            categorySelected={this.categorySelected.bind(this)}
            onChangeSearchForm={this.onChangeSearchForm.bind(this)}
            onDateChangeSearch={this.onDateChangeSearch.bind(this)}
            searchBtn={this.props.disabled.searchBtn}
            categories={categories}
            ListOfWhile={ListOfWhile}
          ></SearchSymptomForm>
        </MuiThemeProvider>
        <div className="grayList editSymptomList" style={{ flex: 1 }}>
          {(!this.props.symptoms || this.props.symptoms < 1) && (
            <div className="usersItem">
              <Row className="wrapper">
                <Col>
                  <span className="desc"></span>
                  {this.props.t("recipe.INGREDIENTS_EMPTY")}
                </Col>
              </Row>
            </div>
          )}
          {this.props.symptoms &&
            this.props.symptoms.map((item, index) => {
              if (item.status != 2) {
                const class_name = "usersItem";
                var data = item.status == 1 ? item.updatedData : item;
                const name =
                  item.category === "01"
                    ? data.symptom_name
                    : data.meals[0].recipe;
                const scale =
                  item.category === "01" ? data.severity : data.meals[0].size;
                const unit = item.category === "01" ? "" : data.meals[0].symbol;
                return (
                  <div className="usersItem">
                    <Row
                      className="wrapper"
                      key={index}
                      onClick={this.symptomSelected.bind(this, item, index)}
                    >
                      <Col xs="3">
                        {moment(data.date).format("DD MMM hh:mmA ")}
                      </Col>
                      <Col xs="1">
                        {scale} {unit ? unit : ""}
                      </Col>
                      <Col xs="7">{name}</Col>
                      <Col
                        className="d-flex justify-content-end align-items-center"
                        xs="1"
                      >
                        {item.selected && <i className="fas fa-check" />}
                        <i
                          className="fas fa-trash deleteIcon"
                          onClick={e => {
                            e.stopPropagation();
                            this.vId = item.vId;
                            this.deleteValert.changeStatus();
                            //this.props.askDeleteCaller(item.vId);
                          }}
                        />
                      </Col>
                    </Row>
                  </div>
                );
              }
            })}
        </div>
        <MuiThemeProvider>
          <EditSymptomForm
            t={this.props.t}
            disabled={this.props.disabled}
            onSubmit={this.onSubmit}
            //nameOptions={this.props.nameOptions}
            scaleOptions={this.props.scaleOptions}
            unitOptions={this.props.unitOptions}
            searchNameOptions={this.props.searchNameOptions}
            nameTotalOptions={this.props.nameTotalOptions}
            symptomEditForm={this.props.symptomEditForm}
            searchForm={this.props.searchForm}
            symptoms={this.props.symptoms}
            symptomOptionSelected={this.props.symptomOptionSelected}
            updateSymptom={this.props.updateSymptom}
            onDateChange={this.props.onDateChange}
            deleteSymptom={() => this.deleteValert.changeStatus()}
            disabled={this.props.disabled}
            deleteMode={deleteMode}
            updateMode={updateMode}
            onChangeSyptomEditForm={onChangeSyptomEditForm}
            savePage={this.savePage}
            currentCategory={this.props.searchForm.category}
            amounNewValue={this.props.amounNewValue}
            amountReseter={this.props.amountReseter}
            noIdValert={this.noIdValert}
            onRef={ref => (this.editSform = ref)}
            itemSelected={itemSelected}
          ></EditSymptomForm>
        </MuiThemeProvider>
      </div>
    );
  }
}

EditSymptom = translate("translations")(EditSymptom);

const mapStateToProps = state => ({
  ...state.editSymptom,
  formEditSymptom: state.form.formEditSymptom,
  formSymptom: state.form.formSymptom
});

const matchDispatchToProps = dispatch =>
  bindActionCreators({ ...editSymptomActions }, dispatch);

export default connect(mapStateToProps, matchDispatchToProps)(EditSymptom);
