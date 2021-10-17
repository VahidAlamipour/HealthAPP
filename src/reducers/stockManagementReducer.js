import {
  getFailed,
  getStarted,
  getSucceeded,
  getEnded,
  GET_STOCKS,
  SWIPE_STOCKS,
  DELETE_STOCK,
  ADD_STOCK,
  ORDER_STOCK,
  RESET_STOCK_PAGE_MYDATA
} from "../actions/constant";
import { arrayMove } from "react-sortable-hoc";
import _ from "lodash";

const initialState = {
  isLoading: false,
  stocks: [],
  redirectStatus: false,
  btnDoneDisabled: true
};

function reducer(state = initialState, action) {
  let user;
  let data;
  switch (action.type) {
    case getStarted(GET_STOCKS):
      return { ...state, isLoading: true };

    case getSucceeded(GET_STOCKS):
      try {
        let data = action.payload.data;
        //let k;
        //    data.forEach((val, index)=>{
        //       k = localStorage.getItem("stock_" + val._id, index) ? localStorage.getItem("stock_" + val._id, index): 0;
        //       val.index = k;
        //    });
        //    _.sortBy(data, ['index'])
        const visibleList = data.filter(item => {
          return item.visibility;
        });
        data.splice(visibleList.length, 0, {
          title: "Symptom Not Displayed in Symptom Watchlist",
          type: "seprator"
        });
        data = data.map((item, index) => {
          item.order = index;
          return item;
        });

        return {
          ...state,
          isLoading: false,
          stocks: data,
          redLine: visibleList.length,
          currentUser: action.payload.currentUser
        };
      } catch (err) {
        console.log("stockManagementReducer::reducer(), ERROR:" + err);
      }

    case getSucceeded(DELETE_STOCK):
      try {
        data = state.stocks;
        data = data.filter(e => {
          return e._id !== action.payload._id;
        });
        user = JSON.parse(localStorage.getItem("user"));
        user.usersymptoms.forEach((value, key) => {
          if (value._id == action.payload._id) {
            value.visibility = false;
          }
        });
        localStorage.setItem("user", JSON.stringify(user));
        return { ...state, isLoading: false, stocks: data };
      } catch (err) {
        console.log(
          "stockManagementReducer::reducer()::getSucceeded(DELETE_STOCKS): ERROR" +
            err
        );
      }

    case getStarted(DELETE_STOCK):
      return { ...state, isLoading: true };

    case getStarted(ADD_STOCK):
      return { ...state, isLoading: true };

    case getSucceeded(ADD_STOCK):
      data = state.stocks;
      data = data.filter(e => {
        return e._id !== action.payload._id;
      });
      user = JSON.parse(localStorage.getItem("user"));
      user.usersymptoms.forEach((value, key) => {
        if (value._id == action.payload._id) {
          value.visibility = true;
        }
      });
      localStorage.setItem("user", JSON.stringify(user));
      return { ...state, isLoading: false, stocks: data };

    case SWIPE_STOCKS:
      data = state.stocks;
      var newData = arrayMove(data, action.data.oldIndex, action.data.newIndex);
      data = newData.map((item, index) => {
        // if (index == action.data.newIndex) {
        //   item.visibility = action.data.newIndex < state.redLine;
        // }
        item.order = index;
        return item;
      });
      // const visibleList = data.filter(item => {
      //   return item.visibility;
      // });
      // data.forEach((val, index) => {
      //   localStorage.setItem("stock_" + val._id, index);
      //   val.index = index;
      // });
      return {
        ...state,
        stocks: data,
        btnDoneDisabled: false
      };
    case getStarted(ORDER_STOCK):
      return { ...state, isLoading: true };
    case getSucceeded(ORDER_STOCK):
      return {
        ...state,
        isLoading: false,
        redirectStatus: true
      };
    case RESET_STOCK_PAGE_MYDATA:
      return initialState;
    default:
      return state;
  }
}

export default reducer;
