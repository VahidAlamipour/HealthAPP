import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { translate } from "react-i18next";
import _ from "lodash";
import { Field, reduxForm, formValueSelector } from "redux-form";
import { Col, Button, Form, FormGroup, Alert } from "reactstrap";
import { statusEnum } from "../actions/constant";
import {
  InputText,
  Dropdown,
  CheckBox,
  Loading,
  Validations,
  VautoComplete
} from "../components";
import ReCAPTCHA from "react-google-recaptcha";
import classNames from "classnames";
import moment from "moment";
import CryptoJS from "crypto-js";
import signUpActions from "../actions/signUpActions";
import {
  monthOptions as arrMonthOptions,
  genderOptions,
  getYearOptions,
  getMonthOptionsTrans
} from "../components/componentsConstant";

import {
  isLoadedFromMobile,
  getCurrentOrientation
} from "../services/MobileService";
import { Orientations } from "./PageConstants";

import { getEthnicitiesOptions } from "../services/LookupService";
import queryString from "../services/QueryStringService";

import "./styles/signupPage.css";

// password validation
const min8 = Validations.min8;
const max15 = Validations.max15;
const minOneUppercase = Validations.min_one_uppercase;
const minOneNumber = Validations.min_one_number;
const minOneSpecial = Validations.min_one_special;
const passChecker = value => {
  var resutl = undefined;
  var final = "";
  resutl = min8(value);
  if (resutl) return resutl;
  resutl = minOneUppercase(value);
  if (resutl) return resutl;
  resutl = minOneNumber(value);
  if (resutl) return resutl;
  resutl = minOneSpecial(value);
  if (resutl) return resutl;
  return "";
};

// TODO:
// might be better be able to put this styling to a CSS
var _linkStyle = {
  color: "blue"
};
var _paragraphStyle = {
  textIndent: "30px"
};

/**
 * A Custom Modal View that appears when user clicks on the Agreeement Link
 */
