import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { translate } from 'react-i18next';
import { Button, Form, FormGroup, Alert } from 'reactstrap';
import { InputText, Validations, Loading } from '../components';
import { statusEnum } from '../actions/constant';
import forgotPasswordResetActions from '../actions/forgotPasswordResetActions';

import './styles/homePage.css';

// password validation
const required = Validations.required;
const min8 = Validations.min8;
const max15 = Validations.max15;
const minOneUppercase = Validations.min_one_uppercase;
const minOneNumber = Validations.min_one_number;
const minOneSpecial = Validations.min_one_special;

let ForgotPasswordForm = props => {
   const { t } = props;

   return (
      <Form onSubmit={props.handleSubmit}>
         <FormGroup>
            <Field component={InputText} type="password" name="new_password"
               placeholder={t('reset.new_password')}
               validate={[required, min8, max15, minOneUppercase, minOneNumber, minOneSpecial]} />
         </FormGroup>
         <FormGroup>
            <Field component={InputText} type="password" name="confirm_password"
               placeholder={t('reset.new_password_confirm')}
               validate={[required]} />
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
   }
   componentWillReceiveProps(nextProps) {
      if (nextProps.status === statusEnum.SUCCESS) {
         setTimeout(() => this.props.history.push('/'), 2000);
      }
   }
   componentWillMount() {
      this.props.setDefaultState();
   }
   handleSubmit(values) {
      const user = values;
      const params = new URLSearchParams(this.props.location.search);
      const email = params.get('user');
      const key = params.get('key');
      //const email = this.props.location.state.values.email;
      //const key = this.props.location.state.values.key;
      user.step = 2;
      user.email = email;
      user.key = key;
      this.props.forgotPasswordResetSubmit(user);
   }

   cancelClicked() {
      this.props.history.push('/');
   }

   render() {
      const { isLoading, status, actionResponse, t } = this.props;
      return (
         <div>
            <Loading isLoading={isLoading} />
            <div className="row justify-content-center">
               <div className="login-box col-lg-4 col-md-6">
                  <p className="forgot-title">{t('forgot.step2title')}</p>
                  {
                     status === statusEnum.SUCCESS &&
                     <Alert color="success">
                        {t('formCommon.submit_success_message')}
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
      );
   }
}

ForgotPassword = translate('translations')(ForgotPassword);

const mapStateToProps = state => ({ ...state.forgotPasswordReset });

const matchDispatchToProps = dispatch => (bindActionCreators({ ...forgotPasswordResetActions }, dispatch));

export default connect(mapStateToProps, matchDispatchToProps)(ForgotPassword);
