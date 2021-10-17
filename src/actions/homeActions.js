import { createSettingDefaultAction } from '../services/ServiceHelper';
import { authenticate, activeUser as activeUserService } from '../services/LoginService';
import { createActionThunk } from 'redux-thunk-actions';
import { getFailed, LOGIN_SET_DEFAULT, LOGIN_SUBMIT, ACTIVE_USER } from './constant';

const setDefaultState = createSettingDefaultAction(LOGIN_SET_DEFAULT);
const loginSubmit = createActionThunk(LOGIN_SUBMIT, (user) => authenticate(user, user.isRememberMe));

const activeUser = (e, callback) => {
   let data = e;
   return async (dispatch) => {
      // console.log(e);
      // return true;
      try {
         let data = await activeUserService(e);
         callback({ status: true, data });
         return;
         // dispatch({
         //    type: ACTIVE_USER,
         //    item: data
         // });
         // dispatch(reset('formRecipeIngredient'));
      }
      catch (e) {
         callback({ status: false, data: e });
         return;
      }
   }
}

export default { setDefaultState, loginSubmit, activeUser };