let AgreementModal = props => {
  const t = props.t;

  //let _msg = t('agreement.MSG_1') + t('agreement.MSG_2') + t('agreement.MSG_3') + t('agreement.MSG_4');

  return (
    <div className="agreement-popup">
      <article>
        <h2>{t("agreement.TITLE")}</h2>
        <div>
          <p className="forgot-title">{t("agreement.LEAD")}</p>
        </div>
        <p>{t("agreement.MSG_1")}</p>
        <p>{t("agreement.MSG_2")}</p>
        <h3>{t("agreement.MSG_3_TITLE")}</h3>
        <p>{t("agreement.MSG_3")}</p>
        <p>{t("agreement.MSG_4")}</p>
        <p>{t("agreement.MSG_5")}</p>
        <h3>{t("agreement.MSG_6_TITLE")}</h3>
        <p>{t("agreement.MSG_7")}</p>
        <h3>{t("agreement.MSG_8_TITLE")}</h3>
        <p>{t("agreement.MSG_9")}</p>
        <h3>{t("agreement.MSG_10_TITLE")}</h3>
        <p>{t("agreement.MSG_11")}</p>
        <h3>{t("agreement.MSG_12_TITLE")}</h3>
        <p>{t("agreement.MSG_13")}</p>
        <p>{t("agreement.MSG_14")}</p>
        <p>{t("agreement.MSG_15")}</p>
        <p>{t("agreement.MSG_16")}</p>
        <br />
      </article>
      <div align="center">
        <a onClick={props.clicked} style={_linkStyle}>
          {t("agreement.UNDERSTAND")}
        </a>
      </div>
    </div>
  );
};
let PrivacyModal = props => {
  const t = props.t;

  //let _msg = t('agreement.MSG_1') + t('agreement.MSG_2') + t('agreement.MSG_3') + t('agreement.MSG_4');

  return (
    <div className="agreement-popup">
      <article>
        <h2>{t("privacy.TITLE")}</h2>
        <p>{t("privacy.MSG_1")}</p>
        <p>{t("privacy.MSG_2")}</p>
        <p>{t("privacy.MSG_3")}</p>
        <p>{t("privacy.MSG_4")}</p>
        <h3>{t("privacy.MSG_5_TITLE")}</h3>
        <p>{t("privacy.MSG_6")}</p>
        <h3>{t("privacy.MSG_7_TITLE")}</h3>
        <p>{t("privacy.MSG_8")}</p>
        <h3>{t("privacy.MSG_9_TITLE")}</h3>
        <p>{t("privacy.MSG_10")}</p>
        <p>{t("privacy.MSG_11")}</p>
        <p>{t("privacy.MSG_12")}</p>
        <h3>{t("privacy.MSG_13_TITLE")}</h3>
        <p>{t("privacy.MSG_14")}</p>
        <br />
      </article>
      <div align="center">
        <a onClick={props.clicked} style={_linkStyle}>
          {t("agreement.UNDERSTAND")}
        </a>
      </div>
    </div>
  );
};
class SignUpForm extends Component {
  constructor(props) {
    super(props);
    this.stateChanger = this.stateChanger.bind(this);
    this.passVlidator = this.passVlidator.bind(this);
    this.captchaOnVerify = this.captchaOnVerify.bind(this);
    this.state = {
      first_nameValidator: "",
      last_nameValidator: "",
      emailValidator: "",
      passwordValidator: "",
      passwordConfirmValidator: "",
      birthMonthValidator: "",
      birthYearValidator: "",
      genderValidator: "",
      addressValidator: "",
      ethnicityValidator: ""
    };
  }
  componentDidMount() {
    this.props.onRef(this);
    this.yearOptions = getYearOptions();
    this.monthOptions = getMonthOptionsTrans(arrMonthOptions);
    let ethnicityOptions = null;
    // Transform the ethnicities from API to array options
  }
  captchaOnVerify() {
    this.props.verifyCaptcha(true);
  }
  stateChanger(key, value) {
    var data = {};
    data[key] = value;
    this.setState(data);
  }
  passVlidator(e) {
    this.setState({ passwordValidator: passChecker(e.currentTarget.value) });
  }
  checkConfirmPass(e) {
    var val =
      this.refs.password.value == undefined ? "" : this.refs.password.value;
    if (e.currentTarget.value != val) {
      this.setState({
        passwordConfirmValidator: this.props.t(
          "signUp.password_confirm_not_match"
        )
      });
    } else {
      this.setState({ passwordConfirmValidator: "" });
    }
  }

