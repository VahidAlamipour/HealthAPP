import { createSettingDefaultAction } from '../services/ServiceHelper';
import { forgotPasswordReset } from '../services/LoginService';
import { createActionThunk } from 'redux-thunk-actions';
import { FORGOT_PASSWORD_RESET_SET_DEFAULT, FORGOT_PASSWORD_RESET_SUBMIT } from './constant';

const setDefaultState = createSettingDefaultAction(FORGOT_PASSWORD_RESET_SET_DEFAULT);
const forgotPasswordResetSubmit = createActionThunk(
  FORGOT_PASSWORD_RESET_SUBMIT, 
  (resetForm) => forgotPasswordReset(resetForm)
);

export default { setDefaultState, forgotPasswordResetSubmit };
