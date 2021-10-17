import { createActionThunk } from "redux-thunk-actions";
import {
  getStarted,
  getFailed,
  GET_SYMPTOM_USERS,
  SYMPTOM_OPTION_SELECTED,
  SYMPTOM_USER_SELECTED,
  SYMPTOM_DATE_CHANGED,
  SYMPTOM_CATEGORY_SELECTED,
  CLEAR_SYMPTOM,
  SEARCH_SYMPTOM_OPTIONS,
  SYMPTOMS_ITEM_DELETE,
  CREATE_SYMPTOM,
  INPUT_ADD_ITEM,
  ON_CHANGE_SYMPTOMFORM,
  SAVE_FOOD_AND_SYMPTOMS,
  SYPTOMS_ITEM_SELECT,
  SYMPTOMS_ITEM_UPDATE,
  RESET_INPUT_PAGE
} from "./constant";

import {
  searchSymptom as searchSymptomService,
  getSymptomDetail as getSymptomDetailService,
  createSymptom as createSymptomService,
  saveFoodAndSymptoms,
  getCategories
} from "../services/SymptomService";
import { getUser as getSymptomUsersService } from "../services/UserService";
import { getMeasurements } from "../services/LookupService";
import { submit, reset } from "redux-form";
import { promises } from "fs";

const inputPageInitialization = createActionThunk(
  GET_SYMPTOM_USERS,
  async _id => {
    let users = await getSymptomUsersService(_id);
    let categories = await getCategories(_id);
    return { users, categories };
  }
);
//const saveClicked = createActionThunk(SAVE_FOOD_AND_SYMPTOMS, (data) => saveFoodAndSymptoms(data));
const createSymptom = createActionThunk(
  CREATE_SYMPTOM,
  (data, type, callback) => createSymptomService(data, type, callback)
);
const selectUser = _id => {
  return dispatch => {
    dispatch({
      type: SYMPTOM_USER_SELECTED,
      data: {
        _id: _id
      }
    });
  };
};
const searchNameOptions = (val, type) => {
  return dispatch => {
    dispatch({
      type: SEARCH_SYMPTOM_OPTIONS,
      val: val
    });
    // try {
    //   let data = await searchSymptomService(val, type);
    //   dispatch({
    //     type: SEARCH_SYMPTOM_OPTIONS,
    //     item: data,
    //     val: val
    //   });
    // } catch (e) {
    //   console.log(e);
    // }
  };
};
const onChangeForm = e => {
  return dispatch => {
    dispatch({
      type: ON_CHANGE_SYMPTOMFORM,
      event: e
    });
  };
};
const categorySelected = e => {
  return dispatch => {
    dispatch({
      type: SYMPTOM_CATEGORY_SELECTED,
      value: e.target.value
    });
  };
};
const clearSymptom = e => {
  return dispatch => {
    dispatch({
      type: CLEAR_SYMPTOM
    });
  };
};
const onDateChange = val => {
  return dispatch => {
    dispatch({
      type: SYMPTOM_DATE_CHANGED,
      val: val
    });
  };
};
const symptomOptionSelected = (data, type) => {
  return async dispatch => {
    //let data = await getSymptomDetailService(val._id, type);
    // let units = [];
    // if (type !== "symptom" && type !== "symptoms") {
    //   units = await getMeasurements();
    // }
    dispatch({
      type: SYMPTOM_OPTION_SELECTED,
      item: data
      //units: units
    });
  };
};
// const symptomOptionSelected = (val, type) => {
//   return async dispatch => {
//     try {
//       let data = await getSymptomDetailService(val._id, type);
//       let units = [];
//       if (type !== "symptom") {
//         units = await getMeasurements();
//       }
//       dispatch({
//         type: SYMPTOM_OPTION_SELECTED,
//         item: data,
//         units: units
//       });
//     } catch (e) {
//       console.log(e);
//     }
//   };
// };
const saveClicked = newData => {
  return async dispatch => {
    dispatch({
      type: getStarted(SAVE_FOOD_AND_SYMPTOMS)
    });
    try {
      let data = await saveFoodAndSymptoms(newData);
      if (data.message) throw data.message;
      dispatch({
        type: SAVE_FOOD_AND_SYMPTOMS,
        data: data
      });
    } catch (e) {
      dispatch({
        type: getFailed(SAVE_FOOD_AND_SYMPTOMS)
      });
      alert(e);
    }
  };
};
const addClicked = () => {
  return dispatch => {
    dispatch(submit("formSymptom"));
  };
};
const addItem = item => {
  return dispatch => {
    dispatch({
      type: INPUT_ADD_ITEM,
      item: item
    });
    //dispatch(reset('formSymptom'));
  };
};
const selectItem = (user, vId) => {
  return dispatch => {
    dispatch({
      type: SYPTOMS_ITEM_SELECT,
      vId: vId,
      user: user
    });
  };
};
const deleteItem = id => {
  return dispatch => {
    dispatch({
      type: SYMPTOMS_ITEM_DELETE,
      vId: id
    });
  };
};
const updateItem = () => {
  return dispatch => {
    dispatch({
      type: SYMPTOMS_ITEM_UPDATE
    });
  };
};
const resetPage = () => {
  return dispatch => {
    dispatch({
      type: RESET_INPUT_PAGE
    });
  };
};
export default {
  inputPageInitialization,
  selectUser,
  categorySelected,
  clearSymptom,
  searchNameOptions,
  onDateChange,
  symptomOptionSelected,
  selectItem,
  createSymptom,
  addClicked,
  addItem,
  onChangeForm,
  saveClicked,
  deleteItem,
  updateItem,
  resetPage
};