  render() {
    const captchaFeedbackClass = classNames({
      "invalid-feedback": true,
      notShow: !this.props.showCaptchaInvalid
    });
    // let ethnicityOptions = [];
    // if (this.props.ethnicities) {
    //    ethnicityOptions = getEthnicitiesOptions(this.props.ethnicities);
    // }
    // const locationOptions = this.props.locations && this.props.locations.map((location) => {
    //    return { value: location, label: location }
    // });
    const isSubmitDisable =
      typeof this.props.is_agreeValue === "undefined" ||
      this.props.is_agreeValue === false;
    return (
      <Form
        onSubmit={this.props.handleSubmit}
        className="signup-form"
        style={{ lineBreak: "0px" }}
        ref="Sform"
      >
        <FormGroup row>
          <Col>
            <Field
              component={InputText}
              type="text"
              name="first_name"
              placeholder={this.props.t("signUp.firstname")}
              //validate={Validations.required}
            />
            {this.state.first_nameValidator && (
              <div className="invalid-feedback">
                {this.state.first_nameValidator}
              </div>
            )}
          </Col>
          <Col>
            <Field
              component={InputText}
              type="text"
              name="last_name"
              placeholder={this.props.t("signUp.lastname")}
              //validate={Validations.required}
            />
            {this.state.last_nameValidator && (
              <div className="invalid-feedback">
                {this.state.last_nameValidator}
              </div>
            )}
          </Col>
        </FormGroup>
        <FormGroup>
          <Field
            component={InputText}
            type="text"
            name="email"
            placeholder={this.props.t("signUp.email_or_phone")}
            //validate={Validations.email_phone}
          />
          {this.state.emailValidator && (
            <div className="invalid-feedback">{this.state.emailValidator}</div>
          )}
        </FormGroup>
        <FormGroup>
          <Field
            component={InputText}
            type="password"
            name="password"
            ref="password"
            placeholder={this.props.t("signUp.password")}
            //validate={[Validations.required, min8, max15, minOneUppercase, minOneNumber, minOneSpecial]}
            onChange={this.passVlidator}
          />
          {this.state.passwordValidator && (
            <div className="invalid-feedback">
              {this.state.passwordValidator}
            </div>
          )}
        </FormGroup>
        <FormGroup>
          <Field
            component={InputText}
            type="password"
            name="passwordConfirm"
            placeholder={this.props.t("signUp.password_confirm")}
            onBlur={this.checkConfirmPass.bind(this)}
            //validate={[Validations.required]}
          />
          {this.state.passwordConfirmValidator && (
            <div className="invalid-feedback">
              {this.state.passwordConfirmValidator}
            </div>
          )}
        </FormGroup>
        <FormGroup row>
          <Col>
            <Field
              name="birthMonth"
              component={Dropdown}
              options={this.monthOptions}
              placeholder={this.props.t("signUp.month")}
              //validate={Validations.select_required}
            />
            {this.state.birthMonthValidator && (
              <div className="invalid-feedback">
                {this.state.birthMonthValidator}
              </div>
            )}
          </Col>
          <Col>
            <Field
              name="birthYear"
              component={Dropdown}
              options={this.yearOptions}
              placeholder={this.props.t("signUp.year")}
              //validate={Validations.select_required}
            />
            {this.state.birthYearValidator && (
              <div className="invalid-feedback">
                {this.state.birthYearValidator}
              </div>
            )}
          </Col>
        </FormGroup>
        <FormGroup>
          <Field
            name="gender"
            component={Dropdown}
            options={genderOptions}
            placeholder={this.props.t("signUp.gender")}
            //validate={Validations.select_required}
          />
          {this.state.genderValidator && (
            <div className="invalid-feedback">{this.state.genderValidator}</div>
          )}
        </FormGroup>
        <FormGroup>
          <Field
            name="location"
            component={VautoComplete}
            placeholder={this.props.t("signUp.address")}
            onChangeText={val => {
              // this.props.onChangeProfile({
              //   target: { name: "address", value: val }
              // });
              this.setState({ location: val });
              window.signup.address = { name: val, _id: "" };
              //this.props.change("address", val);
            }}
            onSelect={val => {
              this.setState({ location: val.name, location_id: val._id });
              window.signup.address = { name: val.name, _id: val._id };
            }}
            val={this.state.location}
            category={"07"}
            level="111111"
            noUser={true}
          />
          {/* <Field
            name="address"
            component={Dropdown}
            options={this.props.locations}
            placeholder={this.props.t("signUp.address")}
            //validate={Validations.select_required}
          /> */}
          {this.state.addressValidator && (
            <div className="invalid-feedback">
              {this.state.addressValidator}
            </div>
          )}
        </FormGroup>
        <FormGroup>
          <Field
            name="ethnicity"
            component={VautoComplete}
            placeholder={this.props.t("signUp.ethnicity")}
            onChangeText={val => {
              this.setState({ ethnicity: val });
              window.signup.ethnicity = { name: val, _id: "" };

              // this.props.onChangeProfile({
              //   target: { name: "ethnicity", value: val }
              // });
            }}
            onSelect={val => {
              this.setState({ ethnicity: val.name, ethnicity_id: val._id });
              window.signup.ethnicity = { name: val.name, _id: val._id };
            }}
            val={this.state.ethnicity}
            category={"21"}
            level="111111"
            noUser={true}
          />
          {/* <Field
            name="ethnicity"
            component={Dropdown}
            options={this.props.ethnicities}
            placeholder={this.props.t("signUp.ethnicity")}
            //validate={Validations.select_required}
          />*/}
          {this.state.ethnicityValidator && (
            <div className="invalid-feedback">
              {this.state.ethnicityValidator}
            </div>
          )}
        </FormGroup>
        <FormGroup>
          <div className="recaptcha">
            <center>
              <ReCAPTCHA
                sitekey={process.env.REACT_APP_RECAPTCHA_API_KEY}
                onChange={this.captchaOnVerify}
              />
            </center>
          </div>
          <div className={captchaFeedbackClass}>
            {this.props.t("signUp.captcha_required")}
          </div>
        </FormGroup>
        <FormGroup>
          <div className="agreement-checkbox">
            <Field component={CheckBox} name="is_agree" />
          </div>
          <div className="agreement-link">
            {this.props.t("signUp.agreement_label")}
            <a
              style={_linkStyle}
              onClick={e => this.props.clicked(e, "agreement")}
            >
              {this.props.t("signUp.agreement_link")}
            </a>
            <span> and </span>
            <a
              style={_linkStyle}
              onClick={e => this.props.clicked(e, "privacy")}
            >
              {this.props.t("signUp.agreement_link_2")}
            </a>
          </div>
        </FormGroup>
        <div className="submit2">
          <Button
            className="button-submit"
            disabled={isSubmitDisable}
            color="primary"
          >
            {this.props.t("formCommon.submit")}
          </Button>
        </div>
        <p>
          {this.props.t("signUp.already_have_account")}
          <Link to="/">{this.props.t("signUp.login_here")}</Link>
        </p>
      </Form>
    );
  }
}

