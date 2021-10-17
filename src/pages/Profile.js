import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import { Row, Col, Button, Form, FormGroup, Alert, Input } from "reactstrap";
import { Field, reduxForm } from "redux-form";
import {
  InputText,
  Dropdown,
  Loading,
  Validations,
  VautoComplete,
  Valert
} from "../components";
import moment from "moment";
import { isLoggedIn, getLoggedInUser } from "../services/AuthenticationService";
import profileActions from "../actions/profileActions";
import subUserCreateActions from "../actions/subUserCreateActions";
import profileUpdateActions from "../actions/profileUpdateActions";
import {
  monthOptions as arrMonthOptions,
  genderOptions,
  getYearOptions,
  getMonthOptionsTrans
} from "../components/componentsConstant";
import { getEthnicitiesOptions } from "../services/LookupService";

import "./styles/profile.css";
import { ToolbarTitle } from "material-ui";
// password validation
const min8 = Validations.min8;
const max15 = Validations.max15;
const minOneUppercase = Validations.min_one_uppercase;
const minOneNumber = Validations.min_one_number;
const minOneSpecial = Validations.min_one_special;
const passChecker = (value, old) => {
  var result = undefined;
  var final = "";
  result = old ? undefined : "You should fill old password field.";
  if (result) return result;
  result = min8(value);
  if (result) return result;
  result = minOneUppercase(value);
  if (result) return result;
  result = minOneNumber(value);
  if (result) return result;
  result = minOneSpecial(value);
  if (result) return result;
  return "";
};

