import {
  getFailed,
  getStarted, 
  getSucceeded,
  getEnded,
  statusEnum,
  FORGOT_PASSWORD_SET_DEFAULT,
  FORGOT_PASSWORD_SUBMIT
} from '../actions/constant';

const initialState = {
  isLoading: false,
  status: statusEnum.DEFAULT,
  actionResponse: null
};

// Forgot password reducer
function reducer(state = initialState, action) {
  switch (action.type) {
  case FORGOT_PASSWORD_SET_DEFAULT:
    return initialState;
  case getStarted(FORGOT_PASSWORD_SUBMIT):
    return { ...state, isLoading: true };
  case getSucceeded(FORGOT_PASSWORD_SUBMIT):
    return { ...state, status: statusEnum.SUCCESS };
  case getFailed(FORGOT_PASSWORD_SUBMIT):
    return { ...state, actionResponse: action.payload, status: statusEnum.ERROR };
  case getEnded(FORGOT_PASSWORD_SUBMIT):
    return { ...state, isLoading: false };
  default:
    return state;
  }
}

export default reducer;
