import { createSettingDefaultAction } from '../services/ServiceHelper';
import { resetPassword } from '../services/LoginService';
import { createActionThunk } from 'redux-thunk-actions';
import { RESET_PASSWORD_DEFAULT, RESET_PASSWORD_SUBMIT, RESET_PASSWORD_SUBMIT_VALIDATION } from './constant';

const setDefaultState = createSettingDefaultAction(RESET_PASSWORD_DEFAULT);
const resetPasswordSubmit = createActionThunk(RESET_PASSWORD_SUBMIT, (passwords) => resetPassword(passwords));

const submitValidation = (message) => {
  return dispatch => {
    dispatch({
      type: RESET_PASSWORD_SUBMIT_VALIDATION,
      message: message
    });
  };
};

export default { setDefaultState, resetPasswordSubmit, submitValidation };
