import {
  getFailed,
  getStarted,
  getSucceeded,
  getEnded,
  GET_SYMPTOM_USERS,
  SYMPTOM_USER_SELECTED,
  SYMPTOM_CATEGORY_SELECTED,
  CLEAR_SYMPTOM,
  SEARCH_SYMPTOM_OPTIONS,
  SYMPTOM_DATE_CHANGED,
  SYMPTOM_OPTION_SELECTED,
  CREATE_SYMPTOM,
  INPUT_ADD_ITEM,
  ON_CHANGE_SYMPTOMFORM,
  SAVE_FOOD_AND_SYMPTOMS,
  SYPTOMS_ITEM_SELECT,
  SYMPTOMS_ITEM_DELETE,
  SYMPTOMS_ITEM_UPDATE,
  RESET_INPUT_PAGE
} from "../actions/constant";
import { UNITS_WHEN_CATEGORY_IS_FOOD } from "../pages/Constants";
import { uuidv4 } from "../services/PublicService";
import _ from "lodash";
import { SYMPTOM_UNITS } from "../actions/constant";
import moment from "moment";
//import DateTime from "react-datetime";
//import React from "react";
//import { stat } from 'fs';
//import { CommunicationPresentToAll } from 'material-ui/svg-icons';

const initialState = {
  isLoading: false,
  users: [],
  nameOptions: [],
  nameTotalOptions: [],
  categories: [],
  disabled: {
    category: true,
    input: true,
    scale: true,
    name: true,
    time: true,
    addBtn: true,
    saveBtn: true,
    clearBtn: true,
    unit: true,
    comment: true
  },
  classNames: {
    UsersBox: "",
    nameField: ""
  },
  scaleOptions: [],
  unitOptions: [],
  symptomForm: { users: [] },
  showList: [],
  //selectedList: [],
  deleteMode: false,
  updateMode: false,
  selectedItem: {},
  amountReseter: false,
  amounNewValue: null,
  counterState: 0,
  selectedIndexList: [],
  updatedList: false
};

