import {
  getFailed,
  getStarted,
  getSucceeded,
  getEnded,
  statusEnum,
  SIGN_UP_DEFAULT,
  SIGN_UP_INITIALIZATION,
  SIGN_UP_SUBMIT,
  SIGN_UP_SUBMIT_VALIDATION
} from "../actions/constant";

const initialState = {
  isLoading: false,
  status: statusEnum.DEFAULT,
  actionResponse: null,
  ethnicities: null,
  locations: null
};

// Sign up reducer
function reducer(state = initialState, action) {
  switch (action.type) {
    case SIGN_UP_DEFAULT:
      return initialState;
    case getStarted(SIGN_UP_INITIALIZATION): //SIGN_UP_INITIALIZATION_STARTED
    case getStarted(SIGN_UP_SUBMIT):
      return { ...state, isLoading: true };
    case getSucceeded(SIGN_UP_INITIALIZATION):
      const locations = action.payload[0];
      const ethnicities = action.payload[1];
      const formInitial = action.payload[2];
      const newState = {
        ...state,
        ethnicities: ethnicities,
        locations: locations
      };
      if (formInitial !== null) {
        newState.formInitial = formInitial;
      }
      //console.log("signUpReducer::reducer()::SIGN_UP_INITIALIZATION, New State:"+JSON.stringify(newState));
      return newState;

    case getSucceeded(SIGN_UP_SUBMIT):
      return { ...state, response: action.payload, status: statusEnum.SUCCESS };

    case getFailed(SIGN_UP_SUBMIT):
      console.log("signUpReducer::reducer(), SIGN_UP_SUBMIT_FAILED");
      return {
        ...state,
        actionResponse: action.payload,
        status: statusEnum.ERROR
      };

    case getEnded(SIGN_UP_INITIALIZATION):
    case getEnded(SIGN_UP_SUBMIT):
      return { ...state, isLoading: false };
    case SIGN_UP_SUBMIT_VALIDATION:
      return {
        ...state,
        actionResponse: { message: action.message },
        status: statusEnum.ERROR
      };
    default:
      return state;
  }
}

export default reducer;
