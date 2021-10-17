import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { translate } from 'react-i18next';
import { Button, Form, FormGroup, Alert } from 'reactstrap';
import { statusEnum } from '../actions/constant';
import { InputText, Validations, Loading } from '../components';
import changePasswordActions from '../actions/changePasswordActions';
import { getLoggedInUser } from '../services/AuthenticationService';

// password validation
const required = Validations.required;
const min8 = Validations.min8;
const max15 = Validations.max15;
const minOneUppercase = Validations.min_one_uppercase;
const minOneNumber = Validations.min_one_number;
const minOneSpecial = Validations.min_one_special;

let ChangePasswordForm = props => {
  const { t } = props;

  return (
    <Form onSubmit={props.handleSubmit}>
      <h3 className="forgot-title">{t('reset.old_password_title')}</h3>
      <FormGroup>
        <Field component={InputText} type="password" name="old_password"
          placeholder={t('reset.old_password')} validate={[required]} />
      </FormGroup>
      <h3 className="forgot-title">{t('reset.title')}</h3>
      <FormGroup>
        <Field component={InputText} type="password" name="new_password"
          placeholder={t('reset.new_password')}
          validate={[Validations.required, min8, max15, minOneUppercase, minOneNumber, minOneSpecial]}/>
      </FormGroup>
      <FormGroup>
        <Field component={InputText} type="password" name="confirm_password"
          placeholder={t('reset.new_password_confirm')} validate={[required]} />
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

ChangePasswordForm = reduxForm({
  form: 'formChangePassword'
})(ChangePasswordForm);

class ChangePassword extends Component {
  componentWillMount() {
    this.props.setDefaultState();
  }

  componentWillReceiveProps(nextProps) {
    if (typeof nextProps.status !== 'undefined') {
      this.setState({ status: nextProps.status });
    }
    if (nextProps.status === statusEnum.SUCCESS) {
      setTimeout(() => this.props.history.push('/dashboard'), 2000);
    }
  }

  handleSubmit(values) {
    if (values.new_password !== values.confirm_password) {
      this.props.submitValidation(this.props.t('reset.password_confirm_not_match'));
    }
    else {
      const currUser = getLoggedInUser();
      values.email = currUser.email;
      this.props.changePasswordSubmit(values);
    }
  }

  cancelClicked() {
    this.props.history.push('/profile');
  }

  render() {
    const { isLoading, status, actionResponse, t } = this.props;

    return (
      <div className="vPage">
        <Loading isLoading={isLoading} />
          <div className="login-box">
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
            <ChangePasswordForm 
              onSubmit={this.handleSubmit.bind(this)} 
              onCancel={this.cancelClicked.bind(this)}
              t={t}
            />
          </div>
      </div>
    );
  }
}

ChangePassword = translate('translations')(ChangePassword);

const mapStateToProps = state => ({ ...state.changePassword });

const matchDispatchToProps = dispatch => (bindActionCreators({ ...changePasswordActions }, dispatch));

export default connect(mapStateToProps, matchDispatchToProps)(ChangePassword);