// let SignUpForm = React.forwardRef((props,ref) => {
//   const t = props.t;

//   const yearOptions = getYearOptions();
//   const monthOptions = getMonthOptionsTrans(arrMonthOptions);
//   let ethnicityOptions = null;
//   // Transform the ethnicities from API to array options
//   if (props.ethnicities) {
//     ethnicityOptions = getEthnicitiesOptions(props.ethnicities);
//   }
//   const locationOptions = props.locations && props.locations.map((location) => {
//     return { value: location, label: location }
//   });

//   const isSubmitDisable = typeof props.is_agreeValue === 'undefined' || props.is_agreeValue === false;

//   const captchaFeedbackClass = classNames({
//     'invalid-feedback': true,
//     'notShow': !props.showCaptchaInvalid,
//   });

//   const captchaOnVerify = () => {
//     props.verifyCaptcha(true);
//   };
//   return (
//     <Form onSubmit={props.handleSubmit} className="signup-form" style={{lineBreak:"0px"}} ref={ref}>
//       <FormGroup row>
//         <Col>
//           <Field component={InputText} type="text" name="first_name"
//             placeholder={t('signUp.firstname')}
//             validate={Validations.required}
//             />
//         </Col>
//         <Col>
//           <Field component={InputText} type="text" name="last_name"
//             placeholder={t('signUp.lastname')}
//             validate={Validations.required}
//             />
//         </Col>
//       </FormGroup>
//       <FormGroup>
//         <Field component={InputText} type="text" name="email"
//           placeholder={t('signUp.email_or_phone')}
//           validate={Validations.email_phone}
//           />
//       </FormGroup>
//       <FormGroup>
//         <Field component={InputText} type="password" name="password"
//           placeholder={t('signUp.password')}
//           validate={[Validations.required, min8, max15, minOneUppercase, minOneNumber, minOneSpecial]}
//           />
//       </FormGroup>
//       <FormGroup>
//         <Field component={InputText} type="password" name="passwordConfirm"
//           placeholder={t('signUp.password_confirm')}
//           validate={[Validations.required]}
//           />
//       </FormGroup>
//       <FormGroup row>
//         <Col>
//           <Field name="birthMonth" component={Dropdown} options={monthOptions}
//             placeholder={t('signUp.month')}
//             validate={Validations.select_required}
//             />
//         </Col>
//         <Col>
//           <Field name="birthYear" component={Dropdown} options={yearOptions}
//             placeholder={t('signUp.year')}
//             validate={Validations.select_required}
//             />
//         </Col>
//       </FormGroup>
//       <FormGroup>
//         <Field name="gender" component={Dropdown} options={genderOptions}
//           placeholder={t('signUp.gender')}
//           validate={Validations.select_required}
//            />
//       </FormGroup>
//       <FormGroup>
//         <Field name="address" component={Dropdown} options={locationOptions}
//           placeholder={t('signUp.address')}
//           validate={Validations.select_required}
//            />
//       </FormGroup>
//       <FormGroup>
//         <Field name="ethnicity" component={Dropdown} options={ethnicityOptions}
//           placeholder={t('signUp.ethnicity')}
//           validate={Validations.select_required}
//           />
//       </FormGroup>
//       <FormGroup>
//          <div className="recaptcha">
//             <center>
//                <ReCAPTCHA
//                   sitekey={process.env.REACT_APP_RECAPTCHA_API_KEY}
//                   onChange={captchaOnVerify}
//                />
//             </center>
//         </div>
//         <div className={captchaFeedbackClass}>
//           {t('signUp.captcha_required')}
//         </div>
//       </FormGroup>
//       <FormGroup>
//             <div className="agreement-checkbox">
//                <Field component={CheckBox} name="is_agree" />
//             </div>
//             <div className="agreement-link">
//                {t('signUp.agreement_label')}
//                <a style={_linkStyle} onClick={props.clicked}>{t('signUp.agreement_link')}</a>
//             </div>
//       </FormGroup>
//       <div className="submit2">
//         <Button type='button' className="button-submit" onClick={props.beforSubmit}
//         disabled={isSubmitDisable} color="primary">{t('formCommon.submit')}</Button>
//       </div>
//       <p>
//         {t('signUp.already_have_account')}<Link to="/">{t('signUp.login_here')}</Link>
//       </p>
//     </Form>
//   );
// });

