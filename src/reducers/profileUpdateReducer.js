import moment from 'moment';

import {
  getFailed,
  getStarted, 
  getSucceeded,
  getEnded,
  statusEnum,
  PROFILE_UPDATE_DEFAULT,
  PROFILE_UPDATE_INITIALIZATION,
  PROFILE_UPDATE_GET_USER,
  PROFILE_UPDATE_SUBMIT
} from '../actions/constant';

import { getMonthFromDate, getYearFromDate } from '../components/componentsConstant';
import { getLoggedInUser } from '../services/AuthenticationService';

const initialState = {
  isLoading: false,
  status: statusEnum.DEFAULT,
  actionResponse: null,
  user: null,
  ethnicities: null,
  locations: null
};

// Profile update reducer
function reducer(state = initialState, action) {
  switch (action.type) {
  case PROFILE_UPDATE_DEFAULT:
    return initialState;  
  case getStarted(PROFILE_UPDATE_INITIALIZATION):
  case getStarted(PROFILE_UPDATE_SUBMIT):
    return { ...state, isLoading: true };
  case getSucceeded(PROFILE_UPDATE_INITIALIZATION):
    const userId = action.payload[3];
    const mainUserBirthday = moment(action.payload[0].birthday).format('YYYY-MM-DD');
    const mainUser = { ... action.payload[0],
      birthYear: getYearFromDate(mainUserBirthday),
      birthMonth: getMonthFromDate(mainUserBirthday)
    };
    let userForm = { ...mainUser };
    const locations = action.payload[1].countries_cities;
    const ethnicities = action.payload[2].item;
    return { ...state, mainUser: mainUser, userForm: userForm, ethnicities: ethnicities, locations: locations };
  case getSucceeded(PROFILE_UPDATE_SUBMIT):
    return { ...state, status: statusEnum.SUCCESS };
  case getFailed(PROFILE_UPDATE_INITIALIZATION):
  case getFailed(PROFILE_UPDATE_SUBMIT):
    return { ...state, actionResponse: action.payload };
  case getEnded(PROFILE_UPDATE_INITIALIZATION):
  case getEnded(PROFILE_UPDATE_SUBMIT):
    return { ...state, isLoading: false };
  default:
    return state;
  }
}

export default reducer;
