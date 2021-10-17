import {
  getFailed,
  getStarted,
  getSucceeded,
  getEnded,
  GET_DETAIL_STOCKS,
  SELECT_STOCK_ITEM,
  SELECT_TIME_SELECTION,
  GET_STOCK_INFO,
  TOGGLE_SEVERITY,
  GET_DASHBOARD_USERS,
  RESET_VIEWSUMMARY_PAGE_MYDATA
} from "../actions/constant";
import _ from "lodash";
import moment from "moment";

import { arrayMove } from "react-sortable-hoc";
import { S_IFDIR } from "constants";

const chartLablesMaker = period => {
  switch (period) {
    case "1M":
      let result = [
        moment(),
        moment().add(-1, "weeks"),
        moment().add(-2, "weeks"),
        moment().add(-3, "weeks"),
        moment().add(-1, "months")
      ];
      return result;
    case "3M":
      result = [
        moment(),
        moment().add(-2, "weeks"),
        moment().add(-4, "weeks"),
        moment().add(-6, "weeks"),
        moment().add(-8, "weeks"),
        moment().add(-10, "weeks"),
        moment().add(-3, "months")
      ];
      return result;
    case "6M":
      result = [
        moment(),
        moment().add(-1, "months"),
        moment().add(-2, "months"),
        moment().add(-3, "months"),
        moment().add(-4, "months"),
        moment().add(-5, "months"),
        moment().add(-6, "months")
      ];
      return result;
    case "1Y":
      result = [];
      for (let i = 0; i < 13; i = i + 3) {
        var newDate = moment().add(-i, "months");
        result.push(newDate);
      }
      return result;
    case "2Y":
      result = [];
      for (let i = 0; i < 25; i = i + 3) {
        var newDate = moment().add(-i, "months");
        result.push(newDate);
      }
      return result;
    default:
      break;
  }
};

const initialState = {
  allUser: [],
  isLoading: false,
  stocks: [],
  selected: { graph: [], news: [] },
  selectedUser: {},
  timeSelection: "1Y",
  chartPeriod: chartLablesMaker("1Y"),
  DateMode: false,
  selectedSymptom: ""
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_DASHBOARD_USERS:
      let data = [action.data];
      if (action.data.sub_users) data = [...data, ...action.data.sub_users];
      return {
        ...state,
        allUser: data,
        isLoading: false
      };
    case getStarted(GET_DETAIL_STOCKS):
      return { ...state, isLoading: true };
    case GET_DETAIL_STOCKS:
      data = action.data.Data;
      var selectedUser = action.selectedUser;
      if (!data) data = [];
      data = _.filter(data, function(item) {
        return item.participant == selectedUser._id.toString();
      });
      if (data.length <= 0) {
        data = { Symptoms: [] };
      } else {
        data = data[0];
      }
      data = _.filter(data.Symptoms, function(item) {
        return item.visibility;
      });
      data = data.map(item => {
        item.order = parseInt(item.order);
        return item;
      });
      data = _.orderBy(data, ["order"]);
      //data = data[0];
      // try {
      //     let data = action.data.data;
      //     return { ...state, isLoading: false, stocks: action.data };
      // } catch (err) {
      //     return { ...state, isLoading: false, stocks: [] };
      //     console.log("mainViewReducer::reducer(), GET_DETAIL_STOCKS, ERROR:" + err);
      // }

      return {
        ...state,
        isLoading: false,
        stocks: data,
        selectedUser: selectedUser
      };
    case SELECT_STOCK_ITEM:
      var st = state.stocks;
      st.forEach(item => {
        if (item._id == action.id) item.isSelected = 1;
        else item.isSelected = 0;
      });
      return {
        ...state,
        isLoading: false,
        selected: action.item,
        selectedSymptom: action.id,
        stocks: st
      };

    case getStarted(SELECT_STOCK_ITEM):
      //   const stockSelectToggles = state.stocks.map(e => {
      //     if (e.symptom === action.item.symptom) e.isSelected = 1;
      //     else e.isSelected = 0;
      //     return e;
      //   });
      return { ...state, isLoading: false };

    case SELECT_TIME_SELECTION:
      let selected = state.selected;
      if (action.item.graph) selected.graph = action.item.graph;
      else selected.graph = [];
      var period = action.item.time;
      return {
        ...state,
        chartPeriod: chartLablesMaker(period),
        timeSelection: period,
        selected: selected
      };

    case getStarted(GET_STOCK_INFO):
      return { ...state, isLoading: false };

    case getSucceeded(GET_STOCK_INFO):
      let item = action.payload;
      let stocks = state.stocks.map(e => {
        if (e._id === item.symptom) {
          e.state = item.state;
          e.severity = item.severity;
          e.created = item.date;
        }
        return e;
      });
      return { ...state, stocks: stocks, isLoading: false };

    case TOGGLE_SEVERITY:
      // stocks = state.stocks.map((e) => {
      //     if (!e.mode || e.mode != 1)
      //         e.mode = 1;
      //     else
      //         e.mode = 0;
      //     return e;
      // });

      return { ...state, DateMode: !state.DateMode };
    case RESET_VIEWSUMMARY_PAGE_MYDATA:
      return initialState;

    default:
      return state;
  }
}

export default reducer;