SignUpForm = reduxForm({
  form: "formSignUp",
  enableReinitialize: true
})(SignUpForm);

// Decorate with connect to read form values
const selector = formValueSelector("formSignUp");
SignUpForm = connect(state => ({
  initialValues: state.signUp.formInitial,
  // can select values individually
  is_agreeValue: selector(state, "is_agree")
}))(SignUpForm);

class SignUp extends Component {
  constructor(props) {
    super(props);
    //this.signupFormRef = React.createRef();
    this.state = {
      showCaptchaInvalid: false,
      isCaptchaValid: false,
      showAgreement: "",
      submitFlag: false
    };
    this.handleToggle = this.handleToggle.bind(this);
    window.signup = {};
  }

  componentWillMount() {
    /*const values = queryString.parse(this.props.location.search);
      if (typeof values.redirectUrl !== 'undefined') {
         console.log( "redirectUrl:" + values.redirectUrl );
         this.redirectUrl = window.decodeURIComponent(values.redirectUrl);
         console.log( "decoded redirectUrl:" + this.redirectUrl );
         setTimeout(() => { window.location = this.redirectUrl}, 2000);
      }else{
        console.log( "didn't find a redirectUrl" );
        console.log( "props:" + JSON.stringify(this.props.location) );
        console.log( "values:" + JSON.stringify(values) );
        //window.close();
      }*/
  }

  componentDidMount() {
    this.props.setDefaultState();
    const values = queryString.parse(this.props.location.search);
    let formInitial = null;
    var _encKey = process.env.REACT_APP_ENCRYPTION_KEY;
    // form
    if (typeof values.formInitial !== "undefined") {
      if (_encKey !== undefined) {
        var _strToDec = window.decodeURIComponent(values.formInitial);
        var _bytes = CryptoJS.AES.decrypt(_strToDec, _encKey);
        var _decStr = _bytes.toString(CryptoJS.enc.Utf8);
        try {
          formInitial = JSON.parse(_decStr);
        } catch (err) {
          formInitial = null;
        }
      } else {
        formInitial = JSON.parse(window.decodeURIComponent(values.formInitial));
      }
    }

    // the redirectUrl
    if (typeof values.redirectUrl !== "undefined" && formInitial !== null) {
      //this.redirectUrl = window.decodeURIComponent(values.redirectUrl);

      var _strToDec = window.decodeURIComponent(values.redirectUrl);
      var _bytes = CryptoJS.AES.decrypt(_strToDec, _encKey);
      this.redirectUrl = _bytes.toString(CryptoJS.enc.Utf8);

      //console.log("SignUp::componentDidMount(), Redirect URL:" + this.redirectUrl );
    } else if (
      typeof values.redirectUrl !== "undefined" &&
      formInitial !== null
    ) {
      setTimeout(() => {
        window.location = process.env.REACT_APP_SIGNUP_REDIRECT_ERROR_URL;
      }, 0);
    }

    this.props.formInitialization(formInitial);
  }

