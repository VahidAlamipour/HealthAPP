import {
  GRAPH_INITIALIZATION,
  getStarted,
  getSucceeded,
  UPDATE_BIG_GRAPH,
  getEnded,
  RECIPE_INITIALIZATION,
  statusEnum,
  ON_CHANGE_ANALYZEFORM,
  ON_CHANGE_FACTOR_ANALYZEFORM,
  ANALYZEPAGE_DATE_CHANGED,
  RESET_ANALYZE_PAGE,
  getFailed
} from "../actions/constant";
import _ from "lodash";
//import dashboard from "material-ui/svg-icons/action/dashboard";
import moment from "moment";
import { stat } from "fs";

const chartLablesMaker = (period, min) => {
  min = min || moment();
  switch (period) {
    case "1W":
      let result = { data: [], min: min, max: moment(min).add(1, "week") };
      for (let i = 2; i < 7; i = i + 2) {
        result.data.push(moment(min).add(i, "days"));
      }
      return result;
    case "2W":
      result = { data: [], min: min, max: moment(min).add(2, "weeks") };
      for (let i = 3; i < 14; i = i + 3) {
        result.data.push(moment(min).add(i, "days"));
      }
      return result;
    case "1M":
      result = { data: [], min: min, max: moment(min).add(1, "month") };
      for (let i = 10; i < 30; i = i + 10) {
        result.data.push(moment(min).add(i, "days"));
      }
      return result;
    case "3M":
      result = { data: [], min: min, max: moment(min).add(3, "months") };
      for (let i = 2; i < 12; i = i + 2) {
        result.data.push(moment(min).add(i, "weeks"));
      }
      return result;
    case "6M":
      result = { data: [], min: min, max: moment(min).add(6, "months") };
      for (let i = 1; i < 6; i++) {
        result.data.push(moment(min).add(i, "months"));
      }
      return result;
    case "1Y":
      result = { data: [], min: min, max: moment(min).add(1, "years") };
      for (let i = 3; i < 12; i = i + 3) {
        var newDate = moment(min).add(i, "months");
        result.data.push(newDate);
      }
      return result;
    case "2Y":
      result = { data: [], min: min, max: moment(min).add(2, "years") };
      for (let i = 6; i < 24; i = i + 6) {
        var newDate = moment(min).add(i, "months");
        result.data.push(newDate);
      }
      return result;
    case "5Y":
      result = { data: [], min: min, max: moment(min).add(5, "years") };
      for (let i = 1; i < 5; i++) {
        var newDate = moment(min).add(i, "years");
        result.data.push(newDate);
      }
      return result;
    default:
      break;
  }
};

const initialState = {
  symptomOfAllUser: {},
  isLoading: true,
  users: [],
  selectedUser: {},
  selectedSymptom: {},
  factors: [],
  OptionForm: {},
  symptoms: [],
  from: "",
  to: "",
  //symptom_data: [],
  nutrients: [],
  disabled: {
    factor: true,
    nutrients: true,
    start: true,
    end: true,
    time: true,
    plotBtn: true
  },
  counterState: 0,
  ListOfWhile: [
    { value: "1W", label: "1 Week" },
    { value: "2W", label: "2 Weeks" },
    { value: "1M", label: "1 Month" },
    { value: "3M", label: "3 Months" },
    { value: "6M", label: "6 Months" },
    { value: "1Y", label: "1 Year" },
    { value: "2Y", label: "2 Years" },
    { value: "5Y", label: "5 Years" }
  ],
  graphSymptoms: [],
  graphFactors: [],
  chartPeriod: chartLablesMaker("1Y"),
  yLabels: { data: [2, 4, 6, 8], min: 0, max: 10 }
};
function buttonsChecker(state) {
  let disabled = {
    factor: true,
    nutrients: true,
    start: true,
    end: true,
    time: true,
    plotBtn: true
  };
  // if (state.OptionForm.symptom && state.OptionForm.symptom != "null") {
  //   disabled.factor = false;
  // } else {
  //   return disabled;
  // }
  if (state.OptionForm.factor && state.OptionForm.factor != "null") {
    disabled.nutrients = false;
  }
  if (
    (state.OptionForm.nutrients && state.OptionForm.nutrients != "null") ||
    (state.OptionForm.symptom && state.OptionForm.symptom != "null")
  ) {
    disabled.start = false;
  } else {
    return disabled;
  }
  if (state.OptionForm.start) {
    disabled.end = false;
  } else {
    return disabled;
  }
  if (state.OptionForm.end && state.OptionForm.end != "null") {
    disabled.plotBtn = false;
  }
  return disabled;
  // state.disabled.addBtn = addBtn;
  // state.counterState = state.counterState + 1;
}