function reducer(state = initialState, action) {
  function removeA(arr) {
    var what,
      a = arguments,
      L = a.length,
      ax;
    while (L > 1 && arr.length) {
      what = a[--L];
      while ((ax = arr.indexOf(what)) !== -1) {
        arr.splice(ax, 1);
        break;
      }
    }
    return arr;
  }
  function buttonsChecker() {
    var addBtn = true;
    if (state.symptomForm.users && state.symptomForm.users.length > 0) {
      state.disabled.category = false;
      state.classNames.UsersBox = "";
    } else {
      state.disabled.category = true;
      state.classNames.UsersBox = "blinking";
    }
    if (
      !state.disabled.category &&
      state.symptomForm.category &&
      state.symptomForm.category != "null"
    ) {
      state.disabled.name = false;
    } else {
      state.disabled.name = true;
    }
    if (
      !state.disabled.name &&
      state.symptomForm.name &&
      state.symptomForm.name.length > 1
    ) {
      state.disabled.scale = false;
    } else {
      state.disabled.scale = true;
    }
    if (
      !state.disabled.name &&
      state.symptomForm.name &&
      state.symptomForm.name.length > 1 &&
      state.unitOptions &&
      state.unitOptions.length > 0
    ) {
      state.disabled.unit = false;
    } else {
      state.disabled.unit = true;
    }
    if (
      !state.disabled.name &&
      state.symptomForm.name &&
      state.symptomForm.name.length > 1
    ) {
      state.disabled.time = false;
      state.disabled.comment = false;
    } else {
      state.disabled.time = true;
      state.disabled.comment = true;
    }
    if (
      state.symptomForm.users &&
      state.symptomForm.users.length > 0 &&
      state.symptomForm.category &&
      state.symptomForm.category != "null" &&
      state.symptomForm.scale &&
      state.symptomForm.name &&
      state.symptomForm.name.length > 1 &&
      state.symptomForm.time
    ) {
      if (state.disabled.unit == true) {
        addBtn = false;
      } else if (state.symptomForm.unit && state.symptomForm.unit != "null") {
        addBtn = false;
      } else {
        addBtn = true;
      }
    }
    // clear Button
    if (
      (state.symptomForm.category && state.symptomForm.category != "null") ||
      state.symptomForm.scale ||
      state.symptomForm.name ||
      state.showList.length > 0
    ) {
      state.disabled.clearBtn = false;
    } else {
      state.disabled.clearBtn = true;
    }

    if (state.showList.length > 0) {
      state.updatedList = true;
      window.changeData = true;
      state.disabled.saveBtn = false;
    } else {
      state.updatedList = false;
      window.changeData = false;
      state.disabled.saveBtn = true;
    }
    // delete and update
    // if (state.selectedList.length >= 1) {
    //   if (
    //     state.selectedList.length == 1 &&
    //     (state.selectedItem.category != state.symptomForm.category ||
    //       state.selectedItem.scale != state.symptomForm.scale ||
    //       state.selectedItem.name != state.symptomForm.name ||
    //       state.selectedItem.unit != state.symptomForm.unit ||
    //       state.selectedItem.comment != state.symptomForm.comment ||
    //       state.selectedItem.time != state.symptomForm.time)
    //   ) {
    //     state.deleteMode = false;
    //     state.updateMode = true;
    //   } else {
    //     state.deleteMode = true;
    //     state.updateMode = false;
    //   }
    // } else {
    //   state.deleteMode = false;
    //   state.updateMode = false;
    // }

    // var saveBtn = true;
    // state.showList.forEach((element) => {
    //     if (element) {
    //         saveBtn = false;
    //     }
    // });
    // state.disabled.saveBtn = saveBtn;
    state.disabled.addBtn = addBtn;
    state.counterState = state.counterState + 1;
  }
  switch (action.type) {
    case getStarted(GET_SYMPTOM_USERS):
      return { ...state, isLoading: true };
    case getSucceeded(GET_SYMPTOM_USERS):
      let data = [action.payload.users];
      if (action.payload.users.sub_users)
        data = [action.payload.users, ...action.payload.users.sub_users];
      if (data && data.length > 0) {
        if (data.length == 1) {
          data[0].isSelected = true;
          state.symptomForm.users.push(data[0]._id);
        } else {
          //state.classNames.UsersBox = "blinking";
        }
      }
      state.users = data;
      buttonsChecker();
      return {
        ...state,
        isLoading: false,
        categories: action.payload.categories
      };

    case SYMPTOM_USER_SELECTED:
      let _id = action.data._id;
      let total = 0;
      let symptom = state.symptomForm;
      symptom.users = [];
      data = state.users.map(item => {
        if (item._id === _id) {
          if (!item.isSelected) item.isSelected = true;
          else item.isSelected = false;
          // item.selected = true;
        }
        if (item.isSelected) {
          //total++;
          symptom.users.push(item._id);
        }
        return item;
      });
      state.symptomForm = symptom;
      buttonsChecker();
      return {
        ...state,
        isLoading: false,
        users: data,
        amountReseter: !state.amountReseter
        //symptomForm: { ...symptom }
      };

    case SYMPTOM_CATEGORY_SELECTED:
      if (action.value == "02") {
        state.unitOptions = UNITS_WHEN_CATEGORY_IS_FOOD;
        state.scaleOptions = [];
      } else if (action.value == "01") {
        state.unitOptions = [];
        state.scaleOptions = SYMPTOM_UNITS["Normal10"]["severity"].map(e => {
          return {
            label: e,
            value: e
          };
        });
      }
      state.amountReseter = !state.amountReseter;
      state.amounNewValue = "";
      symptomForm = {
        name: "",
        scale: "",
        symptom: "",
        type: "",
        comment: state.symptomForm.comment,
        category: action.value,
        time: undefined,
        unit: "",
        users: state.symptomForm.users
      };
      state.symptomForm = symptomForm;
      state.nameOptions = [];
      buttonsChecker();
      return { ...state, isLoading: false };
    case ON_CHANGE_SYMPTOMFORM:
      state.symptomForm[action.event.target.name] = action.event.target.value;
      buttonsChecker();
      return { ...state };
    case CLEAR_SYMPTOM:
      data = state.users.map(item => {
        delete item.inputs;
        return item;
      });
      let symptomForm = {
        name: "",
        scale: "",
        symptom: "",
        type: "",
        comment: "",
        category: "",
        time: moment(),
        unit: "",
        users: state.symptomForm.users
      };
      state.symptomForm = symptomForm;
      state.amountReseter = !state.amountReseter;
      state.amounNewValue = "";
      state.users = data;
      state.showList = [];
      //state.selectedList = [];
      //state.selectedIndexList = [];

      buttonsChecker();

      // disabled = state.disabled;
      // disabled.input = true;
      // disabled.scale = true;
      return {
        ...state,
        nameOptions: [],
        deleteMode: false,
        updateMode: false
      };
    case SEARCH_SYMPTOM_OPTIONS:
      if (state.symptomForm.name != action.val) {
        state.symptomForm.symptom = "";
        if (state.symptomForm.category == "01") {
          state.unitOptions = [];
        } else {
          state.scaleOptions = [];
        }
      }

      state.symptomForm.name = action.val;
      state.symptomForm.sName = action.val;
      buttonsChecker();
      return {
        ...state
        // nameOptions: action.item.show || [],
        // nameTotalOptions: action.item.data || []
      };
    case SYMPTOM_DATE_CHANGED:
      state.symptomForm.time = action.val;
      buttonsChecker();

      //symptomForm = state.symptomForm;
      //symptomForm.time = action.val;
      return { ...state };
    case SYMPTOM_OPTION_SELECTED:
      symptomForm = state.symptomForm;
      symptomForm.symptom = action.item._id;
      let units = [];
      let scaleOptions = [];
      if (symptomForm.category == "02") {
        symptomForm.name = action.item.recipe_full;
        symptomForm.sName = action.item.recipe;
        symptomForm.symbol = action.item.symbol;
        units = UNITS_WHEN_CATEGORY_IS_FOOD;
      } else if (symptomForm.category == "01" || symptomForm.category == "03") {
        symptomForm.name = action.item.name;
        symptomForm.sName = action.item.displayname;
        symptomForm.type = action.item.severity || "Normal10";
        units = SYMPTOM_UNITS[symptomForm.type]["label"].map(e => {
          return {
            label: e,
            value: e
          };
        });
        scaleOptions = SYMPTOM_UNITS[symptomForm.type]["severity"].map(e => {
          return {
            label: e,
            value: e
          };
        });
      }
      state.unitOptions = units;
      buttonsChecker();
      return {
        ...state,
        symptomForm: symptomForm,
        scaleOptions: scaleOptions
      };
    case getStarted(CREATE_SYMPTOM):
      return { ...state, isLoading: true };

    case getFailed(CREATE_SYMPTOM):
      return { ...state, isLoading: false };

    case getSucceeded(CREATE_SYMPTOM):
      symptomForm = {
        name: "",
        scale: "",
        symptom: "",
        type: "",
        category: "",
        time: moment(),
        unit: "",
        users: state.symptomForm.users
      };
      // disabled = state.disabled;
      // disabled.input = true;
      // disabled.scale = true;
      data = state.users.map(item => {
        //item.selected = false;
        return item;
      });
      return { ...state, isLoading: false, symptomForm: symptomForm };
    case INPUT_ADD_ITEM:
      //var newData = [...state.inputsList, action.item];
      action.item.users = state.symptomForm.users;
      action.item.users.forEach(element => {
        state.users.forEach(user => {
          if (user._id == element) {
            var insertItem = { ...action.item, vId: uuidv4() };
            if (user.inputs) {
              user.inputs = [...user.inputs, insertItem];
            } else {
              user.inputs = [insertItem];
            }
          }
        });
      });
      var showList = [];
      state.users.forEach(user => {
        if (user.inputs && user.inputs.length > 0) {
          showList.push(user);
        }
      });
      symptomForm = {
        name: "",
        scale: "",
        symptom: "",
        type: "",
        category: "",
        time: state.symptomForm.time,
        unit: "",
        users: state.symptomForm.users
      };
      state.amountReseter = !state.amountReseter;
      state.amounNewValue = "";
      state.symptomForm = symptomForm;
      state.showList = showList;
      buttonsChecker();
      return { ...state, nameOptions: [] };
    case getStarted(SAVE_FOOD_AND_SYMPTOMS):
      return { ...state, isLoading: true };
    case SAVE_FOOD_AND_SYMPTOMS:
      data = state.users.map(item => {
        delete item.inputs;
        return item;
      });
      state.symptomForm = {
        name: "",
        scale: "",
        symptom: "",
        type: "",
        category: "",
        time: moment(),
        unit: "",
        users: state.symptomForm.users
      };
      state.isLoading = false;
      state.amountReseter = !state.amountReseter;
      state.amounNewValue = "";
      state.users = data;
      state.showList = [];
      //state.selectedList = [];
      state.selectedIndexList = [];
      // alert("successful!");
      setTimeout(() => {
        window.location.href = `/dashboard`;
      }, 1000);
      buttonsChecker();
      return { ...state, saveSuccess: true };
    case getFailed(SAVE_FOOD_AND_SYMPTOMS):
      return { ...state, isLoading: false };
    case SYPTOMS_ITEM_SELECT:
      // var flag = false;
      // var deleteIndex;
      var clickedItem;
      state.showList.forEach(user => {
        user.inputs.map(input => {
          if (input.vId == action.vId) {
            input.selected = !input.selected;
            if (input.selected) {
              clickedItem = input;
              state.updateMode = true;
            } else {
              clickedItem = undefined;
              state.updateMode = false;
            }
          } else {
            input.selected = false;
          }
        });
      });
      if (clickedItem) {
        var symptomForm = {
          vId: clickedItem.vId,
          name: clickedItem.name,
          scale: clickedItem.scale,
          symptom: clickedItem.symptom,
          type: "",
          category: clickedItem.category,
          time: clickedItem.time,
          comment: clickedItem.comment,
          unit: clickedItem.unit,
          sName: clickedItem.sName,
          users: state.symptomForm.users
        };
        units = [];
        scaleOptions = [];
        if (clickedItem.category == "02") {
          units = UNITS_WHEN_CATEGORY_IS_FOOD;
        } else if (
          clickedItem.category == "01" ||
          clickedItem.category == "03"
        ) {
          symptomForm.type = clickedItem.type || "Normal10";
          units = SYMPTOM_UNITS[symptomForm.type]["label"].map(e => {
            return {
              label: e,
              value: e
            };
          });
          scaleOptions = SYMPTOM_UNITS[symptomForm.type]["severity"].map(e => {
            return {
              label: e,
              value: e
            };
          });
        }
        state.scaleOptions = scaleOptions;
        state.unitOptions = units;

        state.amountReseter = !state.amountReseter;
        state.amounNewValue = clickedItem.scale;
        state.symptomForm = symptomForm;
        state.selectedItem = {
          vId: clickedItem.vId,
          name: clickedItem.name,
          scale: clickedItem.scale,
          symptom: clickedItem.symptom,
          type: "",
          category: clickedItem.category,
          time: clickedItem.time,
          comment: symptomForm.comment,
          unit: clickedItem.unit,
          users: state.symptomForm.users
        };
      } else {
        var symptomForm = {
          name: "",
          scale: "",
          symptom: "",
          type: "",
          category: "",
          time: moment(),
          unit: "",
          users: state.symptomForm.users
        };
        state.amountReseter = !state.amountReseter;
        state.amounNewValue = "";
        state.symptomForm = symptomForm;
        state.selectedItem = {};
      }
      buttonsChecker();
      return { ...state };
    case SYMPTOMS_ITEM_DELETE:
      state.users.forEach(user => {
        let deleteIndex = undefined;

        user.inputs &&
          user.inputs.map((input, i) => {
            if (input.vId == action.vId) {
              deleteIndex = i;
            }
          });
        if (deleteIndex != undefined) user.inputs.splice(deleteIndex, 1);
      });
      var showList = [];
      state.users.forEach(user => {
        if (user.inputs && user.inputs.length > 0) {
          showList.push(user);
        }
      });
      state.showList = showList;
      state.updateMode = false;

      var symptomForm = {
        name: "",
        scale: "",
        symptom: "",
        type: "",
        category: "",
        time: moment(),
        unit: "",
        _id: "",
        users: state.symptomForm.users,
        comment: ""
      };
      state.symptomForm = symptomForm;
      state.amountReseter = !state.amountReseter;
      state.amounNewValue = "";
      buttonsChecker();

      return { ...state };
    case SYMPTOMS_ITEM_UPDATE:
      //state.symptomForm.sName = state.symptomForm.name;
      state.users.forEach(user => {
        let updateIndex = undefined;
        user.inputs &&
          user.inputs.map((input, i) => {
            if (input.vId == state.selectedItem.vId) {
              updateIndex = i;
            }
          });
        if (updateIndex != undefined)
          user.inputs[updateIndex] = state.symptomForm;
      });
      // state.users.forEach(user => {
      //   if (state.selectedList[0].user._id == user._id) {
      //     user.inputs[state.selectedList[0].index] = state.symptomForm;
      //   }
      // });
      var showList = [];
      state.users.forEach(user => {
        if (user.inputs && user.inputs.length > 0) {
          showList.push(user);
        }
      });
      state.showList = showList;
      // state.selectedList = [];
      // state.selectedIndexList = [];
      state.updateMode = false;

      var symptomForm = {
        name: "",
        scale: "",
        symptom: "",
        type: "",
        category: "",
        time: moment(),
        unit: "",
        users: state.symptomForm.users
      };
      state.amountReseter = !state.amountReseter;
      state.amounNewValue = "";
      state.symptomForm = symptomForm;
      buttonsChecker();
      return { ...state };
    case RESET_INPUT_PAGE:
      state = initialState;

      buttonsChecker();
      return { ...state };
    default:
      return state;
  }
}

export default reducer;
