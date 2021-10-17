import {
  getFailed,
  getStarted,
  getSucceeded,
  getEnded,
  statusEnum,
  RESET_PASSWORD_DEFAULT,
  RESET_PASSWORD_SUBMIT,
  RESET_PASSWORD_SUBMIT_VALIDATION
} from '../actions/constant';

const initialState = {
  isLoading: false,
  status: statusEnum.DEFAULT,
  actionResponse: null
};

// Reset password reducer
function reducer(state = initialState, action) {
  switch (action.type) {
  case RESET_PASSWORD_DEFAULT:
    return initialState;  
  case getStarted(RESET_PASSWORD_SUBMIT):
    return { ...state, isLoading: true };
  case getSucceeded(RESET_PASSWORD_SUBMIT):
    return { ...state, status: statusEnum.SUCCESS };
  case getFailed(RESET_PASSWORD_SUBMIT):
    return { ...state, actionResponse: action.payload, status: statusEnum.ERROR };
  case getEnded(RESET_PASSWORD_SUBMIT):
    return { ...state, isLoading: false }
  case RESET_PASSWORD_SUBMIT_VALIDATION:
    return { ...state, actionResponse: { message: action.message }, status: statusEnum.ERROR };  
  default:
    return state;
  }
}

export default reducer;