function reducer(state = initialState, action) {
  switch (action.type) {
    case GRAPH_INITIALIZATION:
      let users = [action.users];
      if (action.users.sub_users) users = [...users, ...action.users.sub_users];
      let selectedUser = users[0];
      let data = action.data.Data.find(element => {
        return element.participant == selectedUser._id;
      });
      users = users.map(element => {
        return {
          label: `${element.first_name} ${element.last_name}`,
          value: element._id
        };
      });
      data = _.orderBy(data.Symptoms, ["order"]);
      console.log("injaRed: ", data);
      data = data.map(element => {
        return {
          label: element.symptom,
          value: element._id
        };
      });
      // let factors = action.factors.res_meals.map(element => {
      //   return {
      //     label: element.recipe,
      //     value: element._id
      //   };
      // });
      let factors = action.factors;

      let optionForm = {
        ...state.OptionForm,
        user: selectedUser._id
      };
      return {
        ...state,
        isLoading: false,
        users: users,
        OptionForm: optionForm,
        selectedUser: selectedUser,
        symptoms: data,
        factors: factors,
        symptomOfAllUser: action.data.Data
      };
    case getSucceeded(UPDATE_BIG_GRAPH):
      const newSymptoms = action.payload[0];
      const newFactors = action.payload[1];
      var chartPeriod = chartLablesMaker(
        state.OptionForm.end,
        state.OptionForm.start
      );
      return {
        ...state,
        graphSymptoms: newSymptoms,
        graphFactors: newFactors,
        chartPeriod
      };
    case ON_CHANGE_ANALYZEFORM:
      //#region if change user dropdown
      if (action.event.target.name == "user") {
        let factors = action.factors.res_meals.map(element => {
          return {
            label: element.recipe,
            value: element._id
          };
        });
        let data = state.symptomOfAllUser.find(element => {
          return element.participant == action.event.target.value;
        });
        data = _.orderBy(data.Symptoms, ["order"]);
        data = data.map(element => {
          return {
            label: element.symptom_name,
            value: element.symptom
          };
        });
        state.OptionForm = {
          user: action.event.target.value
        };
        state.symptoms = data;
        state.factors = factors;
        state.disabled = buttonsChecker(state);
        return {
          ...state,
          counterState: state.counterState + 1
        };
      }
      //#endregion  if change user dropdown
      state.OptionForm[action.event.target.name] = action.event.target.value;
      return {
        ...state,
        disabled: buttonsChecker(state),
        counterState: state.counterState + 1
      };
    case getSucceeded(ON_CHANGE_FACTOR_ANALYZEFORM):
      let nutrients = action.payload.data;
      state.OptionForm["factor"] = action.payload.id;
      nutrients = nutrients.map(element => {
        return {
          label: `${element.name} (0%)`,
          value: element._id
        };
      });
      state.OptionForm = {
        ...state.OptionForm,
        nutrients: "null"
      };

      return {
        ...state,
        disabled: buttonsChecker(state),
        counterState: state.counterState + 1,
        nutrients: nutrients
      };
    case getFailed(ON_CHANGE_FACTOR_ANALYZEFORM):
      state.OptionForm["factor"] = "";
      nutrients = [];
      return {
        ...state,
        disabled: buttonsChecker(state),
        counterState: state.counterState + 1,
        nutrients: nutrients
      };
    case ANALYZEPAGE_DATE_CHANGED:
      state.OptionForm.start = action.val;
      return {
        ...state,
        disabled: buttonsChecker(state),
        counterState: state.counterState + 1
      };
    case RESET_ANALYZE_PAGE:
      return { ...initialState };
    default:
      return state;
  }
}

export default reducer;
