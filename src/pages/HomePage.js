import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Field, reduxForm } from "redux-form";
import { translate } from "react-i18next";
import { Button, Form, FormGroup, Alert, Label } from "reactstrap";
import { statusEnum } from "../actions/constant";
import { InputText, Loading, Validations } from "../components";
import homeActions from "../actions/homeActions";
import { isLoggedIn, getAccessToken } from "../services/AuthenticationService";
import queryString from "../services/QueryStringService";
import CryptoJS from "crypto-js";

import {
  isLoadedFromMobile,
  getCurrentOrientation
} from "../services/MobileService";
import { Orientations } from "./PageConstants";
import "./styles/homePage.css";

const REDIRECT_URL_KEY = "redirectUrl";

let LoginForm = props => {
  const { t } = props;

  return (
    <Form onSubmit={props.handleSubmit} /*autoComplete="off"*/>
      <FormGroup>
        <Field
          component={InputText}
          type="text"
          name="email"
          className="email"
          placeholder={t("formCommon.email_or_phone")}
          validate={[Validations.required, Validations.email_phone]}
        />
      </FormGroup>
      <FormGroup>
        <Field
          component={InputText}
          type="password"
          name="password"
          placeholder={t("formCommon.password")}
          validate={[Validations.required]}
        />
      </FormGroup>
      <FormGroup>
        <Label className="login-container" check>
          <Field component="input" type="checkbox" name="isRememberMe" />{" "}
          {t("home.keep_login")}
          <span className="login-checkmark" />
        </Label>
      </FormGroup>
      <FormGroup>
        <Button className="button-submit" color="primary">
          {t("home.login")}
        </Button>
      </FormGroup>
      <p>
        {t("home.not_a_member")}{" "}
        <Link to="/signup">{t("home.sign_up_now")}</Link>
      </p>
      <p>
        <Link to="/forgotpassword">{t("home.forgot_password")}</Link>
      </p>
    </Form>
  );
};

LoginForm = reduxForm({
  form: "formLogin",
  touchOnBlur: false
})(LoginForm);

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageActive: false,
      pageActiveColor: "",
      pageActiveMessage: ""
    };
  }
  getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }
  componentWillMount() {
    const values = queryString.parse(this.props.location.search);
    var _encKey = process.env.REACT_APP_ENCRYPTION_KEY;
    console.log(
      "HomePage::componentWillMount(), values:" + JSON.stringify(values)
    );
    // Check if login user
    if (isLoggedIn() && typeof values.redirectUrl === "undefined") {
      this.props.history.push("/dashboard");
    } else {
      if (typeof values.redirectUrl !== "undefined") {
        var _strToDec = window.decodeURIComponent(values.redirectUrl);
        var _bytes = CryptoJS.AES.decrypt(_strToDec, _encKey);
        //this.redirectUrl = _bytes.toString( CryptoJS.enc.Utf8 );

        localStorage.setItem(
          REDIRECT_URL_KEY,
          _bytes.toString(CryptoJS.enc.Utf8)
        );
        console.log(
          "HomePage::componentWillMount(), Redirect URL:" +
            localStorage.getItem(REDIRECT_URL_KEY)
        );
      }
    }
    this.props.setDefaultState();
  }
  componentDidMount() {
    var code = this.getParameterByName("code");
    var subscriber = this.getParameterByName("subscriber");
    var mainthis = this;
    if (code && subscriber) {
      this.props.activeUser({ code, subscriber }, data => {
        var comp = "";
        if (data.status) {
          mainthis.setState({
            pageActive: true,
            pageActiveColor: "success",
            pageActiveMessage: data.data.message
          });
        } else {
          mainthis.setState({
            pageActive: false,
            pageActiveColor: "danger",
            pageActiveMessage: data.data.message
          });
        }
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    /*if (nextProps.status === statusEnum.SUCCESS)
      {
        setTimeout(() => this.props.history.push('/dashboard'), 2000);
      }*/
    if (nextProps.status === statusEnum.SUCCESS) {
      var _redirectUrl = localStorage.getItem(REDIRECT_URL_KEY);
      console.log(
        "HomePage::componentWillReceiveProps(), _redirectUrl:" + _redirectUrl
      );
      if (_redirectUrl !== null || _redirectUrl !== undefined) {
        //localStorage.removeItem( REDIRECT_URL_KEY );

        // might be used in the future if user data also needs to be returned back
        // to the chat application
        //var _userData = localStorage.getItem( 'user' );
        //console.log("HomePage::componentWillReceiveProps(), _userData:" + JSON.stringify(_userData) );

        var _encStr = CryptoJS.AES.encrypt(
          getAccessToken(),
          process.env.REACT_APP_ENCRYPTION_KEY
        );
        console.log(
          "HomePage::componentWillReceiveProps(), getAccessToken():" +
            getAccessToken()
        );
        _redirectUrl =
          _redirectUrl +
          "&" +
          process.env.REACT_APP_SERVER_USER_LOGIN_FINISHED_PAYLOAD3_NAME +
          "=" +
          window.encodeURIComponent(_encStr);

        setTimeout(() => {
          window.location = _redirectUrl;
        }, 1000);
      } else {
        setTimeout(() => this.props.history.push("/dashboard"), 2000);
      }
    }
  }

  handleSubmit(values) {
    this.props.loginSubmit(values);
  }

  render() {
    const { isLoading, status, actionResponse, t } = this.props;
    // var _pageFitter;
    // if (isLoadedFromMobile() || getCurrentOrientation() === Orientations.PORTRAIT) {
    //    _pageFitter = "page-fitter-mobile";
    // } else {
    //    _pageFitter = "page-fitter-non-navbar";
    // }
    var _pageFitter = "vPage";
    return (
      <div className={_pageFitter}>
        <div className="page-wrapper">
          <Loading isLoading={isLoading} />
          <div className="justify-content-center">
            <div className="login-box">
              {/* <h3 className="welcome-title">{t('home.welcome')}</h3> */}
              {/*
               status === statusEnum.SUCCESS &&
               <Alert color="success">
                  {t('home.login_success')}
               </Alert>
               */}
              <div>
                {status !== statusEnum.ERROR && this.state.pageActive && (
                  <Alert color={this.state.pageActiveColor}>
                    {this.state.pageActiveMessage}
                  </Alert>
                )}
              </div>
              {status === statusEnum.ERROR && (
                <Alert color="danger">{actionResponse.message}</Alert>
              )}
              <LoginForm onSubmit={this.handleSubmit.bind(this)} t={t} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

HomePage = translate("translations")(HomePage);

const mapStateToProps = state => ({ ...state.home });

const matchDispatchToProps = dispatch =>
  bindActionCreators({ ...homeActions }, dispatch);

export default connect(mapStateToProps, matchDispatchToProps)(HomePage);
