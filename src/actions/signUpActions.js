import { createSettingDefaultAction } from '../services/ServiceHelper';
import { signUp } from '../services/UserService';
import { getLocations, getEthnicities } from '../services/LookupService';
import { createActionThunk } from 'redux-thunk-actions';
import { SIGN_UP_DEFAULT, SIGN_UP_INITIALIZATION, SIGN_UP_SUBMIT, SIGN_UP_SUBMIT_VALIDATION } from './constant';

const setDefaultState = createSettingDefaultAction(SIGN_UP_DEFAULT);
const formInitialization = createActionThunk(
  SIGN_UP_INITIALIZATION, 
  (formInitialValues) => Promise.all([getLocations(), getEthnicities(), formInitialValues])
);
const signUpSubmit = createActionThunk(SIGN_UP_SUBMIT, (user) => signUp(user));

const submitValidation = (message) => 
{
  return dispatch => {
    dispatch({
      type: SIGN_UP_SUBMIT_VALIDATION,
      message: message
    });
  };
};

export default { setDefaultState, formInitialization, signUpSubmit, submitValidation };
