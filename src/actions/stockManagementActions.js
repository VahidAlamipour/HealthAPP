import { createActionThunk } from "redux-thunk-actions";
import {
  SWIPE_STOCKS,
  GET_STOCKS,
  DELETE_STOCK,
  ADD_STOCK,
  ORDER_STOCK,
  RESET_STOCK_PAGE_MYDATA
} from "./constant";
import {
  getStocks as getStocksService,
  deleteStock as deleteStockService,
  addStock as addStockService,
  addNewOrdering
} from "../services/StockService";

const getStocks = createActionThunk(GET_STOCKS, user => getStocksService(user));

const deleteStock = createActionThunk(DELETE_STOCK, _id =>
  deleteStockService(_id)
);

const addStock = createActionThunk(ADD_STOCK, _id => addStockService(_id));

const swipeStocks = (oldIndex, newIndex) => {
  return dispatch => {
    dispatch({
      type: SWIPE_STOCKS,
      data: {
        oldIndex: oldIndex,
        newIndex: newIndex
      }
    });
  };
};
const pressDone = createActionThunk(ORDER_STOCK, (list, user) =>
  addNewOrdering(list, user)
);
const resetPage = () => dispatch => dispatch({ type: RESET_STOCK_PAGE_MYDATA });

export default {
  getStocks,
  swipeStocks,
  deleteStock,
  addStock,
  pressDone,
  resetPage
};