  componentWillReceiveProps(nextProps) {
    //console.log("SignUp::componentWillReceiveProps(), nextProps.response:" + JSON.stringify(nextProps.response) );
    if (nextProps.status === statusEnum.SUCCESS) {
      if (typeof this.redirectUrl !== "undefined") {
        // The redirect URL received from the server already have payload passed
        // so we append a new payload value for the verification of the user
        var _strToEnc = nextProps.response._id + "|" + nextProps.response.email;
        var _encStr = CryptoJS.AES.encrypt(
          _strToEnc,
          process.env.REACT_APP_ENCRYPTION_KEY
        );
        var _newRedirectUrl =
          this.redirectUrl +
          "&" +
          process.env.REACT_APP_SERVER_USER_SIGNUP_FINISHED_PAYLOAD2_NAME +
          "=" +
          window.encodeURIComponent(_encStr);
        //setTimeout(() => { window.location = this.redirectUrl}, 2000);
        //setTimeout(() => { window.location = _newRedirectUrl}, 2000);
      } else {
        //setTimeout(() => this.props.history.push('/'), 2000);
      }
    }
  }
  handleSubmit(values) {
    console.log("injaSub: ", window.signup);
    //validation
    var validationFlag = true;
    var {
      first_name,
      last_name,
      email,
      password,
      passwordConfirm,
      birthMonth,
      birthYear,
      gender
    } = values;
    let address = window.signup.address;
    let ethnicity = window.signup.ethnicity;
    if (first_name == undefined || first_name == null || first_name == "") {
      this.signupFormRef.stateChanger("first_nameValidator", "required");
      validationFlag = false;
    } else {
      this.signupFormRef.stateChanger("first_nameValidator", "");
    }
    if (last_name == undefined || last_name == null || last_name == "") {
      this.signupFormRef.stateChanger("last_nameValidator", "required");
      validationFlag = false;
    } else {
      this.signupFormRef.stateChanger("last_nameValidator", "");
    }
    if (email == undefined || email == null || email == "") {
      this.signupFormRef.stateChanger("emailValidator", "required");
      validationFlag = false;
    } else {
      var emailvalidation = Validations.email_phone(email);
      if (emailvalidation) {
        this.signupFormRef.stateChanger("emailValidator", emailvalidation);
        validationFlag = false;
      } else {
        this.signupFormRef.stateChanger("emailValidator", "");
      }
    }
    if (password == undefined || password == null || password == "") {
      this.signupFormRef.stateChanger("passwordValidator", "required");
      validationFlag = false;
    } else {
      var passFinally = passChecker(password);
      if (passFinally) {
        this.signupFormRef.stateChanger("passwordValidator", passFinally);
        validationFlag = false;
      } else {
        this.signupFormRef.stateChanger("passwordValidator", "");
      }
    }
    if (
      passwordConfirm == undefined ||
      passwordConfirm == null ||
      passwordConfirm == ""
    ) {
      this.signupFormRef.stateChanger("passwordConfirmValidator", "required");
      validationFlag = false;
    } else {
      if (password !== passwordConfirm) {
        this.signupFormRef.stateChanger(
          "passwordConfirmValidator",
          this.props.t("signUp.password_confirm_not_match")
        );
        validationFlag = false;
      } else {
        this.signupFormRef.stateChanger("passwordConfirmValidator", "");
      }
    }
    if (birthMonth == undefined || birthMonth == null || birthMonth == "") {
      this.signupFormRef.stateChanger("birthMonthValidator", "required");
      validationFlag = false;
    } else {
      this.signupFormRef.stateChanger("birthMonthValidator", "");
    }
    if (birthYear == undefined || birthYear == null || birthYear == "") {
      this.signupFormRef.stateChanger("birthYearValidator", "required");
      validationFlag = false;
    } else {
      this.signupFormRef.stateChanger("birthYearValidator", "");
    }
    if (gender == undefined || gender == null || gender == "") {
      this.signupFormRef.stateChanger("genderValidator", "required");
      validationFlag = false;
    } else {
      this.signupFormRef.stateChanger("genderValidator", "");
    }
    if (address == undefined || address == null || !address.name) {
      this.signupFormRef.stateChanger("addressValidator", "required");
      validationFlag = false;
    } else {
      this.signupFormRef.stateChanger("addressValidator", "");
    }

    if (ethnicity == undefined || ethnicity == null || !ethnicity.name) {
      this.signupFormRef.stateChanger("ethnicityValidator", "required");
      validationFlag = false;
    } else {
      this.signupFormRef.stateChanger("ethnicityValidator", "");
    }
    if (!validationFlag) return;
    //end validation

    // if (values.password !== values.passwordConfirm) {
    //    this.props.submitValidation(this.props.t('password_confirm_not_match'));
    // }
    if (!this.state.isCaptchaValid) {
      this.setState({ showCaptchaInvalid: true });
    } else {
      const user = values;
      user.address = window.signup.address;
      user.ethnicity = window.signup.ethnicity;
      user.birthday = {
        month: values.birthMonth,
        year: values.birthYear
      };

      // const birthday = values.birthYear + "-" + values.birthMonth + "-" + "02";
      // user.birthday = moment(birthday, "YYYY-MM-DD").valueOf();
      this.props.signUpSubmit(user);
    }
  }

