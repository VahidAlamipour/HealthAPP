import { createSettingDefaultAction } from '../services/ServiceHelper';
import { 
  getUser as getUserService,
  updateProfile as updateProfileService,
  updateSubUser,
  formUpdateInitialization as formUpdateInitializationService
 } from '../services/UserService';
import { createActionThunk } from 'redux-thunk-actions';
import { PROFILE_UPDATE_DEFAULT, PROFILE_UPDATE_INITIALIZATION, PROFILE_UPDATE_GET_USER, PROFILE_UPDATE_SUBMIT } from './constant';

const setDefaultState = createSettingDefaultAction(PROFILE_UPDATE_DEFAULT);
const formInitialization = createActionThunk(PROFILE_UPDATE_INITIALIZATION, (mainId, userId) => formUpdateInitializationService(mainId, userId));
const getUser = createActionThunk(PROFILE_UPDATE_GET_USER, (id) => getUserService(id));
// const updateProfile = createActionThunk(PROFILE_UPDATE_SUBMIT, (user, mainId, userId) => {
//   mainId === userId ? updateProfileService(user) : updateSubUser(mainId, user)  
// });

export default { setDefaultState, formInitialization, getUser, /*updateProfile*/ };