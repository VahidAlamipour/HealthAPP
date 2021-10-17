import React, { Component } from "react";
import { getLoggedInUser, isLoggedIn } from "../services/AuthenticationService";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import { Field, reduxForm } from "redux-form";
import {
  InputText,
  Dropdown,
  Loading,
  Valert,
  Vmodal,
  InputAmount,
  VautoComplete,
  VdateTimePicker
} from "../components";
import _ from "lodash";
import symptomActions from "../actions/symptomActions";
import { Row, Col, Button, Form, FormGroup, Alert } from "reactstrap";
import Validations from "../components/Validations";
//import { AutoComplete } from "redux-form-material-ui";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import moment from "moment";
import { Prompt } from "react-router";

import "./styles/symptoms.css";
import { inflate } from "zlib";

class SymptomForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: "",
      autocompleteValue: "",
      renderCounter: "",
      categoryValidator: "",
      autoValidator: "",
      scaleValidator: "",
      unitValidator: "",
      userValidator: "",
      scaleValue: "",
      unitValue: "",
      itemLabel: props.t("symptoms.ITEM_INPUT_TEXT"),
      scaleLabel: props.t("symptoms.ITEM_VALUE_TEXT"),
      enterHandel: true
    };
    //this.onSubmit = this.onSubmit.bind(this);
    this.scaleOnChange = this.scaleOnChange.bind(this);
    this.unitOnChange = this.unitOnChange.bind(this);
    this.categoryOnChange = this.categoryOnChange.bind(this);
    this.searchNameOptions = this.searchNameOptions.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.keyPress = this.keyPress.bind(this);
    this.checkItemSelected = this.checkItemSelected.bind(this);
  }
  tochedCategory = false;
  tochedAutocomplete = false;
  autocompleteValid = false;
  componentDidMount() {
    this.props.onRef(this);
  }
  stateChanger(key, value) {
    var data = {};
    data[key] = value;
    this.setState(data);
  }
  selectUser(id) {
    this.props.selectUser(id);
    this.setState({ renderCounter: this.state.renderCounter++ });
  }
  onSuccess() {
    this.clearSymptom();
    setTimeout(() => {
      alert(this.props.t("symptoms.SAVED"));
    }, 100);
    //alert(this.props.t("symptoms.SAVED"));
  }
  keyPress(e) {
    if (e.keyCode == 13) {
      this.setState({ enterHandel: false });
    }
  }

  onSubmitOld(e) {
    e.preventDefault();
    if (!this.state.enterHandel) {
      this.setState({ enterHandel: true });
      return;
    }
    var resultFlag = true;
    let form = this.props.symptomForm;
    var userIds = [];
    this.props.users.forEach(element => {
      if (element.isSelected) {
        userIds.push(element._id);
      }
    });
    form.users = userIds;
    //final validation
    if (form.users == undefined || form.users.length <= 0) {
      resultFlag = false;
      this.setState({ userValidator: this.props.t("validations.required") });
    } else {
      this.setState({ userValidator: "" });
    }
    if (
      form.category == undefined ||
      form.category == null ||
      form.category == ""
    ) {
      resultFlag = false;
      this.setState({
        categoryValidator: this.props.t("validations.required")
      });
    } else {
      this.setState({ categoryValidator: "" });
    }
    if (this.state.autocompleteValue == "") {
      resultFlag = false;
      this.setState({ autoValidator: this.props.t("validations.required") });
    } else {
      this.setState({ autoValidator: "" });
    }
    if (this.state.scaleValue == "") {
      resultFlag = false;
      this.setState({ scaleValidator: this.props.t("validations.required") });
    } else {
      this.setState({ scaleValidator: "" });
    }
    if (this.props.unitOptions.length > 0 && this.state.unitValue == "") {
      resultFlag = false;
      this.setState({ unitValidator: this.props.t("validations.required") });
    } else {
      this.setState({ unitValidator: "" });
    }
    if (!resultFlag) return;
    //end final validation
    let data = {};
    if (!form.time) form.time = moment();
    if (form.category === "symptom") {
      data = {
        participants: form.users,
        symptom: form.symptom,
        date: form.time.unix() * 1000,
        type: form.type,
        severity: this.state.scaleValue,
        label: this.state.unitValue || ""
      };
    } else {
      data = {
        participants: form.users,
        date: form.time.unix() * 1000,
        meals: [
          {
            _id: form.symptom,
            size: this.state.scaleValue,
            symbol: this.state.unitValue || ""
          }
        ]
      };
    }
    this.props.createSymptom(data, form.category, this.onSuccess);
  }
  scaleOnChange(e) {
    var val = e.target.value == "null" ? "" : e.target.value;
    this.setState({ scaleValue: val });
  }
  unitOnChange(e) {
    var val = e.target.value == "null" ? "" : e.target.value;
    this.setState({ unitValue: val });
  }
  categoryClicked() {
    this.tochedCategory = true;
    this.setState({ renderCounter: this.state.renderCounter++ });
  }
  scaleClicked() {
    if (this.state.autocompleteValue.length > 0) {
      this.setState({ autoValidator: "" });
    } else {
      this.setState({
        autoValidator: this.props.t("symptoms.NO_ITEM_NAME_ERROR_TEXT")
      });
    }
  }
  searchNameOptions(e) {
    e.preventDefault();
    let val = e.target.value;
    this.setState({ autocompleteValue: val });
    this.props.searchNameOptions(val, this.props.symptomForm.category);
  }
  clearSymptom() {
    var tags = document.getElementsByTagName("input");
    for (var i = 0, max = tags.length; i < max; i++) {
      if (tags[i].type === "checkbox") tags[i].checked = false;
    }
    this.categoryElement && this.categoryElement.reset();
    this.scaleElement && this.scaleElement.reset();
    this.unitElement && this.unitElement.reset();
    this.props.change("name", "");
    this.props.change("category", null);
    this.props.change("time", "");
    this.props.change("scale", "");
    this.props.clearSymptom();
    this.setState({
      time: "",
      autocompleteValue: "",
      renderCounter: "",
      categoryValidator: "",
      autoValidator: "",
      scaleValidator: "",
      unitValidator: "",
      userValidator: "",
      scaleValue: "",
      unitValue: ""
    });
  }
  chackScale = value => {
    if (this.autocompleteValid) {
      if (typeof value != "undefined" && value.length > 0) {
        return undefined;
      } else {
        return this.props.t("validations.required");
      }
    } else {
      return this.props.t("symptoms.NO_ITEM_NAME_ERROR_TEXT");
    }
  };
  categoryOnChange(e) {
    this.props.categorySelected(e);
    if (e.target.value == "01") {
      this.setState({
        itemLabel: this.props.t("symptoms.ITEM_INPUT_TEXT_SYMPTOM"),
        scaleLabel: this.props.t("symptoms.ITEM_VALUE_TEXT_SYMPTOM")
      });
    } else {
      this.setState({
        itemLabel: this.props.t("symptoms.ITEM_INPUT_TEXT"),
        scaleLabel: this.props.t("symptoms.ITEM_VALUE_TEXT")
      });
    }
  }
  checkItemSelected(UserId, index) {
    var result = false;
    var { selectedList } = this.props;
    selectedList.forEach(element => {
      if (UserId == element.user._id && element.index == index) {
        result = true;
      }
    });
    return result;
  }
  onDateChange(val) {
    val = moment(val);
    this.props.onDateChange(val);
  }
  render() {
    const {
      inputsList,
      t,
      showList,
      classNames,
      selectedList,
      categories
    } = this.props;
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div
          className={`grayList user-list ${this.state.userValidator &&
            "is-invalid"} ${classNames.UsersBox}`}
        >
          {this.props.users.map((item, index) => {
            return (
              <div className="item" key={index}>
                <label className="symptom-checkbox-container">
                  <input
                    type="checkbox"
                    checked={item.isSelected}
                    onClick={this.selectUser.bind(this, item._id)}
                  />
                  {`${item.first_name}  ${item.last_name}`}
                  <span className="symptom-checkbox-checkmark" />
                </label>
              </div>
            );
          })}
        </div>
        {this.state.userValidator && (
          <div className="invalid-feedback">{this.state.userValidator}</div>
        )}
        <div className={`grayList ingredient-list `} style={{ flex: 1 }}>
          {(!showList || showList.length < 1) && (
            <div className="usersItem">
              <Row className="wrapper">
                <Col>
                  <span className="desc" />
                  {this.props.t("recipe.INGREDIENTS_EMPTY")}
                </Col>
              </Row>
            </div>
          )}
          {showList &&
            showList.map((item, i) => {
              if (item) {
                let desc = `${item.first_name} ${item.last_name}`;
                var itemsOfList =
                  item.inputs && item.inputs.length > 0
                    ? _.orderBy(item.inputs, ["time"])
                    : undefined;
                return (
                  <div>
                    <h3>{desc}</h3>
                    {itemsOfList &&
                      itemsOfList.map((row, index) => {
                        let rowText = `$ $ $`;
                        return (
                          <div className="usersItem">
                            <Row
                              className="wrapper"
                              key={i}
                              onClick={() => {
                                if (row.category == "01") {
                                  this.setState({
                                    itemLabel: this.props.t(
                                      "symptoms.ITEM_INPUT_TEXT_SYMPTOM"
                                    ),
                                    scaleLabel: this.props.t(
                                      "symptoms.ITEM_VALUE_TEXT_SYMPTOM"
                                    )
                                  });
                                } else {
                                  this.setState({
                                    itemLabel: this.props.t(
                                      "symptoms.ITEM_INPUT_TEXT"
                                    ),
                                    scaleLabel: this.props.t(
                                      "symptoms.ITEM_VALUE_TEXT"
                                    )
                                  });
                                }
                                this.props.selectItem(item, row.vId);
                              }}
                            >
                              <Col xs="3">
                                {row.time.format("DD MMM hh:mmA ")}
                              </Col>
                              <Col xs="2">
                                {row.scale} {row.unit ? row.unit : ""}
                              </Col>
                              <Col xs="6">{row.sName}</Col>
                              <Col
                                xs="1"
                                className="d-flex justify-content-end align-items-center"
                              >
                                {row.selected && <i className="fas fa-check" />}
                                <i
                                  className="fas fa-trash deleteIcon"
                                  onClick={e => {
                                    e.stopPropagation();
                                    this.props.askDeleteCaller(row.vId);
                                  }}
                                />
                              </Col>
                            </Row>
                          </div>
                        );
                      })}
                  </div>
                );
              }
            })}
        </div>
        <Form>
          <Field component={InputText} type="hidden" name="users" />
          <Field component={InputText} type="hidden" name="symptom" />
          <Field component={InputText} type="hidden" name="type" />
          <FormGroup>
            <Field
              name="category"
              component={Dropdown}
              options={categories}
              //readOnly={this.props.disabled.category}
              disabled={this.props.disabled.category}
              placeholder={this.props.t("symptoms.CATEGORY_TEXT")}
              onClick={this.categoryClicked.bind(this)}
              onChange={this.categoryOnChange}
              //validate={value => Validations.select_required_related(value, this.props.disabled.category, this.tochedCategory)}
              //validate={Validations.select_required}
            />
          </FormGroup>
          <FormGroup>
            <Field
              name="name"
              component={VautoComplete}
              disabled={this.props.disabled.name}
              placeholder={this.state.itemLabel}
              onChangeText={val => {
                this.props.searchNameOptions(
                  val,
                  this.props.symptomForm.category
                );
              }}
              data={this.props.nameOptions}
              onSelect={this.props.symptomOptionSelected}
              val={this.props.symptomForm.name}
              category={this.props.symptomForm.category}
              level="111111"
            />
            {/* <div className={"border-col"}>
              <Field
                name="name"
                className={`item-input-text ${this.state.autoValidator &&
                  "is-invalid"} ${this.props.disabled.name ? "disabled" : ""}`}
                component={AutoComplete}
                hintText={this.state.itemLabel}
                openOnFocus
                fullWidth={true}
                onKeyUp={this.searchNameOptions}
                onKeyDown={this.keyPress}
                dataSource={this.props.nameOptions}
                filter={(searchText, key) => true}
                underlineStyle={{ display: "none" }}
                onNewRequest={this.symptomOptionSelected.bind(this)}
                listStyle={{ maxHeight: 200, overflow: "auto" }}
                disabled={this.props.disabled.name}
                maxlength="63"
                //validate={value => Validations.select_required_related(value, this.props.disabled.category, this.tochedAutocomplete)}
              />
              {this.state.autoValidator && (
                <div className="invalid-feedback">
                  {this.state.autoValidator}
                </div>
              )}
              <span>
                <i className="fa fa-microphone" />
              </span>
            </div> */}
          </FormGroup>
          <FormGroup row>
            <Col>
              {this.props.scaleOptions.length === 0 && (
                <Field
                  component={InputAmount}
                  name="scale"
                  placeholder={this.state.scaleLabel}
                  //className={`${this.state.sizeValidator && "is-invalid"}`}
                  onRef={ref => (this.amountRef = ref)}
                  disabled={this.props.disabled.scale}
                  onKeyUp={e => this.props.onChangeForm(e)}
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
                  placeholder={this.state.scaleLabel}
                  readOnly={this.props.disabled.scale}
                  disabled={this.props.disabled.scale}
                  onChange={e => this.props.onChangeForm(e)}
                  //onClick={this.scaleClicked.bind(this)}
                  //validate={Validations.select_required}
                />
              )}
            </Col>
            <Col>
              <Field
                name="unit"
                component={Dropdown}
                options={this.props.unitOptions}
                placeholder={this.props.t("symptoms.ITEM_UNIT_TEXT")}
                readOnly={this.props.disabled.scale}
                onClick={this.scaleClicked.bind(this)}
                disabled={this.props.disabled.unit}
                onChange={e => this.props.onChangeForm(e)}
              />
            </Col>
          </FormGroup>
          {/* <FormGroup>
            <label className="d-block popper-up">
              <Field
                name="time"
                placeholder={this.props.t("symptoms.TIME_TEXT")}
                component={DateTimeField}
                //readOnly
                disabled={this.props.disabled.time}
                onChange={param => this.onDateChange(param)}
                //onChange={e => this.props.onChangeForm(e)}
                // validate={Validations.required}
              />
              <span>
                <i
                  className={`${
                    this.props.disabled.time
                      ? "fa fa-calendar-alt disable"
                      : "fa fa-calendar-alt"
                  }`}
                />
              </span>
            </label>
            
          </FormGroup> */}
          <FormGroup>
            <VdateTimePicker
              placeholder={this.props.t("symptoms.TIME_TEXT")}
              value={this.props.symptomForm.time}
              onChange={this.props.onDateChange}
              dateFormat="DD MMM YYYY, hh:mm A"
              disabled={this.props.disabled.time}
            />
          </FormGroup>
          <FormGroup>
            <Field
              name="comment"
              component={InputText}
              type="textarea"
              placeholder={this.props.t("products.COMMENT_DEFAULT_TEXT")}
              disabled={this.props.disabled.comment}
              onChange={e => this.props.onChangeForm(e)}
            />
          </FormGroup>
        </Form>
      </div>
    );
  }
}

