import {
  getFailed,
  getStarted,
  getSucceeded,
  getEnded,
  GET_EDIT_SYMPTOM_USERS,
  EDIT_SYMPTOM_OPTION_SELECTED,
  EDIT_SYMPTOM_CATEGORY_SELECTED,
  SYMPTOM_SELECTED,
  EDIT_PAGE_SEARCH_SYMPTOM_OPTIONS,
  SYMPTOM_DATE_RANGE_CHANGED,
  GET_SYMPTOM_LIST,
  SYMPTOM_DELETED,
  EDIT_SYMPTOM_DATE_CHANGED,
  SYMPTOM_UNITS,
  UPDATE_SYMPTOM,
  SYMPTOM_OPTION_SELECTED,
  ON_CHANGE_SYMPTOMEDITFORM,
  ON_CHANGE_SEARCHFORM,
  SYMPTOM_SEARCH_DATE_CHANGED,
  RESET_EDIT_PAGE,
  ON_SAVE_PAGE_SYMPTOMEDITFORM,
  EDITSYMPTOM_CHANGER_SEARCHFORM
} from "../actions/constant";
import { uuidv4 } from "../services/PublicService";
import { UNITS_WHEN_CATEGORY_IS_FOOD } from "../pages/Constants";
import _ from "lodash";
import moment from "moment";
import { stat } from "fs";
import search from "material-ui/svg-icons/action/search";

const initialState = {
  isLoading: false,
  users: [],
  nameOptions: [],
  nameTotalOptions: [],
  disabled: {
    input: true,
    time_range: true,
    scale: true
  },
  symptoms: [],
  scaleOptions: [
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "4", value: "4" },
    { label: "5", value: "5" }
  ],
  categories: [{ value: "00", label: "All" }],
  symptomEditForm: {},
  unitOptions: [],
  searchForm: {},
  disabled: {
    start: true,
    to: true,
    searchBtn: true,
    name: true,
    scale: true,
    unit: true,
    time: true,
    comment: true,
    addBtn: true,
    saveBtn: true,
    clearBtn: true
  },
  deleteMode: true,
  updateMode: false,
  amountReseter: false,
  amounNewValue: null,
  selectedIndex: -1,
  updatedList: false,
  counterState: 0,
  ListOfWhile: [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "6", label: "6" },
    { value: "7", label: "7" }
  ]
};

