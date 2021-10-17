import { createSettingDefaultAction } from '../services/ServiceHelper';
import { changePassword } from '../services/LoginService';
import { createActionThunk } from 'redux-thunk-actions';
import { CHANGE_PASSWORD_DEFAULT, CHANGE_PASSWORD_SUBMIT, CHANGE_PASSWORD_SUBMIT_VALIDATION } from './constant';

const setDefaultState = createSettingDefaultAction(CHANGE_PASSWORD_DEFAULT);
const changePasswordSubmit = createActionThunk(CHANGE_PASSWORD_SUBMIT, (passwords) => changePassword(passwords));

const submitValidation = (message) => {
  return dispatch => {
    dispatch({
      type: CHANGE_PASSWORD_SUBMIT_VALIDATION,
      message: message
    });
  };
};

export default { setDefaultState, changePasswordSubmit, submitValidation };
