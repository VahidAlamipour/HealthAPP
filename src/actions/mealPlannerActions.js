//import { getMeasurements, getCuisines } from "../services/LookupService";
import {
  searchIngredients,
  getDetail,
  addUpdateMealPlanService,
  getNutrientsList,
  getPlanByDate
} from "../services/MealPlannerService";
import { createActionThunk } from "redux-thunk-actions";
import {
  getFailed,
  getStarted,
  getSucceeded,
  getEnded,
  MEAL_PLANNER_INITIALIZATION,
  ON_CHANGE_MEALPLANNERFORM,
  ADD_NEW_FOOD_MEAL_PLANNER,
  MEAL_ITEM_CLICK_MEALPALNNER,
  DELETE_FOOD_MEAL_PLANNER,
  ADD_UPDATE_MEAL_PLANNER,
  LIST_COMBINE_MEAL_PLANNER,
  TOGGLE_UNSAVE_MESSAGE
} from "./constant";
import moment from "moment";

const initialization = createActionThunk(
  MEAL_PLANNER_INITIALIZATION,
  async date => {
    const nutrientsList = await getNutrientsList();
    if (date) {
      let data = undefined;
      let isEditing = true;
      try {
        data = await getPlanByDate(moment(date).unix() * 1000, 1);
      } catch (e) {
        data = undefined;
        isEditing = false;
      } finally {
        return { isEditing, date, nutrientsList, data };
      }
    } else {
      return { isEditing: false, nutrientsList };
    }
  }
);
const onChangeMealPlanner = e => {
  return async dispatch => {
    if (e.target.name == "newMeal") {
      // var data = [];
      // try {
      //   data = await searchIngredients(e.target.value);
      // } catch (ex) {
      //   data = [];
      // } finally {
      //   dispatch({
      //     type: ON_CHANGE_MEALPLANNERFORM,
      //     event: e,
      //     data: data
      //   });
      // }
      dispatch({
        type: ON_CHANGE_MEALPLANNERFORM,
        event: e
      });
    } else if (e.target.name == "addMealPlan") {
      //let data = await getDetail(e.target.value._id);
      dispatch({
        type: ON_CHANGE_MEALPLANNERFORM,
        event: e,
        data: e.target.value
      });
    } else if (e.target.name == "time") {
      let data = undefined;
      try {
        data = await getPlanByDate(e.target.value.unix() * 1000, 1);
      } catch (e) {
        data = undefined;
      } finally {
        dispatch({
          type: ON_CHANGE_MEALPLANNERFORM,
          event: e,
          data: data
        });
      }
    } else {
      dispatch({
        type: ON_CHANGE_MEALPLANNERFORM,
        event: e
      });
    }
  };
};
const mealItemOnClick = id => {
  return dispatch => {
    dispatch({
      type: MEAL_ITEM_CLICK_MEALPALNNER,
      id
    });
  };
};
const addFood = () => dispatch =>
  dispatch({
    type: ADD_NEW_FOOD_MEAL_PLANNER
  });
const deleteItem = id => dispatch =>
  dispatch({ type: DELETE_FOOD_MEAL_PLANNER, id });
const savePage = createActionThunk(
  ADD_UPDATE_MEAL_PLANNER,
  (time, mealListAll, planId) =>
    addUpdateMealPlanService(time, mealListAll, planId)
);
const listCombine = status => dispatch => {
  return dispatch({ type: LIST_COMBINE_MEAL_PLANNER, status });
};
const toggleUnsaveMessage = () => ({ type: TOGGLE_UNSAVE_MESSAGE });

export default {
  initialization,
  onChangeMealPlanner,
  addFood,
  mealItemOnClick,
  deleteItem,
  savePage,
  listCombine,
  toggleUnsaveMessage
};