function reducer(state = initialState, action) {
  function buttonsChecker() {
    if (
      state.searchForm.user &&
      state.searchForm.category &&
      state.searchForm.category != "null"
    ) {
      state.disabled.start = false;
      state.disabled.to = false;
    } else {
      state.disabled.start = true;
      state.disabled.to = true;
    }
    if (
      state.searchForm.user &&
      state.searchForm.category &&
      state.searchForm.category != "null" &&
      state.searchForm.start &&
      state.searchForm.to &&
      state.searchForm.to != "null"
    ) {
      state.disabled.searchBtn = false;
    } else {
      state.disabled.searchBtn = true;
    }
    //unit
    if (state.unitOption && state.unitOption.length > 0) {
      state.disabled.unit = true;
    } else {
      state.disabled.unit = true;
    }

    //delete and update
    if (state.selectedIndex >= 0) {
      state.disabled.name = false;
      state.disabled.scale = false;
      state.disabled.comment = false;
      state.disabled.time = false;
      if (state.unitOptions && state.unitOptions.length > 0) {
        state.disabled.unit = false;
      } else {
        state.disabled.unit = true;
      }
      console.log("injaRed: ", state.itemSelected, state.symptomEditForm);
      if (
        state.itemSelected.name != state.symptomEditForm.name ||
        state.itemSelected.scale != state.symptomEditForm.scale ||
        state.itemSelected.unit != state.symptomEditForm.unit ||
        state.itemSelected.created != state.symptomEditForm.created ||
        state.itemSelected.comment != state.symptomEditForm.comment
      ) {
        state.disabled.addBtn = false;
        //state.updateMode = true;
      } else {
        state.disabled.addBtn = true;
        //state.updateMode = false;
      }
    } else {
      state.disabled.name = true;
      state.disabled.scale = true;
      state.disabled.unit = true;
      state.disabled.time = true;
      state.disabled.comment = true;
      //state.deleteMode = true;
      //state.updateMode = false;
      state.disabled.addBtn = true;
    }

    //update button
    if (
      state.symptomEditForm.name &&
      state.symptomEditForm.scale &&
      state.symptomEditForm.scale != "null" &&
      state.symptomEditForm.created &&
      (state.disabled.unit ||
        (state.symptomEditForm.unit && state.symptomEditForm.unit != "null"))
    ) {
      //state.disabled.addBtn = false;
    } else {
      state.disabled.addBtn = true;
    }
    console.log("injaRed: ", state.disabled.addBtn);

    // var saveBtn = true;
    // if (state.ingredientList && state.ingredientList.length > 1 &&
    //    state.recipeForm.recipe && state.recipeForm.recipe.length > 1
    //    && state.recipeForm.cuisine && state.recipeForm.cuisine != 'null'
    //    && state.recipeForm.size && state.recipeForm.size != 'null') {
    //    saveBtn = false;
    // } else {
    //    saveBtn = true;

    // }
    // state.disabled.saveBtn = saveBtn;
    state.counterState = state.counterState + 1;
  }
  switch (action.type) {
    case getSucceeded(GET_EDIT_SYMPTOM_USERS):
      let user_list = [action.payload.users];
      if (action.payload.users.sub_users)
        user_list = [action.payload.users, ...action.payload.users.sub_users];
      let data = user_list.map(function(e, index) {
        return {
          label: e.first_name + " " + e.last_name,
          value: e._id
        };
      });
      let searchForm = state.searchForm;
      searchForm.user = data[0].value;
      return {
        ...state,
        isLoading: false,
        users: data,
        searchForm: searchForm,
        categories: [...state.categories, ...action.payload.categories]
      };

    case EDIT_SYMPTOM_CATEGORY_SELECTED:
      let disabled = state.disabled;
      // if (action.value != "null") {
      //     disabled.time_range = false;
      // }
      // else {
      //     disabled.time_range = true;
      // }
      //searchForm = state.searchForm;
      state.searchForm.category = action.value;
      state.amountReseter = !state.amountReseter;
      state.amounNewValue = "";
      state.selectedIndex = -1;
      state.itemSelected = {};
      state.symptoms = [];
      state.symptomEditForm = {};
      state.unitOptions = [];
      state.scaleOptions = [];
      //state.updatedList = false;

      buttonsChecker();
      return { ...state, isLoading: false };
    case SYMPTOM_SELECTED:
      let selectedIndex = action.index;
      let selected =
        action.item.status == 1 ? action.item.updatedData : action.item;
      symptoms = state.symptoms.map((item, index) => {
        if (selectedIndex == index) item.selected = !item.selected;
        else item.selected = false;
        return item;
      });
      let units = [];
      scaleOptions = [];
      if (action.category === "01") {
        selected.type = selected.type == "NONE" ? "Normal10" : selected.type;
        data = {
          created: moment(selected.date),
          name: selected.symptom_name,
          symptom: selected.symptom,
          scale: selected.severity,
          type: selected.type,
          unit: selected.label || "",
          comment: selected.comment,
          _id: selected._id,
          category: selected.category
        };
        units = SYMPTOM_UNITS[action.item.type]["label"].map(e => {
          return {
            label: e,
            value: e
          };
        });
        scaleOptions = SYMPTOM_UNITS[action.item.type]["severity"].map(e => {
          return {
            label: e,
            value: e
          };
        });
      } else {
        data = {
          created: moment(selected.date),
          name: selected.meals[0].recipe,
          symptom: selected.meals[0]._id,
          scale: selected.meals[0].size,
          unit: selected.meals[0].symbol,
          comment: selected.comment,
          _id: selected._id,
          category: selected.category
        };
        // units = action.units.map((e) => {
        //     return {
        //         label: e,
        //         value: e,
        //     }
        // });
        units = UNITS_WHEN_CATEGORY_IS_FOOD;
      }
      if (selectedIndex === state.selectedIndex) {
        selected = {};
        data = {};
        selectedIndex = -1;
        state.amountReseter = !state.amountReseter;
        state.amounNewValue = "";
      } else {
        state.amountReseter = !state.amountReseter;
        state.amounNewValue = data.scale;
      }
      disabled = state.disabled;
      disabled.input = false;
      state.selectedIndex = selectedIndex;
      state.itemSelected = { ...data };
      state.symptoms = symptoms;
      state.symptomEditForm = data;
      state.unitOptions = units;
      state.scaleOptions = scaleOptions;
      buttonsChecker();
      return { ...state };

    case getSucceeded(GET_SYMPTOM_LIST):
      let symptoms = action.payload;
      symptoms.forEach(item => {
        item.vId = uuidv4();
      });
      state.selectedIndex = -1;
      state.itemSelected = {};
      state.symptoms = symptoms;
      state.symptomEditForm = {};
      state.unitOptions = [];
      state.scaleOptions = [];
      state.amountReseter = !state.amountReseter;
      state.amounNewValue = "";
      //state.updatedList = false;

      buttonsChecker();
      return { ...state };

    case EDIT_PAGE_SEARCH_SYMPTOM_OPTIONS:
      disabled = state.disabled;
      if (action.val == "") disabled.scale = true;
      else disabled.scale = false;
      if (state.symptomEditForm.name != action.val) {
        state.symptomEditForm._id = "";
        state.symptomEditForm.symptom = "";
      }
      // var nameOptionsShow = action.item.show.map(item => {
      //   return { id: 0, name: item };
      // });
      state.symptomEditForm.name = action.val;
      // state.nameOptions = nameOptionsShow || [];
      // state.nameTotalOptions = action.item.data || [];
      units = [];
      let scaleOptions = [];
      if (state.itemSelected.category == "01") {
        units = SYMPTOM_UNITS["Normal10"]["label"].map(e => {
          return {
            label: e,
            value: e
          };
        });
        scaleOptions = SYMPTOM_UNITS["Normal10"]["severity"].map(e => {
          return {
            label: e,
            value: e
          };
        });
        state.symptomEditForm.scale = "";
        state.unitOptions = units;
      } else {
        //units = UNITS_WHEN_CATEGORY_IS_FOOD;
        scaleOptions = [];
      }
      state.scaleOptions = scaleOptions;

      buttonsChecker();
      return { ...state };

    case SYMPTOM_DATE_RANGE_CHANGED:
      let symptomForm = state.time_range;
      symptomForm[action.key] = action.val;
      return { ...state, time_range: symptomForm };

    case SYMPTOM_DELETED:
      // symptoms = state.symptoms.filter((item) => {
      //     return item._id != action._id
      // });
      state.symptoms.forEach(item => {
        if (item.vId == action.vId) {
          //item.selected = false;
          item.status = 2;
        }
      });
      state.selectedIndex = -1;
      state.itemSelected = {};
      state.symptomEditForm = {};
      state.disabled.saveBtn = false;
      state.amountReseter = !state.amountReseter;
      state.amounNewValue = "";
      state.updatedList = true;
      window.changeData = true;
      buttonsChecker();
      return { ...state };

    case EDIT_SYMPTOM_DATE_CHANGED:
      //

      state.symptomEditForm.created = action.val;
      buttonsChecker();
      return { ...state };

    case EDIT_SYMPTOM_OPTION_SELECTED:
      let symptomEditForm = state.symptomEditForm;
      disabled = state.disabled;
      symptomForm = state.searchForm;
      symptomEditForm = state.symptomEditForm;
      symptomEditForm.symptom = action.item._id;
      units = [];
      scaleOptions = [];
      if (state.itemSelected.category !== "01") {
        symptomEditForm.name = action.item.recipe_full;
        symptomEditForm.sName = action.item.recipe;
        symptomEditForm.symbol = action.item.symbol;
        // units = action.units.map((e) => {
        //     return {
        //         label: e,
        //         value: e,
        //     }
        // });
        units = UNITS_WHEN_CATEGORY_IS_FOOD;
      } else {
        symptomEditForm.name = action.item.displayname;
        symptomEditForm.sName = action.item.name;
        symptomEditForm.type = action.item.severity;
        units = SYMPTOM_UNITS[action.item.severity]["label"].map(e => {
          return {
            label: e,
            value: e
          };
        });
        scaleOptions = SYMPTOM_UNITS[action.item.severity]["severity"].map(
          e => {
            return {
              label: e,
              value: e
            };
          }
        );
      }
      disabled.scale = false;
      state.symptomEditForm = symptomEditForm;
      state.scaleOptions = scaleOptions;
      state.unitOptions = units;
      buttonsChecker();
      return {
        ...state,
        disabled: disabled
      };

    case getStarted(UPDATE_SYMPTOM):
      return { ...state, isLoading: true };

    case getFailed(UPDATE_SYMPTOM):
      alert(action.payload.message);
      return { ...state, isLoading: false };

    case getSucceeded(UPDATE_SYMPTOM):
      symptomEditForm = state.symptomEditForm;
      symptoms = state.symptoms;
      for (let i = 0; i < symptoms.length; i++) {
        if (symptoms[i].selected) {
          symptoms[i].updatedData = action.newData;
          symptoms[i].selected = false;
          symptoms[i].status = 1;
          break;
        }
      }
      state.symptoms = symptoms;
      state.selectedIndex = -1;
      state.itemSelected = {};
      state.symptomEditForm = {};
      state.amountReseter = !state.amountReseter;
      state.amounNewValue = "";
      state.disabled.saveBtn = false;
      state.updatedList = true;
      window.changeData = true;
      buttonsChecker();

      return { ...state, isLoading: false };
    case ON_CHANGE_SYMPTOMEDITFORM:
      // action.event.target.value =
      //   action.event.target.value == null
      //     ? undefined
      //     : action.event.target.value;
      state.symptomEditForm[action.event.target.name] =
        action.event.target.value;
      //alert(state.symptomEditForm[action.event.target.name]);
      buttonsChecker();
      return { ...state };
    case ON_CHANGE_SEARCHFORM:
      state.searchForm[action.event.target.name] = action.event.target.value;
      state.amountReseter = !state.amountReseter;
      state.amounNewValue = "";
      state.selectedIndex = -1;
      state.itemSelected = {};
      state.symptoms = [];
      state.symptomEditForm = {};
      state.unitOptions = [];
      state.scaleOptions = [];
      state.updatedList = false;
      window.changeData = false;
      buttonsChecker();
      return { ...state };
    case SYMPTOM_SEARCH_DATE_CHANGED:
      state.searchForm.start = action.val;
      state.amountReseter = !state.amountReseter;
      state.amounNewValue = "";
      state.selectedIndex = -1;
      state.itemSelected = {};
      state.symptoms = [];
      state.symptomEditForm = {};
      state.unitOptions = [];
      state.scaleOptions = [];
      state.updatedList = false;
      window.changeData = false;
      buttonsChecker();
      return { ...state };
    case RESET_EDIT_PAGE:
      state.searchForm = {};
      state.amountReseter = !state.amountReseter;
      state.amounNewValue = "";
      state.selectedIndex = -1;
      state.itemSelected = {};
      state.symptoms = [];
      state.symptomEditForm = {};
      state.unitOptions = [];
      state.scaleOptions = [];
      state.updatedList = false;
      window.changeData = false;
      window.changeData = false;

      buttonsChecker();
      return { ...state };
    case ON_SAVE_PAGE_SYMPTOMEDITFORM:
      return { ...initialState, users: state.users };
    case EDITSYMPTOM_CHANGER_SEARCHFORM:
      //alert(action.name);
      //searchForm = state.searchForm;
      //searchForm[action.name] = action.val;
      //state.searchForm = { ...searchForm };
      var newForm = {};
      if (state.searchForm.chenger) {
        newForm = { ...state.searchForm, [action.name]: action.val };
        delete newForm.chenger;
      } else {
        newForm = {
          ...state.searchForm,
          [action.name]: action.val,
          chenger: true
        };
      }
      state.searchForm = newForm;
      buttonsChecker();
      return { ...state };
    default:
      return state;
  }
}

export default reducer;
