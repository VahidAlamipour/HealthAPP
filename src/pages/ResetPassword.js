import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { translate } from 'react-i18next';
import { Button, Form, FormGroup, Alert } from 'reactstrap';
import { statusEnum } from '../actions/constant';
import { InputText, Loading, Validations } from '../components';
import resetPasswordActions from '../actions/resetPasswordActions';

import './styles/homePage.css';

// password validation
const required = Validations.required;
const min8 = Validations.min8;
const max15 = Validations.max15;
const minOneUppercase = Validations.min_one_uppercase;
const minOneNumber = Validations.min_one_number;
const minOneSpecial = Validations.min_one_special;

let ResetPasswordForm = props => {
  const { t } = props;

  return (
    <Form onSubmit={props.handleSubmit}>
      <FormGroup>
        <Field component={InputText} type="password" name="password"
          placeholder={t('reset.new_password')} validate={[required, min8, max15]} />
      </FormGroup>
      <FormGroup>
        <Field component={InputText} type="password" name="passwordConfirm"
          placeholder={t('reset.new_password_confirm')} 
          validate={[Validations.required, min8, max15, minOneUppercase, minOneNumber, minOneSpecial]} />
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

ResetPasswordForm = reduxForm({
  form: 'formResetPassword'
})(ResetPasswordForm);

class ResetPassword extends Component {

  componentWillReceiveProps(nextProps) {
    if (nextProps.status === statusEnum.SUCCESS) {
      setTimeout(() => this.props.history.push('/'), 2000);
    }
  }

  componentWillMount() {
    this.props.setDefaultState();
  }

  handleSubmit(values) {
    if (values.password !== values.passwordConfirm) {
      this.props.submitValidation(this.props.t('reset.password_confirm_not_match'));
    }
    else {
      this.props.resetPasswordSubmit(values);
    }
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
            <p className="forgot-title">{t('reset.title')}</p>
            {
              status === statusEnum.SUCCESS &&
              <Alert color="success">
                {t('formCommon.submit_success_message')}
              </Alert>
            }
            {
              status === statusEnum.ERROR &&
              <Alert color="danger">
                { actionResponse.message }
              </Alert>
            }
            <ResetPasswordForm 
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

ResetPassword = translate('translations')(ResetPassword);

const mapStateToProps = state => ({ ...state.resetPassword });

const matchDispatchToProps = dispatch => (bindActionCreators({ ...resetPasswordActions }, dispatch));

export default connect(mapStateToProps, matchDispatchToProps)(ResetPassword);
