import { createSettingDefaultAction } from '../services/ServiceHelper';
import { forgotPassword } from '../services/LoginService';
import { createActionThunk } from 'redux-thunk-actions';
import { FORGOT_PASSWORD_SET_DEFAULT, FORGOT_PASSWORD_SUBMIT } from './constant';

const setDefaultState = createSettingDefaultAction(FORGOT_PASSWORD_SET_DEFAULT);
const forgotPasswordSubmit = createActionThunk(FORGOT_PASSWORD_SUBMIT, (email) => forgotPassword(email));

export default { setDefaultState, forgotPasswordSubmit };
