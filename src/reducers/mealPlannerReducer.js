import _ from "lodash";
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
} from "../actions/constant";
import moment from "moment";
//import { NUTRIENTS_LIST } from "../pages/Constants";
//import { isNull } from "util";

const initialState = {
  planId: undefined,
  updateMode: false,
  replaceValertShowStatus: false,
  mealPlannerForm: { meals: "all", counterState: 0 },
  mealListAll: [],
  mealListShow: [],
  BaseNutrientsList: [],
  nutritionsList: [],
  typeAheadSearchOptions: [],
  typeAheadSearchObjects: [],
  dropDownList: [
    { value: "all", label: "all" },
    { value: "breakfast", label: "breakfast" },
    { value: "lunch", label: "lunch" },
    { value: "dinner", label: "dinner" },
    { value: "supper", label: "supper" },
    { value: "snack1", label: "snack 1" },
    { value: "snack2", label: "snack 2" },
    { value: "snack3", label: "snack 3" }
  ],
  isLoading: true,
  disabled: {
    newMeal: true,
    addBtn: true,
    savePageBtn: true,
    updatePageBtn: true,
    saveFailed: false
  },
  saveSuccess: false,
  counterState: 0,
  firstChange: false
};
function twoDecimals(n) {
  var log10 = n ? Math.floor(Math.log10(n)) : 0,
    div = log10 < 0 ? Math.pow(10, 1 - log10) : 100;

  return Math.round(n * div) / div;
}
function showingNutrientsArea(baseNutrientsList = [], allItems) {
  let selectedItems = allItems.filter(item => item.isSelected);
  let nutList = [...baseNutrientsList];
  nutList.forEach(nut => {
    let sum = 0;
    let fillItems = [];
    selectedItems.forEach(selIt => {
      let selItcheck = selIt.food.nutrients.filter(
        nutf => nutf.name == nut.name
      );
      if (selItcheck && selItcheck.length > 0) {
        //fillItems.push(selIt);
        sum = sum + selItcheck[0].size;
      }
    });
    nut.sum = twoDecimals(sum);
    if (nut.max > 0) {
      nut.percentage = ((nut.sum * 100) / nut.max).toFixed();
    } else {
      nut.percentage = 0;
    }
    // if (fillItems && fillItems.length > 0) {
    //   fillItems.forEach(fillItem => {
    //     if (nut.sum) {
    //       nut.sum = fillItem.size + nut.sum;
    //     } else {
    //       nut.sum = fillItem.size;
    //     }
    //   });
    // }
  });
  return nutList;
}

function showingGrid(allItems, meal) {
  var showList = [];
  if (meal != "all") {
    showList = allItems.filter(item => item.meal == meal);
  } else {
    showList = allItems;
  }
  return showList;
}
function disableChecker(state) {
  let disabled = {
    newMeal: true,
    addBtn: true,
    savePageBtn: true,
    updatePageBtn: true
  };
  if (state.mealPlannerForm.time && state.mealListAll.length > 0) {
    disabled.savePageBtn = false;
  }
  if (state.mealPlannerForm.time) {
    disabled.updatePageBtn = false;
  }
  if (
    state.mealPlannerForm.meals &&
    state.mealPlannerForm.meals != "null" &&
    state.mealPlannerForm.meals != "all"
  ) {
    disabled.newMeal = false;
  } else {
    return disabled;
  }
  if (state.mealPlannerForm._id) {
    disabled.addBtn = false;
  } else {
    return disabled;
  }

  return disabled;
}
function showListMaker(dayData) {
  let result = [
    { meal: "breakfast", food: dayData["breakfast"] },
    { meal: "lunch", food: dayData["lunch"] },
    { meal: "dinner", food: dayData["dinner"] },
    { meal: "supper", food: dayData["supper"] },
    { meal: "snack1", food: dayData["snack1"] },
    { meal: "snack2", food: dayData["snack2"] },
    { meal: "snack3", food: dayData["snack3"] }
  ];
  let newList = [];
  result.forEach(item => {
    if (item.food) {
      item.food.forEach(foodItem => {
        newList.push({ food: foodItem, meal: item.meal });
      });
    }
  });
  return newList;
}

