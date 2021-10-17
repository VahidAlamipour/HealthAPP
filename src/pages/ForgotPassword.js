import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { translate } from 'react-i18next';
import { Button, Form, FormGroup, Alert } from 'reactstrap';
import { InputText, Validations, Loading } from '../components';
import { statusEnum } from '../actions/constant';
import forgotPasswordActions from '../actions/forgotPasswordActions';
import { getApiUrl } from '../services/ServiceHelper';
import queryString from '../services/QueryStringService';

import { isLoadedFromMobile, getCurrentOrientation } from '../services/MobileService';
import { Orientations } from './PageConstants';

import './styles/homePage.css';

let ForgotPasswordForm = props => {
   const { t } = props;

   return (
      <Form onSubmit={props.handleSubmit}>
         <FormGroup>
            <Field component={InputText} type="text" name="email"
               placeholder={t('formCommon.email_or_phone')} validate={[Validations.required, Validations.email_phone]} />
         </FormGroup>
         <div className="submit2 row justify-content-between">
            <div className="col">
               <Button className="button-submit" onClick={props.onCancel}>{t('formCommon.cancel')}</Button>
            </div>
            <div className="col">
               <Button className="button-submit" color="primary">{t('formCommon.submit')}</Button>
            </div>
         </div>
      </Form>
   );
};

ForgotPasswordForm = reduxForm({
   form: 'formForgotPassword'
})(ForgotPasswordForm);

class ForgotPassword extends Component {
   componentDidMount() {
      const values = queryString.parse(this.props.location.search);
      if (values.email && values.key) {
         this.props.history.push({
            pathname: '/forgotpasswordreset',
            state: { values: values }
          })
         //this.props.history.push({ pathname: `/forgotpasswordreset`, state: { values: values } });
      }
   }
   componentWillReceiveProps(nextProps) {
      if (nextProps.status === statusEnum.SUCCESS) {
         //setTimeout(() => this.props.history.push('/'), 2000);
      }
   }

   componentWillMount() {
      this.props.setDefaultState();
   }

   handleSubmit(values) {
      const getUrl = window.location;
      const baseUrl = getUrl.protocol + '//' + getUrl.host;

      const user = values;
      user.step = 1;
      user.forgot_password_site_url = baseUrl + '/forgotpasswordreset';
      this.props.forgotPasswordSubmit(user);
   }

   cancelClicked() {
      this.props.history.push('/');
   }

   render() {
      const { isLoading, status, actionResponse, t } = this.props;
      var _pageFitter;
      if (isLoadedFromMobile() || getCurrentOrientation() === Orientations.PORTRAIT) {
         _pageFitter = "page-fitter-mobile";
      } else {
         _pageFitter = "page-fitter-non-navbar";
      }

      return (
         <div className={_pageFitter}>
            <div className="page-wrapper">
               <Loading isLoading={isLoading} />
               <div className="row justify-content-center">
                  <div className="login-box col-lg-4 col-md-6">
                     <p className="forgot-title">{t('forgot.title')}</p>
                     {
                        status === statusEnum.SUCCESS &&
                        <Alert color="success">
                           {t('forgot.checkmail')}
                        </Alert>
                     }
                     {
                        status === statusEnum.ERROR &&
                        <Alert color="danger">
                           {actionResponse.message}
                        </Alert>
                     }
                     <ForgotPasswordForm
                        onSubmit={this.handleSubmit.bind(this)}
                        onCancel={this.cancelClicked.bind(this)}
                        t={t}
                     />
                  </div>
               </div>
            </div>
         </div>
      );
   }
}

ForgotPassword = translate('translations')(ForgotPassword);

const mapStateToProps = state => ({ ...state.forgotPassword });

const matchDispatchToProps = dispatch => (bindActionCreators({ ...forgotPasswordActions }, dispatch));

export default connect(mapStateToProps, matchDispatchToProps)(ForgotPassword);
