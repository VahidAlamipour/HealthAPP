import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { translate } from 'react-i18next';
import { Field, reduxForm } from 'redux-form';
import moment from 'moment';
import _ from 'lodash';
import { Col, Button, Form, FormGroup, Alert } from 'reactstrap';
import { statusEnum } from '../actions/constant';
import { InputText, Dropdown, Loading } from '../components';
import { isLoggedIn, getLoggedInUser } from '../services/AuthenticationService';

import Validations from '../components/Validations';
import profileUpdateActions from '../actions/profileUpdateActions';
import { 
  monthOptions as arrMonthOptions,
  genderOptions,
  getYearOptions,
  getMonthOptionsTrans } from '../components/componentsConstant';

import { getEthnicitiesOptions } from '../services/LookupService';  

import './styles/profile.scss';


let ProfileUpdateForm = props => {
  const t = props.t;
  const yearOptions = getYearOptions();

  // Translate the month label
  const monthOptions = getMonthOptionsTrans(arrMonthOptions);
  let ethnicityOptions = null;
  // Transform the ethnicities from API to array options
  if (props.ethnicities) {
    ethnicityOptions = getEthnicitiesOptions(props.ethnicities);
  }
  const locationOptions = props.locations && props.locations.map((location) => {
    return { value: location, label: location }
  });

  return (
    <Form onSubmit={props.handleSubmit}>
      <FormGroup row>
        <Col>
          <Field component={InputText} type="text" name="first_name"
            placeholder={t('profile.firstname')} validate={Validations.required} />
        </Col>
        <Col>
          <Field component={InputText} type="text" name="last_name"
            placeholder={t('profile.lastname')} validate={Validations.required} />
        </Col>
      </FormGroup>
      <FormGroup row>
        <Col>
          <Field name="birthMonth" component={Dropdown} options={monthOptions}
            placeholder={t('profile.month')} validate={Validations.select_required} />
        </Col>
        <Col>
          <Field name="birthYear" component={Dropdown} options={yearOptions}
            placeholder={t('profile.year')} validate={Validations.select_required} />
        </Col>
      </FormGroup>
      <FormGroup>
        <Field name="gender" component={Dropdown} options={genderOptions}
          placeholder={t('profile.gender')} validate={Validations.select_required} />
      </FormGroup>
      <FormGroup>
        <Field name="address" component={Dropdown} options={locationOptions}
          placeholder={t('profile.address')} validate={Validations.select_required} />
      </FormGroup>
      <FormGroup>
        <Field name="ethnicity" component={Dropdown} options={ethnicityOptions}
          placeholder={t('profile.ethnicity')} />
      </FormGroup>
      <FormGroup>
        <div className="submit2 row justify-content-between">
          <div className="col">
            <Button onClick={props.onCancel}>{t('formCommon.cancel')}</Button>
          </div>
          <div className="col">
            <Button color="primary">{t('formCommon.submit')}</Button>
          </div>
        </div>
      </FormGroup>
    </Form>
  );
};

ProfileUpdateForm = reduxForm({
  form: 'formProfileUpdate',
  enableReinitialize: true
})(ProfileUpdateForm);

ProfileUpdateForm = withRouter(connect(
  state => ({
    initialValues: state.profileUpdate.userForm
  })
)(ProfileUpdateForm));

class ProfileUpdate extends Component {
  constructor(props) {
    super(props);

    this.cancelClicked = this.cancelClicked.bind(this);
  }

  componentWillMount() {
     console.log( "ProfileUpdate::componentWillMount()" );
    this.props.setDefaultState();
  }

  componentDidMount() {
    // Check if login user
    if (!isLoggedIn()) {
      this.props.history.push('/');
    } else {
      this.props.formInitialization(getLoggedInUser()._id, this.props.match.params.id);
    }  
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.status === statusEnum.SUCCESS) {
      setTimeout(() => this.props.history.push('/profile'), 2000);
    }
  }

  handleSubmit(values) {
    const userForm = values;
    const userBirthday = moment(userForm.birthday).format('YYYY-MM-DD');
    const userBirthmonth = userForm.birthMonth.length > 2 ? userForm.birthMonth : '0' + userForm.birthMonth;
    const birthdayString = userForm.birthYear + '-' + userBirthmonth + '-' + userBirthday.substring(8, 10);
    const birthday = moment(birthdayString, 'YYYY-MM-DD').valueOf();
    const user = { ...userForm };
    user.birthday = birthday;

    this.props.updateProfile(user, getLoggedInUser()._id, this.props.match.params.id);
  }

  cancelClicked() {
    this.props.history.push('/profile');
  }

  render() {
    const { isLoading, status, actionResponse, t, mainUser, ethnicities, locations } = this.props;

    return (
      <div>
        <Loading isLoading={isLoading} />
        <div className="row justify-content-center">
          <div className="profile-box col-lg-4 col-md-6">
            {
              status === statusEnum.SUCCESS &&
              <Alert color="success">
                {t('formCommon.update_success')}
              </Alert>
            }
            {
              status === statusEnum.ERROR &&
              <Alert color="danger">
                { actionResponse.message }
              </Alert>
            }
            <h3 className="title">{t('profile.profile_update_title')}</h3>
            <ProfileUpdateForm
              onSubmit={this.handleSubmit.bind(this)} 
              onCancel={this.cancelClicked}
              t={t}
              ethnicities={ethnicities}
              locations={locations}
            />
          </div>
        </div>
      </div>
    );
  }
}

ProfileUpdate = translate('translations')(ProfileUpdate);

const mapStateToProps = state => ({ ...state.profileUpdate });

const matchDispatchToProps = dispatch => (bindActionCreators({ ...profileUpdateActions }, dispatch));

export default connect(mapStateToProps, matchDispatchToProps)(ProfileUpdate);
