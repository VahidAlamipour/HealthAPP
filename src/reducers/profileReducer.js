import moment from "moment";
import {
  getFailed,
  getStarted,
  getSucceeded,
  getEnded,
  statusEnum,
  PROFILE_DEFAULT,
  PROFILE_GET_USER_AND_SUBUSERS,
  PROFILE_SUBMIT,
  PROFILE_EDIT_SELECTED,
  PROFILE_UPDATE_SUBMIT,
  SUB_USER_CREATE_SUBMIT,
  SUB_USER_DELETE_SUBMIT,
  CHANGE_PASSWORD_SUBMIT,
  PROFILE_LIST_RESET,
  ON_CHANGE_PROFILE_FORM,
  PROFILE_OPTION_SELECTED
} from "../actions/constant";
import {
  getMonthFromDate,
  getYearFromDate
} from "../components/componentsConstant";

const initialState = {
  isLoading: false,
  status: statusEnum.DEFAULT,
  actionResponse: null,
  user: null,
  mainUser: null,
  subUsers: null,
  isEditing: false,
  allUsers: [],
  selectedIndex: -1,
  subUserCreateForm: {},
  disabled: {
    addBtn: true,
    clearBtn: true
  }
};
function disableCheckerProfilePage(state) {
  let disabled = {
    addBtn: true,
    clearBtn: true
  };
  if (
    state.subUserCreateForm.first_name &&
    state.subUserCreateForm.last_name &&
    state.subUserCreateForm.birthMonth &&
    state.subUserCreateForm.birthYear &&
    state.subUserCreateForm.gender &&
    state.subUserCreateForm.ethnicity &&
    state.subUserCreateForm.address
  ) {
    disabled.addBtn = false;
  }
  if (
    state.subUserCreateForm.first_name ||
    state.subUserCreateForm.last_name ||
    (state.subUserCreateForm.birthMonth &&
      state.subUserCreateForm.birthMonth != "null") ||
    (state.subUserCreateForm.birthYear &&
      state.subUserCreateForm.birthYear != "null") ||
    (state.subUserCreateForm.gender &&
      state.subUserCreateForm.gender != "null") ||
    (state.subUserCreateForm.address &&
      state.subUserCreateForm.address != "null") ||
    (state.subUserCreateForm.ethnicity &&
      state.subUserCreateForm.ethnicity != "null")
  ) {
    disabled.clearBtn = false;
  }
  return disabled;
}

