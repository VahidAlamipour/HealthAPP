import { createActionThunk } from "redux-thunk-actions";
import {
  GET_STOCK_INFO,
  GRAPH_INITIALIZATION,
  RECIPE_INITIALIZATION,
  SELECT_STOCK_ITEM,
  UPDATE_BIG_GRAPH,
  ON_CHANGE_ANALYZEFORM,
  ON_CHANGE_FACTOR_ANALYZEFORM,
  ANALYZEPAGE_DATE_CHANGED,
  ON_CHANGE_USER_ANALYZEFORM,
  RESET_ANALYZE_PAGE
} from "./constant";
import {
  getStock as getStockService,
  getSymptomChart as getSymptomChartService,
  getSymptoms as getSymptomsService,
  getGraphFormData,
  getdetailStocks,
  getAllFactors,
  getNutrients,
  getStockGraph,
  getFoodGragh
} from "../services/StockService";
import { getUser } from "../services/UserService";
import moment from "moment";

import { reset, submit } from "redux-form";
import { getCuisines, getMeasurements } from "../services/LookupService";

// const graphInitialization = createActionThunk(
//     GRAPH_INITIALIZATION,
//     (_id) => Promise.all([getFactorsService(), getSymptomsService(),getUsersService(_id, _id)])
// );

// const graphInitialization = createActionThunk(GRAPH_INITIALIZATION, _id =>
//   getGraphFormData(_id)
// );
const graphInitialization = id => {
  return async dispatch => {
    var users = await getUser(id);
    var data = await getdetailStocks();
    var factors = await getAllFactors();
    dispatch({
      type: GRAPH_INITIALIZATION,
      users: users,
      data: data,
      factors: factors
    });
  };
};
// const updateGraph = data => {
//   return async dispatch => {
//     try {
//       let fetch = createActionThunk(UPDATE_BIG_GRAPH, () =>
//         Promise.all([
//           getSymptomChartService(data, "symptom"),
//           getSymptomChartService(data, "factor")
//         ])
//       );
//       dispatch(fetch());
//     } catch (e) {
//       console.log(e);
//     }
//   };
// };
const onChangeForm = e => {
  return async dispatch => {
    var factors = [];
    if (e.target.name == "user") {
      factors = await getAllFactors(e.target.value);
    }

    dispatch({
      type: ON_CHANGE_ANALYZEFORM,
      event: e,
      factors: factors
    });
  };
};
const onChangefactor = createActionThunk(
  ON_CHANGE_FACTOR_ANALYZEFORM,
  (id, text, subUserId) => getNutrients(id, text, subUserId)
);
const onDateChange = val => {
  return dispatch => {
    dispatch({
      type: ANALYZEPAGE_DATE_CHANGED,
      val: moment(val)
    });
  };
};
// const onChangeUser = val => {
//   return dispatch => {
//     dispatch({
//       type: ON_CHANGE_USER_ANALYZEFORM,
//       id: val
//     });
//   };
// };
// const onDateChange = val => {
//   return dispatch => {
//     dispatch({
//       type: ANALYZEPAGE_DATE_CHANGED,
//       val: moment(val)
//     });
//   };
// };
const plot = createActionThunk(UPDATE_BIG_GRAPH, optform =>
  Promise.all([
    getStockGraph(optform.symptom, optform.end, optform.start, optform.user),
    getFoodGragh(
      optform.factor,
      optform.nutrients,
      optform.end,
      optform.start,
      optform.user
    )
  ])
);
const resetPage = () => {
  return dispatch => {
    dispatch({
      type: RESET_ANALYZE_PAGE
    });
  };
};
export default {
  graphInitialization,
  plot,
  onChangeForm,
  onChangefactor,
  onDateChange,
  resetPage
  //onChangeUser
};