SymptomForm = reduxForm({
  form: "formSymptom",
  enableReinitialize: true
  //keepDirtyOnReinitialize: true
})(SymptomForm);

SymptomForm = connect(state => ({
  initialValues: state.symptom.symptomForm
}))(SymptomForm);

class Symptom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDuplicateError: false
    };
    this.addClicked = this.addClicked.bind(this);
    this.saveClicked = this.saveClicked.bind(this);
    this.UpdateClicked = this.UpdateClicked.bind(this);
    this.askClearPage = this.askClearPage.bind(this);
    this.clearSymptom = this.clearSymptom.bind(this);
    this.savedAddItem = this.savedAddItem.bind(this);
    this.submitAfterAsk = this.submitAfterAsk.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.askDeleteCaller = this.askDeleteCaller.bind(this);
  }
  componentWillUnmount() {
    this.props.resetPage();
  }

  componentDidMount() {
    if (!isLoggedIn()) {
      this.props.history.push("/");
      return;
    }
    this.loggedInUser = getLoggedInUser();
    this.props.inputPageInitialization(this.loggedInUser._id);
  }
  clearSymptom() {
    this.props.clearSymptom();
  }
  addClicked() {
    this.props.addClicked();
  }
  saveClicked() {
    //check form is empty
    var inF = this.props.symptomForm;
    if (
      inF.category ||
      inF.category == "null" ||
      inF.name ||
      inF.scale ||
      inF.comment ||
      inflate.brand ||
      (inF.unit && inF.unit != "null")
    ) {
      this.dataInFormValert.changeStatus();
      return false;
    }
    this.props.saveClicked(this.props.showList);
  }
  savedAddItem() {
    this.savedValues.sName = this.savedValues.name;
    this.props.addItem(this.savedValues);
  }
  submitAfterAsk(values) {
    this.props.saveClicked(this.props.showList);
  }
  onSubmit(values) {
    values.name = this.props.symptomForm.name;
    values.symptom = this.props.symptomForm.symptom;
    values.sName = this.props.symptomForm.sName;
    values.type = this.props.symptomForm.type;
    values.users = this.props.symptomForm.users;
    values.time = this.props.symptomForm.time;
    if (!values.symptom) {
      this.noIdValert.changeStatus();
      this.savedValues = values;
      return false;
    }
    var addFlag = true;
    values.users.forEach(inputUser => {
      this.props.showList.forEach(user => {
        if (inputUser == user._id) {
          user.inputs.forEach(item => {
            var newTime = {
              currentTime: values.time.valueOf(),
              nextTime: item.time.valueOf() + 300000,
              pastTime: item.time.valueOf() - 300000
            };
            if (
              item.category == values.category &&
              item.scale == values.scale &&
              item.name == values.name &&
              item.unit == values.unit &&
              newTime.currentTime > newTime.pastTime &&
              newTime.currentTime < newTime.nextTime
            ) {
              if (addFlag) {
                this.setState({ showDuplicateError: true });
                //alert(this.props.t("symptoms.DUPLICATE_ENTRY_ERROR_TEXT"));
              }
              addFlag = false;
            }
          });
        }
      });
    });
    if (addFlag) {
      this.props.addItem(values);
    }
  }
  askDeleteCaller(id) {
    this.deleteId = id;
    this.deleteValert.changeStatus();
  }
  UpdateClicked() {
    var values = this.props.symptomForm;
    if (!values.symptom) {
      this.noIdValertUpdate.changeStatus();
      this.savedValues = values;
      return false;
    }
    var addFlag = true;
    // this.props.showList.forEach(user => {
    //   user.inputs.forEach(item => {
    //     var newTime = {
    //       currentTime: values.time.valueOf(),
    //       nextTime: item.time.valueOf() + 300000,
    //       pastTime: item.time.valueOf() - 300000
    //     };
    //     if (
    //       item.vId != values.vId &&
    //       item.category == values.category &&
    //       item.scale == values.scale &&
    //       item.name == values.name &&
    //       item.unit == values.unit &&
    //       (newTime.currentTime > newTime.pastTime &&
    //         newTime.currentTime < newTime.nextTime)
    //     ) {
    //       if (addFlag) {
    //         this.setState({ showDuplicateError: true });
    //       }
    //       addFlag = false;
    //     }
    //   });
    // });
    //  }
    let userSelectedId = undefined;
    this.props.showList.forEach(user => {
      user.inputs.forEach(item => {
        if (item.vId == values.vId) {
          userSelectedId = user._id;
        }
      });
    });
    this.props.showList.forEach(user => {
      if (userSelectedId == user._id) {
        user.inputs.forEach(item => {
          var newTime = {
            currentTime: values.time.valueOf(),
            nextTime: item.time.valueOf() + 300000,
            pastTime: item.time.valueOf() - 300000
          };
          if (
            item.vId != values.vId &&
            item.category == values.category &&
            item.scale == values.scale &&
            item.name == values.name &&
            item.unit == values.unit &&
            newTime.currentTime > newTime.pastTime &&
            newTime.currentTime < newTime.nextTime
          ) {
            if (addFlag) {
              this.setState({ showDuplicateError: true });
            }
            addFlag = false;
          }
        });
      }
    });
    // this.props.selectedItem.users.forEach(inputUser => {
    //   this.props.showList.forEach(user => {
    //     console.log("injaUp", inputUser, user);
    //     if (inputUser == user._id) {
    //       user.inputs.forEach(item => {
    //         var newTime = {
    //           currentTime: values.time.valueOf(),
    //           nextTime: item.time.valueOf() + 300000,
    //           pastTime: item.time.valueOf() - 300000
    //         };
    //         if (
    //           item.vId != values.vId &&
    //           item.category == values.category &&
    //           item.scale == values.scale &&
    //           item.name == values.name &&
    //           item.unit == values.unit &&
    //           (newTime.currentTime > newTime.pastTime &&
    //             newTime.currentTime < newTime.nextTime)
    //         ) {
    //           if (addFlag) {
    //             this.setState({ showDuplicateError: true });
    //           }
    //           addFlag = false;
    //         }
    //       });
    //     }
    //   });
    // });
    if (addFlag) {
      this.props.updateItem();
    }
  }
  askClearPage() {
    this.clearValert.changeStatus();
  }
  leave = location => {
    if (this.props.updatedList)
      return "Unsaved info will be lost. Are you sure to leave?";
  };
  render() {
    let {
      t,
      disabled,
      classNames,
      onChangeForm,
      selectItem,
      selectedList,
      deleteMode,
      updateMode,
      categories
    } = this.props;
    return (
      <div className="vPage symptom flex">
        <Loading isLoading={this.props.isLoading} />
        <Vmodal
          displayStatus={this.props.saveSuccess}
          data={
            <div>
              <h4>{t("meal_planner.SAVE_SUCCESSFULLY_TITLE")}</h4>
              <p>{t("meal_planner.SAVE_SUCCESSFULLY_TEXT")}</p>
            </div>
          }
        />
        <Valert
          display={false}
          title="Delete Confirmation"
          question="Are you sure you want to delete this entry?"
          onRef={ref => (this.deleteValert = ref)}
          positiveAction={() => {
            this.props.deleteItem(this.deleteId);
          }}
          positiveText="Yes"
          negativeText="Cancel"
        />
        <Valert
          display={this.state.showDuplicateError}
          //onRef={ref => (this.warningDuplicateItemValert = ref)}
          title={t("symptoms.DUPLICATE_ENTRY_TITLE")}
          question={t("symptoms.DUPLICATE_ENTRY_ERROR_TEXT")}
          positiveAction={() => {
            setTimeout(() => {
              this.setState({ showDuplicateError: false });
            }, 200);
          }}
          positiveText="Ok"
          readonly={true}
        />
        <Valert
          display={false}
          question={
            "You have not added your last item to the list. Do you want to save your data without this item?"
          }
          onRef={ref => (this.dataInFormValert = ref)}
          positiveAction={this.submitAfterAsk}
          positiveText="Yes"
          negativeText="Cancel"
        />
        <Valert
          display={false}
          question={t("symptoms.CLEAR_PROMPT_TEXT")}
          title={t("symptoms.CLEAR_PAGE_TITLE")}
          onRef={ref => (this.clearValert = ref)}
          positiveAction={this.clearSymptom}
        />
        <Valert
          display={false}
          title="Warning!"
          question={t("symptoms.OTHER_ENTRY_ERROR_TEXT")}
          onRef={ref => (this.noIdValert = ref)}
          positiveAction={this.savedAddItem}
        />
        <Valert
          display={false}
          title="Warning!"
          question={t("symptoms.OTHER_ENTRY_ERROR_TEXT")}
          onRef={ref => (this.noIdValertUpdate = ref)}
          positiveAction={this.props.updateItem}
        />
        {/* <h6 className="user-selection-header-text">
          {t("symptoms.USER_SELECTION_HEADER_TEXT")}
        </h6> */}
        <MuiThemeProvider>
          <SymptomForm
            t={this.props.t}
            disabled={disabled}
            categorySelected={this.props.categorySelected}
            clearSymptom={this.props.clearSymptom}
            nameOptions={this.props.nameOptions}
            nameTotalOptions={this.props.nameTotalOptions}
            scaleOptions={this.props.scaleOptions}
            unitOptions={this.props.unitOptions}
            symptomForm={this.props.symptomForm}
            onDateChange={this.props.onDateChange}
            symptomOptionSelected={this.props.symptomOptionSelected}
            searchNameOptions={this.props.searchNameOptions}
            createSymptom={this.props.createSymptom}
            users={this.props.users}
            selectUser={this.props.selectUser}
            onSubmit={this.onSubmit}
            showList={this.props.showList}
            onRef={ref => (this.symptom = ref)}
            classNames={classNames}
            onChangeForm={onChangeForm}
            selectItem={selectItem}
            selectedList={selectedList}
            amounNewValue={this.props.amounNewValue}
            amountReseter={this.props.amountReseter}
            categories={categories}
            askDeleteCaller={this.askDeleteCaller}
          />
        </MuiThemeProvider>
        <div class="row formRow">
          <div class="col">
            {updateMode && (
              <button
                type="button"
                className="btn btn-primary btnWide"
                onClick={this.UpdateClicked}
              >
                Update Item
              </button>
            )}
            {/* {deleteMode && (
              <button
                type="button"
                className="btn btn-primary btnWide"
                onClick={() => this.deleteValert.changeStatus()}
              >
                Delete Item
              </button>
            )} */}
            {!updateMode && (
              <button
                type="button"
                className="btn btn-primary btnWide"
                onClick={this.addClicked}
                disabled={disabled.addBtn ? "disabled" : ""}
              >
                Add Item
              </button>
            )}
          </div>
          <div class="col">
            <button
              className="btn btn-primary btnWide"
              disabled={disabled.saveBtn ? "disabled" : ""}
              onClick={this.saveClicked}
            >
              Save Page
            </button>
          </div>
          <div class="col">
            <button
              type="button"
              className="btn btn-primary btnWide"
              onClick={this.askClearPage}
              disabled={disabled.clearBtn ? "disabled" : ""}
            >
              Clear Page
            </button>
          </div>
        </div>
        {/* <Prompt message={this.leave} /> */}
      </div>
    );
  }
}

Symptom = translate("translations")(Symptom);

const mapStateToProps = state => ({ ...state.symptom });

const matchDispatchToProps = dispatch =>
  bindActionCreators({ ...symptomActions }, dispatch);

export default connect(mapStateToProps, matchDispatchToProps)(Symptom);