class SubUserCreateForm extends Component {
  constructor(props) {
    super(props);
    this.vResetForm = this.vResetForm.bind(this);
    this.stateChanger = this.stateChanger.bind(this);
    this.passVlidator = this.passVlidator.bind(this);
    this.resetForgetPassword = this.resetForgetPassword.bind(this);
    this.state = {
      old_passwordValidator: "",
      new_passwordValidator: "",
      confirm_passwordValidator: ""
    };
  }
  componentDidMount() {
    this.props.onRef(this);
  }
  stateChanger(key, value) {
    var data = {};
    data[key] = value;
    this.setState(data);
  }
  vResetForm() {
    this.props.reset();
  }
  resetForgetPassword() {
    this.props.change("new_password", "");
    this.props.change("confirm_password", null);
    this.props.change("old_password", "");
    this.setState({
      old_passwordValidator: "",
      new_passwordValidator: "",
      confirm_passwordValidator: ""
    });
  }
  passVlidator(e) {
    this.setState({
      new_passwordValidator: passChecker(
        e.currentTarget.value,
        this.refs.old_password.value
      )
    });
  }
  checkConfirmPass(e) {
    var val =
      this.refs.new_password.value == undefined
        ? ""
        : this.refs.new_password.value;
    if (e.currentTarget.value != val) {
      this.setState({
        confirm_passwordValidator: this.props.t(
          "signUp.password_confirm_not_match"
        )
      });
    } else {
      this.setState({ confirm_passwordValidator: "" });
    }
  }
  render() {
    const t = this.props.t;
    const yearOptions = getYearOptions();
    const monthOptions = getMonthOptionsTrans(arrMonthOptions);
    let ethnicityOptions = this.props.ethnicities;
    // Transform the ethnicities from API to array options
    // if (this.props.ethnicities) {
    //   ethnicityOptions = getEthnicitiesOptions(this.props.ethnicities);
    // }
    // const locationOptions =
    //   this.props.locations &&
    //   this.props.locations.map(location => {
    //     return { value: location, label: location };
    //   });
    const changePassword = this.props.isDeleting || !this.props.isEditing;
    var formTitle = this.props.isEditing
      ? t("profile.update_form_title")
      : t("profile.new_subuser_title");
    if (this.props.selectedUser) {
      formTitle = `${formTitle} ${this.props.selectedUser.first_name} ${this.props.selectedUser.last_name}`;
    }
    return (
      <Form onSubmit={this.props.handleSubmit} ref="SUform">
        <h6>{formTitle}</h6>
        <FormGroup row>
          <Col>
            <Field
              component={InputText}
              type="text"
              name="first_name"
              ref="first_name"
              placeholder={t("profile.firstname")}
              validate={Validations.required}
              onChange={this.props.onChangeProfile}
            />
          </Col>
          <Col>
            <Field
              component={InputText}
              type="text"
              name="last_name"
              placeholder={t("profile.lastname")}
              validate={Validations.required}
              onChange={this.props.onChangeProfile}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col>
            <Field
              name="birthMonth"
              component={Dropdown}
              options={monthOptions}
              className="birthMonth"
              placeholder={t("profile.month")}
              validate={Validations.select_required}
              onChange={this.props.onChangeProfile}
            />
          </Col>
          <Col>
            <Field
              name="birthYear"
              component={Dropdown}
              options={yearOptions}
              className="birthYear"
              placeholder={t("profile.year")}
              validate={Validations.select_required}
              onChange={this.props.onChangeProfile}
            />
          </Col>
        </FormGroup>
        <FormGroup>
          <Field
            name="gender"
            component={Dropdown}
            options={genderOptions}
            className="gender"
            placeholder={t("profile.gender")}
            validate={Validations.select_required}
            onChange={this.props.onChangeProfile}
          />
        </FormGroup>
        <FormGroup>
          {/* <Field
            name="address"
            component={Dropdown}
            options={this.props.locations}
            className="address"
            placeholder={t("profile.address")}
            onChange={this.props.onChangeProfile}
          /> */}
          <Field
            name="location"
            component={VautoComplete}
            placeholder={t("profile.address")}
            onChangeText={val => {
              this.props.onChangeProfile({
                target: { name: "address", value: val }
              });
            }}
            onSelect={val => this.props.optionSelected(val, "address")}
            val={this.props.subUserCreateForm.address}
            category={"07"}
            level="111111"
          />
        </FormGroup>
        <FormGroup>
          <Field
            name="ethnicity"
            component={VautoComplete}
            placeholder={t("profile.ethnicity")}
            onChangeText={val => {
              this.props.onChangeProfile({
                target: { name: "ethnicity", value: val }
              });
            }}
            onSelect={val => this.props.optionSelected(val, "ethnicity")}
            val={this.props.subUserCreateForm.ethnicity}
            category={"21"}
            level="111111"
          />
          {/* <Field
            name="ethnicity"
            component={Dropdown}
            options={ethnicityOptions}
            className="ethnicity"
            placeholder={t("profile.ethnicity")}
            onChange={this.props.onChangeProfile}
          /> */}
        </FormGroup>
        <div>
          <FormGroup>
            <Field
              component={InputText}
              type="password"
              name="old_password"
              disabled={changePassword}
              placeholder={t("reset.old_password")}
              ref="old_password"
            />
            {this.state.old_passwordValidator && (
              <div className="invalid-feedback">
                {this.state.old_passwordValidator}
              </div>
            )}
          </FormGroup>
          <FormGroup>
            <Field
              component={InputText}
              type="password"
              name="new_password"
              disabled={changePassword}
              placeholder={t("reset.new_password")}
              onChange={this.passVlidator}
              ref="new_password"
            />
            {this.state.new_passwordValidator && (
              <div className="invalid-feedback">
                {this.state.new_passwordValidator}
              </div>
            )}
          </FormGroup>
          <FormGroup>
            <Field
              component={InputText}
              type="password"
              name="confirm_password"
              disabled={changePassword}
              placeholder={t("reset.new_password_confirm")}
              onBlur={this.checkConfirmPass.bind(this)}
              ref="confirm_password"
            />
            {this.state.confirm_passwordValidator && (
              <div className="invalid-feedback">
                {this.state.confirm_passwordValidator}
              </div>
            )}
          </FormGroup>
        </div>

        <FormGroup>
          <div className="submit2 row justify-content-between">
            <div className="col-4">
              <button
                type="button"
                className="btn btn-primary btnWide"
                onClick={this.props.onCancel}
                disabled={this.props.disabled.clearBtn ? "disabled" : ""}
              >
                {t("formCommon.clear")}
              </button>
              {/* <Button color="primary" onClick={this.props.onCancel}>
                {t("formCommon.clear")}
              </Button> */}
            </div>
            {!this.props.isEditing && (
              <div className="col-8">
                <Button disabled={this.props.disabled.addBtn} color="primary">
                  {t("formCommon.create")}
                </Button>
              </div>
            )}
            {this.props.isEditing && (
              <div className="col-8">
                <div className="row">
                  <div className="col">
                    <Button
                      disabled={this.props.disabled.addBtn}
                      color="primary"
                    >
                      {t("formCommon.save")}
                    </Button>
                  </div>
                  {this.props.isDeleting && (
                    <div className="col-6">
                      <Button
                        type="button"
                        color="primary"
                        onClick={this.props.onDelete}
                      >
                        {t("formCommon.delete")}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </FormGroup>
      </Form>
    );
  }
}
SubUserCreateForm = reduxForm({
  form: "formSubUserCreate",
  enableReinitialize: true,
  touchOnBlur: false
})(SubUserCreateForm);
SubUserCreateForm = connect(state => ({
  initialValues: state.profile.subUserCreateForm
}))(SubUserCreateForm);

let ProfileView = props => {
  const t = props.t;
  let user = props.user;

  // Translate the month label
  const monthOptions = getMonthOptionsTrans(arrMonthOptions);

  return (
    <div>
      {user && (
        <div>
          <div className="row form-group">
            <div className="col-4">{t("profile.fullname")}</div>
            <div className="col">
              : {user.last_name}, {user.first_name}
            </div>
          </div>
          <div className="row form-group">
            <div className="col-4">{t("profile.month")}</div>
            <div className="col">
              :{" "}
              {user.birthMonth &&
                monthOptions.find(value => value.value === user.birthMonth)
                  .label}
            </div>
          </div>
          <div className="row form-group">
            <div className="col-4">{t("profile.year")}</div>
            <div className="col">: {user.birthYear}</div>
          </div>
          <div className="row form-group">
            <div className="col-4">{t("profile.gender")}</div>
            <div className="col">
              :{" "}
              {user.gender &&
                genderOptions.find(
                  value => value.value === user.gender.toString()
                ).label}
            </div>
          </div>
          <div className="row form-group">
            <div className="col-4">{t("profile.address")}</div>
            <div className="col">: {user.address}</div>
          </div>
          <div className="row form-group">
            <div className="col-4">{t("profile.ethnicity")}</div>
            <div className="col">: {user.ethnicity}</div>
          </div>
          <FormGroup>
            <Button
              color="primary"
              style={{ width: "100%" }}
              onClick={props.updateProfileClicked}
            >
              {t("profile.update_profile")}
            </Button>
          </FormGroup>
        </div>
      )}
    </div>
  );
};

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedUserId: null
    };
    this.updateProfileClicked = this.updateProfileClicked.bind(this);
    this.subUserDeleteSubmit = this.subUserDeleteSubmit.bind(this);
    this.cancelClicked = this.cancelClicked.bind(this);
  }
  componentWillMount() {
    this.loggedInUser = getLoggedInUser();
    this.props.setDefaultState();
    // Check if login user
    if (isLoggedIn()) {
      this.props.subUserCreateInitialization(this.loggedInUser._id);
      this.setState({ selectedUserId: this.loggedInUser._id });
    } else {
      this.props.history.push("/");
    }
    this.state = {
      allUsers: null
    };
  }
  componentDidMount() {
    // Check if login user
    if (!isLoggedIn()) {
      console.log("Profile::componentDidMount(), !isLoggedIn");
      this.props.history.push("/");
    } else {
      console.log("Profile::componentDidMount(), isLoggedIn");
      this.props.getUserWithMainUserAndSubUsers(this.loggedInUser._id);
    }
  }
  profileChange(e) {
    this.setState({ selectedUserId: e.target.value });
    this.props.getUserWithMainUserAndSubUsers(
      e.target.value,
      this.loggedInUser._id
    );
  }
  updateProfileClicked() {
    this.setState({ isEditing: true });
    this.props.history.push("/profile/update/" + this.state.selectedUserId);
  }
  userItemOnClick(index) {
    this.FormRef.stateChanger("new_passwordValidator", "");
    this.FormRef.stateChanger("confirm_passwordValidator", "");
    const User = this.props.allUsers[index];
    if (User.isSelected) {
      this.setState({ selectedUserId: null });
      User.isSelected = false;
    } else {
      this.setState({ selectedUserId: User._id });
      User.isSelected = true;
    }
    this.props.editUserItem(index, this.props.selectedIndex, User);
  }
  handleSubmit(values) {
    values = this.props.subUserCreateForm;
    var duplicate = this.props.allUsers.find(item => {
      return (
        item.first_name == values.first_name &&
        item.last_name == values.last_name
      );
    });
    if (duplicate) {
      alert(`${values.first_name} ${values.last_name} is duplicated`);
      return false;
    }
    if (!this.noValidation) {
      if (!values.address_id || !values.ethnicity_id) {
        //Item not in 12u12 database. For better data analysis, click Cancel to edit or select from suggested list. Otherwise, click Yes to accept current entry
        let plusWord = "is";
        this.noIdValertMessage = "";
        if (!values.address_id) {
          this.noIdValertMessage = "Your location ";
        }
        if (!values.ethnicity_id) {
          if (this.noIdValertMessage) {
            this.noIdValertMessage += "and ";
            plusWord = "are";
          }
          this.noIdValertMessage += "Your ethnicity ";
        }
        this.noIdValertMessage += `there ${plusWord} not in 12u12 database. For better data analysis, click Cancel to edit or select from suggested list. Otherwise, click Yes to accept current entry`;
        this.setState({ noIdValertMessage: this.noIdValertMessage });
        this.noIdValert.changeStatus();
        return false;
      }
    }
    this.noValidation = false;
    const mainUser = this.props.user;
    const newUser = values;
    // const userBirthday = moment(
    //   `${newUser.birthYear}-${newUser.birthMonth}-15`
    // );
    //newUser.birthday = userBirthday.valueOf();
    newUser.address = { _id: newUser.address_id || "", name: newUser.address };
    newUser.ethnicity = {
      _id: newUser.ethnicity_id || "",
      name: newUser.ethnicity
    };
    newUser.birthday = {
      month: parseInt(newUser.birthMonth),
      year: parseInt(newUser.birthYear)
    };
    this.props.subUserCreateSubmit(mainUser._id, newUser);
    setTimeout(() => {
      this.props.resetPage();
    }, 500);
  }
  handleSubmitUpdate(values) {
    var baseUser = getLoggedInUser();
    let userForm = values;
    console.log("injaSub: ", userForm);
    // const userBirthday = moment(
    //   `${userForm.birthYear}-${userForm.birthMonth}-15`
    // );
    let user = { ...userForm };
    user.address = { _id: user.address_id || "", name: user.address };
    user.ethnicity = {
      _id: user.ethnicity_id || "",
      name: user.ethnicity
    };
    user.birthday = {
      month: parseInt(user.birthMonth),
      year: parseInt(user.birthYear)
    };
    //user.birthday = userBirthday.valueOf();
    this.props
      .updateProfile(user, baseUser, this.props.match.params.id)
      .then(() => {
        if (userForm.old_password) {
          var passCheck = passChecker(
            userForm.new_password,
            userForm.old_password
          );
          if (!userForm.new_password) {
            this.FormRef.stateChanger(
              "new_passwordValidator",
              "Please fill New Password."
            );
          } else if (passCheck) {
            this.FormRef.stateChanger("new_passwordValidator", passCheck);
          } else if (!userForm.confirm_password) {
            this.FormRef.stateChanger(
              "confirm_passwordValidator",
              this.props.t("reset.password_confirm_not_match")
            );
          } else if (userForm.new_password !== userForm.confirm_password) {
            this.FormRef.stateChanger(
              "confirm_passwordValidator",
              this.props.t("reset.password_confirm_not_match")
            );
          } else {
            const currUser = baseUser;
            values.email = currUser.email;
            this.props.changePasswordSubmit(values);
          }
        }
      });
  }
  subUserDeleteSubmit() {
    const mainUser = this.props.user;
    this.FormRef.vResetForm();
    this.props.subUserDeleteSubmit(mainUser._id, this.state.selectedUserId);
  }
  cancelClicked() {
    this.props.resetPage();
    //this.props.history.push('/dashboard');
  }
  showSelectedUser() {
    var user = this.props.allUsers.find(value => {
      return value.isSelected;
    });
    return user;
  }
  resetForgetPassword() {}
  render() {
    const {
      isLoading,
      status,
      actionResponse,
      user,
      mainUser,
      subUsers,
      t,
      ethnicities,
      locations,
      allUsers,
      isEditing,
      actionResponseCHP,
      statusCHP,
      statusPU,
      //actionResponse‌PU,
      subUserCreateForm,
      onChangeProfile,
      disabled,
      optionSelected
    } = this.props;
    // let mainUserName = mainUser !== null ? (mainUser.last_name + ', ' + mainUser.first_name) :
    //    (this.loggedInUser.last_name + ', ' + this.loggedInUser.first_name);
    // let allUsers = null;
    // if (this.loggedInUser && subUsers) {
    //    allUsers = [this.loggedInUser, ...subUsers];
    // }
    // if (actionResponse‌PU) {
    //   alert(actionResponse‌PU.message);
    // } else if (statusPU && statusPU == "success") {
    //   alert(t("formCommon.update_success"));
    // }
    if (actionResponseCHP) {
      alert(actionResponseCHP.message);
      this.FormRef.resetForgetPassword();
    } else if (statusCHP && statusCHP == "success") {
      alert(t("formCommon.change_password_success"));
      this.FormRef.resetForgetPassword();
    }
    const selectedUser = this.showSelectedUser();
    const isDeleting = selectedUser && selectedUser._id != mainUser._id;
    return (
      <div className="vPage">
        <Loading isLoading={isLoading} />
        <Valert
          display={false}
          title="Warning!"
          question={this.state.noIdValertMessage}
          onRef={ref => (this.noIdValert = ref)}
          positiveAction={() => {
            this.noValidation = true;
            this.handleSubmit();
          }}
        />
        <div className="grayList usersList" ref="users_container">
          {allUsers &&
            allUsers.map((item, i) => {
              var mainShow = i == 0 ? "(main)" : "";
              let desc = `${item.first_name} ${item.last_name} ${mainShow}`;
              return (
                <div
                  className="usersItem"
                  key={i}
                  onClick={this.userItemOnClick.bind(this, i)}
                >
                  <Row className="wrapper">
                    <Col>
                      <span className="desc">{desc}</span>
                      {item.isSelected && <i className="fas fa-check" />}
                      <div className="clearfix" />
                    </Col>
                  </Row>
                </div>
              );
            })}
        </div>
        <SubUserCreateForm
          onSubmit={
            isEditing
              ? this.handleSubmitUpdate.bind(this)
              : this.handleSubmit.bind(this)
          }
          onDelete={this.subUserDeleteSubmit.bind(this)}
          onCancel={this.cancelClicked}
          t={t}
          ethnicities={ethnicities}
          locations={locations}
          isEditing={isEditing}
          //onRef={ref => (this.vForm = ref)}
          isDeleting={isDeleting}
          gotoPath={this.props.history.push}
          onRef={ref => (this.FormRef = ref)}
          selectedUser={selectedUser}
          onChangeProfile={onChangeProfile}
          disabled={disabled}
          subUserCreateForm={subUserCreateForm}
          optionSelected={optionSelected}
        />
      </div>
    );
  }
}

Profile = translate("translations")(Profile);

const mapStateToProps = state => ({
  ...state.profile,
  ...state.subUserCreate
  //formSubUserCreate: state.form.formSubUserCreate,
});

const matchDispatchToProps = dispatch =>
  bindActionCreators(
    { ...subUserCreateActions, ...profileUpdateActions, ...profileActions },
    dispatch
  );
export default connect(mapStateToProps, matchDispatchToProps)(Profile);
