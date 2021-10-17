import { createSettingDefaultAction } from "../services/ServiceHelper";
import {
  getUserWithMainUserAndSubUsers as getUserAndSubUsersService,
  updateSubUser,
  updateProfile as updateProfileService,
  updateUserAndSubuser,
  createSubUser,
  deleteSubUser
} from "../services/UserService";
import { changePassword } from "../services/LoginService";
import { createActionThunk } from "redux-thunk-actions";
import {
  PROFILE_DEFAULT,
  PROFILE_GET_USER_AND_SUBUSERS,
  PROFILE_SUBMIT,
  PROFILE_EDIT_SELECTED,
  PROFILE_UPDATE_SUBMIT,
  SUB_USER_CREATE_SUBMIT,
  SUB_USER_DELETE_SUBMIT,
  CHANGE_PASSWORD_SUBMIT,
  ON_CHANGE_PROFILE_FORM,
  PROFILE_LIST_RESET,
  PROFILE_OPTION_SELECTED
} from "./constant";
import { reset } from "redux-form";
import { getUser } from "../services/UserService";

const setDefaultState = createSettingDefaultAction(PROFILE_DEFAULT);
const getUserWithMainUserAndSubUsers = createActionThunk(
  PROFILE_GET_USER_AND_SUBUSERS,
  id => getUser(id)
);
const editUserItem = (index, selectedIndex, item) => {
  return dispatch => {
    dispatch({
      type: PROFILE_EDIT_SELECTED,
      index: index
    });
    dispatch(reset("formSubUserCreate"));
  };
};
const resetPage = () => {
  return dispatch => {
    dispatch({
      type: PROFILE_LIST_RESET
    });
  };
};
const onChangeProfile = e => {
  return async dispatch => {
    dispatch({
      type: ON_CHANGE_PROFILE_FORM,
      event: e
    });
  };
};
const updateProfile = createActionThunk(
  PROFILE_UPDATE_SUBMIT,
  (user, MainUser, userId) => updateUserAndSubuser(MainUser, user)
);
const subUserCreateSubmit = createActionThunk(
  SUB_USER_CREATE_SUBMIT,
  (userId, subUser) => createSubUser(userId, subUser)
);
const subUserDeleteSubmit = createActionThunk(
  SUB_USER_DELETE_SUBMIT,
  (userId, subUserId) => deleteSubUser(userId, subUserId)
);
const changePasswordSubmit = createActionThunk(
  CHANGE_PASSWORD_SUBMIT,
  passwords => changePassword(passwords)
);
const optionSelected = (data, type) => {
  return async dispatch => {
    dispatch({
      type: PROFILE_OPTION_SELECTED,
      item: data,
      inputType: type
    });
  };
};

export default {
  setDefaultState,
  getUserWithMainUserAndSubUsers,
  updateProfile,
  editUserItem,
  subUserCreateSubmit,
  subUserDeleteSubmit,
  changePasswordSubmit,
  resetPage,
  onChangeProfile,
  optionSelected
};
