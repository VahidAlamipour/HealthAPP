import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { Field, reduxForm } from 'redux-form';
import moment from 'moment';
import { Col, Button, Form, FormGroup, Alert } from 'reactstrap';
import { statusEnum } from '../actions/constant';
import { InputText, Dropdown, Loading, Validations } from '../components';
import { isLoggedIn } from '../services/AuthenticationService';
import { getLoggedInUser } from '../services/AuthenticationService';

import subUserCreateActions from '../actions/subUserCreateActions';
import { 
  monthOptions as arrMonthOptions,
  genderOptions,
  getYearOptions,
  getMonthOptionsTrans } from '../components/componentsConstant';

import { getEthnicitiesOptions } from '../services/LookupService';    

import './styles/profile.scss';


let SubUserCreateForm = props => {
  const t = props.t;
  const yearOptions = getYearOptions();
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
          <Field name="birthMonth" component={Dropdown} options={monthOptions} className="birthMonth"
            placeholder={t('profile.month')} validate={Validations.select_required} />
        </Col>
        <Col>
          <Field name="birthYear" component={Dropdown} options={yearOptions} className="birthYear"
            placeholder={t('profile.year')} validate={Validations.select_required} />
        </Col>
      </FormGroup>
      <FormGroup>
        <Field name="gender" component={Dropdown} options={genderOptions} className="gender"
          placeholder={t('profile.gender')} validate={Validations.select_required} />
      </FormGroup>
      <FormGroup>
        <Field name="address" component={Dropdown} options={locationOptions} className="address"
          placeholder={t('profile.address')} />
      </FormGroup>
      <FormGroup>
        <Field name="ethnicity" component={Dropdown} options={ethnicityOptions} className="ethnicity"
          placeholder={t('profile.ethnicity')}/>
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

SubUserCreateForm = reduxForm({
  form: 'formSubUserCreate'
})(SubUserCreateForm);

class SubUserCreate extends Component {
  constructor(props) {
    super(props);
    this.cancelClicked = this.cancelClicked.bind(this);
  }
  
  componentWillMount() {
    this.loggedInUser = getLoggedInUser();
    this.props.setDefaultState();
  }

  componentDidMount() {
    // Check if login user
    if (!isLoggedIn()) {
      this.props.history.push('/');
    }
    else {
      this.props.subUserCreateInitialization(this.loggedInUser._id);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.status === statusEnum.SUCCESS) {
      setTimeout(() => this.props.history.push('/dashboard'), 2000);
    }
  }

  handleSubmit(values) {
    const mainUser = this.props.user;
    const newUser = values;
    const userBirthday = moment(newUser.birthday).format('YYYY-MM-DD');
    const userBirthmonth = newUser.birthMonth.length > 2 ? newUser.birthMonth : '0' + newUser.birthMonth;
    const birthdayString = newUser.birthYear + '-' + userBirthmonth + '-' + userBirthday.substring(8, 10);
    newUser.birthday = moment(birthdayString, 'YYYY-MM-DD').valueOf();

    this.props.subUserCreateSubmit(mainUser._id, newUser);
  }

  cancelClicked() {
    this.props.history.push('/dashboard');
  }

  render() {
    const { isLoading, status, actionResponse, t, ethnicities, locations } = this.props;
    console.log(locations);
    return (
      <div className="page-wrapper">
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
            {/*<h3 className="title">{t('profile.sub_user_create_title')}</h3>*/}
            <SubUserCreateForm
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

SubUserCreate = translate('translations')(SubUserCreate);

const mapStateToProps = state => ({ ...state.subUserCreate });

const matchDispatchToProps = dispatch => (bindActionCreators({ ...subUserCreateActions }, dispatch));

export default connect(mapStateToProps, matchDispatchToProps)(SubUserCreate);