  setCaptchaStatus(isValid) {
    this.setState({ showCaptchaInvalid: !isValid });
    this.setState({ isCaptchaValid: isValid });
  }

  cancelClicked() {
    this.props.history.push("/");
  }

  handleToggle(e, type) {
    if (!type) {
      this.setState({ showAgreement: "" });
    } else if (type === "agreement") {
      this.setState({
        showAgreement: (
          <AgreementModal t={this.props.t} clicked={this.handleToggle} />
        )
      });
    } else if (type === "privacy") {
      this.setState({
        showAgreement: (
          <PrivacyModal t={this.props.t} clicked={this.handleToggle} />
        )
      });
    }
  }

  render() {
    const {
      isLoading,
      status,
      actionResponse,
      t,
      ethnicities,
      locations
    } = this.props;
    var _pageFitter = "vPage";
    //  if( isLoadedFromMobile() || getCurrentOrientation()===Orientations.PORTRAIT ){
    //    _pageFitter="page-fitter-mobile-signup";
    //  }else{
    //    _pageFitter="page-fitter-signup";
    //  }

    console.log("inja: ", this.props);
    return (
      <div className={_pageFitter}>
        <div className="">
          {this.state.showAgreement}
          {/* {
                  this.state.showAgreement &&
                  <AgreementModal
                     t={t}
                     clicked={this.handleToggle.bind(this)}
                  />
               } */}
          <Loading isLoading={false} />
          <div className="justify-content-center">
            <div /*className="login-box col-lg-4 col-md-6"*/>
              {/* <p className="forgot-title">{t('signUp.title')}</p> */}
              {status === statusEnum.SUCCESS && (
                <Alert color="success">{t("signUp.register_success")}</Alert>
              )}
              {status === statusEnum.ERROR && (
                <Alert color="danger">{actionResponse.message}</Alert>
              )}
              <SignUpForm
                onRef={ref => (this.signupFormRef = ref)}
                //ref={element => this.signupFormRef = element}
                onSubmit={this.handleSubmit.bind(this)}
                onCancel={this.cancelClicked.bind(this)}
                clicked={this.handleToggle.bind(this)}
                verifyCaptcha={this.setCaptchaStatus.bind(this)}
                showCaptchaInvalid={this.state.showCaptchaInvalid}
                t={t}
                ethnicities={ethnicities}
                locations={locations}
                submitFlag={this.state.submitFlag}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

SignUp = translate("translations")(SignUp);

const mapStateToProps = state => ({ ...state.signUp });

const matchDispatchToProps = dispatch =>
  bindActionCreators({ ...signUpActions }, dispatch);

export default connect(mapStateToProps, matchDispatchToProps)(SignUp);
