import { createSettingDefaultAction } from '../services/ServiceHelper';
import { 
  getUser,
  createSubUser,
  updateProfile,
 } from '../services/UserService';

import { getLocations, getEthnicities } from '../services/LookupService';
import { createActionThunk } from 'redux-thunk-actions';
import { SUB_USER_CREATE_DEFAULT, SUB_USER_INITIALIZATION, SUB_USER_CREATE_SUBMIT } from './constant';

const setDefaultState = createSettingDefaultAction(SUB_USER_CREATE_DEFAULT);
const subUserCreateInitialization = createActionThunk(
  SUB_USER_INITIALIZATION,
  (id) => Promise.all([getUser(id), getLocations(), getEthnicities()])
);
//const subUserCreateSubmit = createActionThunk(SUB_USER_CREATE_SUBMIT, (userId, subUser) => createSubUser(userId, subUser));

export default { setDefaultState, subUserCreateInitialization, /*subUserCreateSubmit*/ };