// Recipe reducer
function reducer(state = initialState, action) {
  switch (action.type) {
    case getStarted(MEAL_PLANNER_INITIALIZATION):
    case getSucceeded(MEAL_PLANNER_INITIALIZATION):
      if (action.payload.isEditing) {
        state.mealPlannerForm.meals = "all";
        state.mealPlannerForm.time = moment(action.payload.date);
        let loadedPlan = action.payload.data[0];
        state.mealListAll = showListMaker(loadedPlan);
        state.planId = loadedPlan._id;
      } else {
        state.mealPlannerForm.meals = undefined;
        if (action.payload.date) {
          state.mealPlannerForm.time = moment(action.payload.date);
        } else {
          state.mealPlannerForm.time = undefined;
        }
      }
      if (action.payload.nutrientsList) {
        state.nutritionsList = showingNutrientsArea(
          action.payload.nutrientsList,
          state.mealListAll
        );
      }
      return {
        ...state,
        BaseNutrientsList: action.payload.nutrientsList,
        updateMode: action.payload.isEditing,
        mealListShow: showingGrid(
          state.mealListAll,
          state.mealPlannerForm.meals
        ),
        counterState: state.counterState + 1
      };
    case getFailed(MEAL_PLANNER_INITIALIZATION):
    case getEnded(MEAL_PLANNER_INITIALIZATION):
      return {
        ...state,
        isLoading: false,
        disabled: disableChecker(state)
      };
    case ON_CHANGE_MEALPLANNERFORM:
      if (action.event.target.name == "time") {
        state.previousTime = moment(state.mealPlannerForm.time);
      }
      state.mealPlannerForm[action.event.target.name] =
        action.event.target.value;
      if (action.event.target.name == "newMeal") {
        // let arrRecipes = [];
        // for (const item of action.data) {
        //   arrRecipes.push(item.recipe);
        // }
        // state.typeAheadSearchObjects = action.data;
        // state.typeAheadSearchOptions = arrRecipes;
        state.mealPlannerForm._id = "";
      } else if (action.event.target.name == "addMealPlan") {
        state.mealPlannerForm.selectedFood = action.data;
        state.mealPlannerForm._id = action.data._id;
        state.mealPlannerForm.newMeal = action.data.recipe_full;
      } else if (action.event.target.name == "time") {
        if (action.data) {
          let loadedPlan = action.data[0];
          state.updateMode = true;
          state.planId = loadedPlan._id;
          state.mealPlannerForm.meals = "all";

          if (state.mealListAll.length > 0) {
            state.replaceValertShowStatus = true;
            state.loadedMealList = showListMaker(loadedPlan);
          } else {
            state.mealListAll = showListMaker(loadedPlan);
          }
        } else {
          state.updateMode = false;
          state.planId = undefined;
        }
      } else if (action.event.target.name == "meals") {
        state.mealListAll.forEach(item => {
          if (
            item.meal == action.event.target.value ||
            action.event.target.value == "all"
          ) {
            item.isSelected = true;
          } else {
            item.isSelected = false;
          }
        });
      }
      return {
        ...state,
        disabled: disableChecker(state),
        mealListShow: showingGrid(
          state.mealListAll,
          state.mealPlannerForm.meals
        ),
        counterState: state.counterState + 1,
        mealPlannerForm: {
          ...state.mealPlannerForm,
          counterState: state.mealPlannerForm.counterState + 1
        },
        nutritionsList: showingNutrientsArea(
          state.BaseNutrientsList,
          state.mealListAll
        )
      };
    case ADD_NEW_FOOD_MEAL_PLANNER:
      state.mealListAll.push({
        food: state.mealPlannerForm.selectedFood,
        meal: state.mealPlannerForm.meals
      });
      let form = {
        ...state.mealPlannerForm,
        _id: undefined,
        newMeal: "",
        selectedFood: {},
        addMealPlan: {},
        disabled: disableChecker(state)
      };
      state.mealPlannerForm = form;
      return {
        ...state,
        typeAheadSearchOptions: [],
        disabled: disableChecker(state),
        mealListShow: showingGrid(
          state.mealListAll,
          state.mealPlannerForm.meals
        ),
        firstChange: true
      };
    case MEAL_ITEM_CLICK_MEALPALNNER:
      state.mealListAll.forEach(item => {
        if (item.food._id == action.id) {
          item.isSelected = !item.isSelected;
        }
      });
      return {
        ...state,
        disabled: disableChecker(state),
        mealListShow: showingGrid(
          state.mealListAll,
          state.mealPlannerForm.meals
        ),
        nutritionsList: showingNutrientsArea(
          state.BaseNutrientsList,
          state.mealListAll
        ),
        disabled: disableChecker(state),
        counterState: state.counterState + 1
      };
    case DELETE_FOOD_MEAL_PLANNER:
      let deletedItem = 0;
      state.mealListAll.forEach((item, i) => {
        if (item.food._id == action.id) {
          deletedItem = i;
        }
      });
      state.mealListAll.splice(deletedItem, 1);
      return {
        ...state,
        disabled: disableChecker(state),
        mealListShow: showingGrid(
          state.mealListAll,
          state.mealPlannerForm.meals
        ),
        nutritionsList: showingNutrientsArea(
          state.BaseNutrientsList,
          state.mealListAll
        ),
        counterState: state.counterState + 1,
        firstChange: true
      };
    case getStarted(ADD_UPDATE_MEAL_PLANNER):
      return { ...state, isLoading: true };
    case getSucceeded(ADD_UPDATE_MEAL_PLANNER):
      const redirectTime = moment(action.payload.time).format("Y-M-D");
      setTimeout(() => {
        window.location.href = `/mealplansummary/${redirectTime}`;
      }, 4000);
      return { ...state, saveSuccess: true };
    case getFailed(ADD_UPDATE_MEAL_PLANNER):
      return { ...state, saveFailed: true };

    case getEnded(ADD_UPDATE_MEAL_PLANNER):
      return { ...state, isLoading: false };
    case TOGGLE_UNSAVE_MESSAGE:
      return { ...state, saveFailed: !state.saveFailed };
    case LIST_COMBINE_MEAL_PLANNER:
      if (action.status == "combine") {
        var loadedList = [];
        state.loadedMealList.forEach(item => {
          const found = state.mealListAll.some(
            el => el.meal === item.meal && el.food._id === item.food._id
          );
          if (!found) loadedList.push(item);
        });
        state.mealListAll = [...state.mealListAll, ...loadedList];
        state.firstChange = true;
      } else if (action.status == "replace") {
        state.mealListAll = state.loadedMealList;
        state.firstChange = true;
      } else {
        state.mealPlannerForm.time = state.previousTime;
      }
      state.replaceValertShowStatus = false;
      state.mealPlannerForm.meals = "all";
      return {
        ...state,
        disabled: disableChecker(state),
        mealListShow: showingGrid(
          state.mealListAll,
          state.mealPlannerForm.meals
        ),
        nutritionsList: showingNutrientsArea(
          state.BaseNutrientsList,
          state.mealListAll
        ),
        counterState: state.counterState + 1
      };
    default:
      return state;
  }
}

export default reducer;
