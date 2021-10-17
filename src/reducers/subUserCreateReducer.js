import moment from "moment";

import {
  getFailed,
  getStarted,
  getSucceeded,
  getEnded,
  statusEnum,
  SUB_USER_CREATE_DEFAULT,
  SUB_USER_INITIALIZATION
  //SUB_USER_CREATE_SUBMIT
} from "../actions/constant";

import {
  getMonthFromDate,
  getYearFromDate
} from "../components/componentsConstant";

const initialState = {
  isLoading: false,
  status: statusEnum.DEFAULT,
  actionResponse: null,
  ethnicities: null,
  locations: null
};

// Profile update reducer
function reducer(state = initialState, action) {
  switch (action.type) {
    case SUB_USER_CREATE_DEFAULT:
      return initialState;
    //case getStarted(SUB_USER_CREATE_SUBMIT):
    case getStarted(SUB_USER_INITIALIZATION):
      return { ...state, isLoading: true };
    case getSucceeded(SUB_USER_INITIALIZATION):
      // const userBirthday = moment(action.payload[0].birthday).format(
      //   "YYYY-MM-DD"
      // );
      // const user = {
      //   ...action.payload[0],
      //   birthYear: getYearFromDate(userBirthday),
      //   birthMonth: getMonthFromDate(userBirthday)
      // };
      //const locations = action.payload[1].countries_cities;
      const locations = action.payload[1];
      const ethnicities = action.payload[2];
      return {
        ...state,
        ethnicities: ethnicities,
        locations: locations
      };
    //   case getSucceeded(SUB_USER_CREATE_SUBMIT):
    //     return { ...state, status: statusEnum.SUCCESS };
    //   case getFailed(SUB_USER_CREATE_SUBMIT):
    //     return { ...state, actionResponse: action.payload, status: statusEnum.ERROR };
    //   case getEnded(SUB_USER_CREATE_SUBMIT):
    case getEnded(SUB_USER_INITIALIZATION):
      return { ...state, isLoading: false };
    default:
      return state;
  }
}

export default reducer;
