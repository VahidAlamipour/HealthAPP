import {
  getFailed,
  getStarted, 
  getSucceeded,
  getEnded,
  statusEnum,
  LOGIN_SET_DEFAULT,
  LOGIN_SUBMIT
} from '../actions/constant';

import { setAccessToken } from '../services/AuthenticationService';

const initialState = {
  isLoading: false,
  status: statusEnum.DEFAULT,
  actionResponse: null
};

// Home reducer
function reducer(state = initialState, action)
{
  switch (action.type)
  {
      case LOGIN_SET_DEFAULT:
         return initialState;

      case getStarted(LOGIN_SUBMIT):
         return { ...state, isLoading: true };

      case getSucceeded(LOGIN_SUBMIT):
         try
         {
            setAccessToken(action.payload.authData.access_token, action.payload.isRememberMe);
            localStorage.setItem('user', JSON.stringify(action.payload.userData));
            return { ...state, status: statusEnum.SUCCESS };
         }
         catch(err)
         {
            return { ...state, actionResponse: action.payload, status: statusEnum.ERROR };
         }

      case getFailed(LOGIN_SUBMIT):
         console.log("hodeReducer::reducer()::LOGIN_SUBMIT_FAILED, action.payload:" + JSON.stringify(action.payload));
         return { ...state, actionResponse: action.payload, status: statusEnum.ERROR };

      case getEnded(LOGIN_SUBMIT):
         return { ...state, isLoading: false }
      case 'ACTIVE_USER':
            return {...state};
      default:
         return state;
  }
}

export default reducer;