import { createActionThunk } from "redux-thunk-actions";
import {
  getStarted,
  getSucceeded,
  getEnded,
  SELECT_STOCK_ITEM,
  GET_DETAIL_STOCKS,
  SELECT_TIME_SELECTION,
  TOGGLE_SEVERITY,
  GET_STOCK_INFO,
  GET_DASHBOARD_USERS,
  RESET_VIEWSUMMARY_PAGE_MYDATA
} from "./constant";
import {
  getdetailStocks as getdetailStocksService,
  getStock as getStockService,
  getNews as getNewsService,
  getStockGraph as getStockGraphService
} from "../services/StockService";
import { parseJSON } from "../services/ServiceHelper";
import { getUser } from "../services/UserService";

// const getSymptomUsers = createActionThunk(GET_DASHBOARD_USERS, _id =>
//   getSymptomUsersService(_id, _id)
// );
const getSymptomUsers = id => {
  return async dispatch => {
    var data = await getUser(id);
    dispatch({
      type: GET_DASHBOARD_USERS,
      data: data
    });
  };
};
const getdetailStocks = user => {
  return async dispatch => {
    dispatch({ type: getStarted(GET_DETAIL_STOCKS) });
    let data = await getdetailStocksService();
    dispatch({
      type: GET_DETAIL_STOCKS,
      data: data,
      selectedUser: user
    });
  };
};
const changeUserStocks = user => {
  return async dispatch => {
    let data = JSON.parse(localStorage.getItem("lastUpdateSyptoms"));
    dispatch({
      type: GET_DETAIL_STOCKS,
      data: data,
      selectedUser: user
    });
    // try {
    //    for (let i = 0; i < rlt.data.length; i++) {
    //       let fetch = createActionThunk(GET_STOCK_INFO, () => getStockService(rlt.data[i]._id));
    //       dispatch(fetch());
    //    }
    // } catch (err) {
    //    //let fetch = createActionThunk(GET_STOCK_INFO, { data: [] });
    //    //dispatch(fetch());
    //    console.log("mainViewActions::getdetailStocks(), ERROR:" + err);
    // }
  };
};
const selectItem = (val, time, trans) => {
  return async dispatch => {
    try {
      dispatch({
        type: getStarted(SELECT_STOCK_ITEM),
        item: val
      });
      let data = await getStockGraphService(val._id, time);
      let news_data = await getNewsService(val.symptom, trans);
      dispatch({
        type: SELECT_STOCK_ITEM,
        item: {
          news: news_data,
          graph: data
        },
        symptom: val.symptom,
        id: val._id
      });
    } catch (e) {
      console.log("mainViewActions::selectItem(), ERROR:" + e);
    }
  };
};

const selectTime = (val, time) => {
  return async dispatch => {
    if (!val) return false;
    let data = await getStockGraphService(val, time);
    dispatch({
      type: SELECT_TIME_SELECTION,
      item: {
        time: time,
        graph: data
      }
    });
  };
};
const toggleSeverity = id => {
  return dispatch => {
    dispatch({
      type: TOGGLE_SEVERITY,
      item: { id: id }
    });
  };
};
const resetPage = () => dispatch =>
  dispatch({ type: RESET_VIEWSUMMARY_PAGE_MYDATA });
export default {
  getdetailStocks,
  selectItem,
  selectTime,
  toggleSeverity,
  changeUserStocks,
  getSymptomUsers,
  resetPage
};