// Profile reducer
function reducer(state = initialState, action) {
  let allUsers = [];
  let selectedIndex = -1;
  let isEditing = false;
  switch (action.type) {
    case PROFILE_DEFAULT:
      return initialState;
    case getStarted(PROFILE_GET_USER_AND_SUBUSERS):
      return { ...state, isLoading: true };
    case getSucceeded(PROFILE_GET_USER_AND_SUBUSERS):
      // const mainuserBirthday = moment(action.payload.birthday).format(
      //   "YYYY-MM-DD"
      // );
      const mainuser = {
        ...action.payload,
        // birthYear: getYearFromDate(mainuserBirthday),
        // birthMonth: getMonthFromDate(mainuserBirthday)
        birthYear: action.payload.birthday.year,
        birthMonth: action.payload.birthday.month,
        ethnicity_id: action.payload.ethnicity._id,
        ethnicity: action.payload.ethnicity.name,
        address_id: action.payload.address._id,
        address: action.payload.address.name
      };
      let user = mainuser;
      var subUsers = [];
      if (action.payload.sub_users !== undefined) {
        subUsers =
          action.payload.sub_users &&
          action.payload.sub_users.map(value => {
            //const subUserBirthday = moment(value.birthday).format("YYYY-MM-DD");
            return {
              ...value,
              // birthYear: getYearFromDate(subUserBirthday),
              // birthMonth: getMonthFromDate(subUserBirthday)
              birthYear: value.birthday.year,
              birthMonth: value.birthday.month,
              ethnicity_id: value.ethnicity._id,
              ethnicity: value.ethnicity.name,
              address_id: value.address._id,
              address: value.address.name
            };
          });

        // user = subUsers.find(value => {
        //   return value._id === action.payload[1];
        // });
        // user = user ? user : mainuser;
      }

      // const userBirthday = moment(user.birthday).format("YYYY-MM-DD");
      // user.birthYear = getYearFromDate(userBirthday);
      // user.birthMonth = getMonthFromDate(userBirthday);
      // this values are returned to the Profile.js
      // in the render method of the Component
      // under the <ProfileView> tag
      return {
        ...state,
        user: user,
        mainUser: mainuser,
        subUsers: subUsers,
        allUsers: [user, ...subUsers]
      };
    case getSucceeded(PROFILE_SUBMIT):
      return { ...state, status: statusEnum.SUCCESS };
    case getFailed(PROFILE_GET_USER_AND_SUBUSERS):
      console.log(
        "profielReducers::reducer():PROFILE_GET_USER_AND_SUBUSERS_FAILED"
      );
      return { ...state, actionResponse: action.payload };
    case getEnded(PROFILE_GET_USER_AND_SUBUSERS):
      console.log(
        "profielReducers::reducer():PROFILE_GET_USER_AND_SUBUSERS_ENDED"
      );
      return { ...state, isLoading: false };
    case PROFILE_EDIT_SELECTED:
      selectedIndex = action.index;
      allUsers = [...state.allUsers];
      let profileSelected = { ...allUsers[selectedIndex] };

      for (const profile of allUsers) {
        profile.isSelected = false;
      }
      allUsers[selectedIndex].isSelected = true;
      isEditing = true;
      if (selectedIndex === state.selectedIndex) {
        profileSelected = {};
        allUsers[selectedIndex].isSelected = false;
        selectedIndex = -1;
        isEditing = false;
      }
      return {
        ...state,
        allUsers: allUsers,
        isEditing,
        selectedIndex: selectedIndex,
        disabled: disableCheckerProfilePage(state),
        subUserCreateForm: { ...profileSelected }
      };
    case getStarted(PROFILE_UPDATE_SUBMIT):
      return { ...state, isLoading: true };
    case getSucceeded(PROFILE_UPDATE_SUBMIT):
      var users = state.allUsers;
      var changedIndex = null;
      users.forEach((element, index) => {
        if (element._id === action.payload[0]._id) {
          changedIndex = index;
        }
      });
      // const updateduserBirthday = moment(action.payload[0].birthday).format(
      //   "YYYY-MM-DD"
      // );
      const updateduser = {
        ...action.payload[0],
        birthYear: action.payload[0].birthday.year,
        birthMonth: action.payload[0].birthday.month,
        ethnicity_id: action.payload[0].ethnicity._id,
        ethnicity: action.payload[0].ethnicity.name,
        address_id: action.payload[0].address._id,
        address: action.payload[0].address.name
        // birthYear: getYearFromDate(updateduserBirthday),
        // birthMonth: getMonthFromDate(updateduserBirthday)
      };
      updateduser.isSelected = true;
      users[changedIndex] = updateduser;
      var changeCounter = state.changeCounter ? state.changeCounter + 1 : 1;
      return {
        ...state,
        statusPU: statusEnum.SUCCESS,
        allUsers: users,
        isLoading: false,
        changeCounter: changeCounter
      };
    case getFailed(PROFILE_UPDATE_SUBMIT):
      return { ...state, actionResponse‌PU: action.payload };
    case getEnded(PROFILE_UPDATE_SUBMIT):
      return {
        ...state,
        isLoading: false,
        statusPU: undefined,
        actionResponse‌PU: undefined
      };
    case getStarted(SUB_USER_CREATE_SUBMIT):
    case getSucceeded(SUB_USER_CREATE_SUBMIT):
      if (action.payload._id) {
        //action.payload.isSelected = true;
        // const newuserBirthday = moment(action.payload.birthday).format(
        //   "YYYY-MM-DD"
        // );
        const newduser = {
          ...action.payload,
          birthYear: action.payload.birthday.year,
          birthMonth: action.payload.birthday.month,
          ethnicity_id: action.payload.ethnicity._id,
          ethnicity: action.payload.ethnicity.name,
          address_id: action.payload.address._id,
          address: action.payload.address.name
          // birthYear: getYearFromDate(newuserBirthday),
          // birthMonth: getMonthFromDate(newuserBirthday)
        };
        var users = [...state.allUsers, newduser];

        var changeCounter = state.changeCounter ? state.changeCounter + 1 : 1;
        return {
          ...state,
          status: statusEnum.SUCCESS,
          allUsers: users,
          isLoading: false,
          changeCounter: changeCounter
        };
      }
    case getFailed(SUB_USER_CREATE_SUBMIT):
      return {
        ...state,
        actionResponse: action.payload,
        status: statusEnum.ERROR
      };
    case getEnded(SUB_USER_CREATE_SUBMIT):
    case getStarted(SUB_USER_DELETE_SUBMIT):
    case getSucceeded(SUB_USER_DELETE_SUBMIT):
      if (action.payload.deletedId) {
        var users = state.allUsers;
        var changedIndex = null;
        users.forEach((element, index) => {
          if (element._id === action.payload.deletedId) {
            changedIndex = index;
          }
        });
        users.splice(changedIndex, 1);
        var changeCounter = state.changeCounter ? state.changeCounter + 1 : 1;
        return {
          ...state,
          status: statusEnum.SUCCESS,
          allUsers: users,
          subUserCreateForm: null,
          isLoading: false,
          changeCounter: changeCounter,
          isEditing: false
        };
      }
    case getFailed(SUB_USER_DELETE_SUBMIT):
      return {
        ...state,
        actionResponse: action.payload,
        status: statusEnum.ERROR
      };
    case getEnded(SUB_USER_DELETE_SUBMIT):
    case getStarted(CHANGE_PASSWORD_SUBMIT):
      return { ...state, isLoading: true };
    case getSucceeded(CHANGE_PASSWORD_SUBMIT):
      return { ...state, statusCHP: statusEnum.SUCCESS };
    case getFailed(CHANGE_PASSWORD_SUBMIT):
      return {
        ...state,
        actionResponseCHP: action.payload,
        statusCHP: statusEnum.ERROR
      };
    case getEnded(CHANGE_PASSWORD_SUBMIT):
      return {
        ...state,
        isLoading: true,
        actionResponseCHP: undefined,
        statusCHP: undefined
      };
    case PROFILE_LIST_RESET:
      allUsers = [...state.allUsers];
      state.subUserCreateForm = {
        birthMonth: "",
        birthYear: "",
        gender: "",
        address: "",
        ethnicity: ""
      };
      for (const profile of allUsers) {
        profile.isSelected = false;
      }
      selectedIndex = -1;
      isEditing = false;
      return {
        ...state,
        allUsers,
        selectedIndex,
        isEditing
      };
    case ON_CHANGE_PROFILE_FORM:
      state.subUserCreateForm[action.event.target.name] =
        action.event.target.value;
      if (state.subUserCreateForm[action.event.target.name] == "address") {
        state.subUserCreateForm["address_id"] = "";
      }
      if (state.subUserCreateForm[action.event.target.name] == "ethnicity") {
        state.subUserCreateForm["ethnicity_id"] = "";
      }
      return {
        ...state,
        disabled: disableCheckerProfilePage(state),
        counterState: state.counterState + 1
      };
    case PROFILE_OPTION_SELECTED:
      var currentForm = { ...state.subUserCreateForm };
      if (action.inputType == "address") {
        currentForm.address = action.item.name;
        currentForm.address_id = action.item._id;
      } else {
        currentForm.ethnicity = action.item.name;
        currentForm.ethnicity_id = action.item._id;
      }
      return {
        ...state,
        subUserCreateForm: currentForm,
        disabled: disableCheckerProfilePage(state),
        counterState: state.counterState + 1
      };
    default:
      return state;
  }
}

export default reducer;
