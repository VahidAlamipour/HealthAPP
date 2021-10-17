import {
  getFailed,
  getStarted,
  getSucceeded,
  getEnded,
  statusEnum,
  CHANGE_PASSWORD_DEFAULT,
  CHANGE_PASSWORD_SUBMIT,
  CHANGE_PASSWORD_SUBMIT_VALIDATION
} from '../actions/constant';

const initialState = {
  isLoading: false,
  status: statusEnum.DEFAULT,
  actionResponse: null
};

// Change password reducer
function reducer(state = initialState, action) {
  switch (action.type) {
  case CHANGE_PASSWORD_DEFAULT:
    return initialState;    
  case getStarted(CHANGE_PASSWORD_SUBMIT):
    return { ...state, isLoading: true };
  case getSucceeded(CHANGE_PASSWORD_SUBMIT):
    return { ...state, status: statusEnum.SUCCESS };
  case getFailed(CHANGE_PASSWORD_SUBMIT):
    return { ...state, actionResponse: action.payload, status: statusEnum.ERROR };
  case getEnded(CHANGE_PASSWORD_SUBMIT):
    return { ...state, isLoading: true };
  case CHANGE_PASSWORD_SUBMIT_VALIDATION:
    return { ...state, actionResponse: { message: action.message }, status: statusEnum.ERROR };   
  default:
    return state;
  }
}

export default reducer;
