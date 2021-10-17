import { createActionThunk } from "redux-thunk-actions";
import {
  GET_EDIT_SYMPTOM_USERS,
  SYMPTOM_SELECTED,
  GET_SYMPTOM_LIST,
  EDIT_SYMPTOM_CATEGORY_SELECTED,
  EDIT_PAGE_SEARCH_SYMPTOM_OPTIONS,
  SYMPTOM_DELETED,
  EDIT_SYMPTOM_DATE_CHANGED,
  SYMPTOM_DATE_CHANGED,
  EDIT_SYMPTOM_OPTION_SELECTED,
  UPDATE_SYMPTOM,
  getFailed,
  getStarted,
  getSucceeded,
  ON_CHANGE_SYMPTOMEDITFORM,
  ON_CHANGE_SEARCHFORM,
  SYMPTOM_SEARCH_DATE_CHANGED,
  RESET_EDIT_PAGE,
  ON_SAVE_PAGE_SYMPTOMEDITFORM,
  EDITSYMPTOM_CHANGER_SEARCHFORM
} from "./constant";

import {
  getSymptomResponseDetail as getSymptomResponseDetailService,
  getSymptomList as getSymptomListService,
  searchSymptom as searchSymptomService,
  deleteSymptom as deleteSymptomService,
  getSymptomDetail as getSymptomDetailService,
  updateSymptom as updateSymptomService,
  getCategories
} from "../services/SymptomService";
import { getUser as getSymptomUsersService } from "../services/UserService";
import { getMeasurements } from "../services/LookupService";

// const editPageInitialization = createActionThunk(GET_EDIT_SYMPTOM_USERS, _id =>
//   getSymptomUsersService(_id, _id)
// );
const editPageInitialization = createActionThunk(
  GET_EDIT_SYMPTOM_USERS,
  async _id => {
    let users = await getSymptomUsersService(_id);
    let categories = await getCategories(_id);
    return { users, categories };
  }
);
const getSymptomList = createActionThunk(GET_SYMPTOM_LIST, val =>
  getSymptomListService(val)
);

const searchNameOptions = (val, type) => {
  return async dispatch => {
    dispatch({
      type: EDIT_PAGE_SEARCH_SYMPTOM_OPTIONS,
      val: val
    });
  };
};

const categorySelected = e => {
  return dispatch => {
    dispatch({
      type: EDIT_SYMPTOM_CATEGORY_SELECTED,
      value: e.target.value
    });
  };
};

//
// const symptomSelected = (p, type) => {
//     return async (dispatch) => {
//         try {
//             let item = await getSymptomResponseDetailService(p._id, type);
//             alert('ww');
//             dispatch({
//                 type: SYMPTOM_SELECTED,
//                 item: item
//             });
//         }
//         catch (e) {
//             console.log(e);
//         }
//     };
// };

const symptomSelected = (item, type, index) => {
  return async dispatch => {
    try {
      let units = [];
      if (type !== "01") {
        units = await getMeasurements();
      }
      dispatch({
        type: SYMPTOM_SELECTED,
        item: item,
        units: units,
        category: type,
        index: index
      });
    } catch (e) {
      console.log(e);
    }
  };
};

const deleteSymptom = vId => {
  return async dispatch => {
    try {
      //await deleteSymptomService(_id, type);
      dispatch({
        type: SYMPTOM_DELETED,
        vId
        //category: type
      });
    } catch (e) {
      console.log(e);
    }
  };
};

const onDateChange = val => {
  return dispatch => {
    dispatch({
      type: EDIT_SYMPTOM_DATE_CHANGED,
      val: val
    });
  };
};
const onDateChangeSearch = val => {
  return dispatch => {
    dispatch({
      type: SYMPTOM_SEARCH_DATE_CHANGED,
      val: val
    });
  };
};
const symptomOptionSelected = (data, type) => {
  return async dispatch => {
    //let data = await getSymptomDetailService(val._id, type);
    let units = [];
    if (type !== "01") {
      units = await getMeasurements();
    }
    dispatch({
      type: EDIT_SYMPTOM_OPTION_SELECTED,
      item: data,
      units: units
    });
  };
};

const updateSymptom = (data, type, callback) => {
  return async dispatch => {
    // dispatch({
    //     type: getStarted(UPDATE_SYMPTOM),
    // });
    //try {
    //let item = await updateSymptomService(data, type, callback);
    dispatch({
      type: getSucceeded(UPDATE_SYMPTOM),
      //payload: item,
      newData: data
    });
    //}
    // catch (e) {
    //     dispatch({
    //         type: getFailed(UPDATE_SYMPTOM),
    //         payload: e,
    //     });
    // }
  };
};
const savePage = (data, type, callback) => {
  return async dispatch => {
    try {
      await updateSymptomService(data, type, callback);
      dispatch({
        type: ON_SAVE_PAGE_SYMPTOMEDITFORM
      });
    } catch (ex) {
      alert("Please try again!");
    }
  };
};
const onChangeSyptomEditForm = e => {
  return dispatch => {
    dispatch({
      type: ON_CHANGE_SYMPTOMEDITFORM,
      event: e
    });
  };
};
const onChangeSearchForm = e => {
  return dispatch => {
    dispatch({
      type: ON_CHANGE_SEARCHFORM,
      event: e
    });
  };
};
const resetPage = () => {
  return dispatch => {
    dispatch({
      type: RESET_EDIT_PAGE
    });
  };
};
const searchFormChanger = (name, val) => {
  return dispatch => {
    dispatch({
      type: EDITSYMPTOM_CHANGER_SEARCHFORM,
      name: name,
      val: val
    });
  };
};
export default {
  editPageInitialization,
  symptomOptionSelected,
  categorySelected,
  searchNameOptions,
  getSymptomList,
  symptomSelected,
  deleteSymptom,
  updateSymptom,
  onDateChange,
  onChangeSyptomEditForm,
  onChangeSearchForm,
  onDateChangeSearch,
  savePage,
  resetPage,
  searchFormChanger
};
