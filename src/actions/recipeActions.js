import { getMeasurements, getCuisines } from "../services/LookupService";
import {
  saveRecipe as saveRecipeService,
  createCuisine as createCuisineService,
  createMeasurement as createMeasurementService,
  getIngredients as getIngredientsService,
  searchIngredients as searchIngredientsService,
  searchRecipes as searchRecipesService
} from "../services/RecipeService";
import { createActionThunk } from "redux-thunk-actions";
import {
  getFailed,
  getStarted,
  getSucceeded,
  getEnded,
  RECIPE_INITIALIZATION,
  RECIPE_ADD_ITEM,
  RECIPE_EDIT_SELECTED,
  RECIPE_SAVE_ITEM,
  RECIPE_DELETE,
  RECIPE_SAVE,
  GET_RECIPE,
  RECIPE_CLEAR,
  RECIPE_CREATE_CUISINE,
  RECIPE_CREATE_MEASUREMENT,
  SEARCH_INGREDIENTS,
  SEARCH_RECIPES,
  ON_CHANGE_INGREDIENTFORM,
  ON_CHANGE_MYRECIPENTFORM,
  INGREDIENT_OPTION_SELECTED
} from "./constant";
import { submit, reset } from "redux-form";
import { array } from "prop-types";

const formInitialization = createActionThunk(RECIPE_INITIALIZATION, id =>
  Promise.all([getMeasurements(), getCuisines(), id])
);
const addClicked = () => {
  return dispatch => {
    dispatch(submit("formRecipeIngredient"));
  };
};
const saveClicked = () => {
  return dispatch => {
    dispatch(submit("formRecipeIngredient"));
  };
};

const addIngredientItem = item => {
  return dispatch => {
    dispatch({
      type: RECIPE_ADD_ITEM,
      item: item
    });
    dispatch(reset("formRecipeIngredient"));
  };
};

const editIngredientItem = (index, selectedIndex, item) => {
  return dispatch => {
    dispatch({
      type: RECIPE_EDIT_SELECTED,
      index: index
    });
    dispatch(reset("formRecipeIngredient"));
  };
};

const getIngredients = recipe => {
  return async dispatch => {
    dispatch({
      type: GET_RECIPE,
      item: recipe
    });
  };
};
const loadIngredients = recipe => {
  return async dispatch => {
    const data = await getIngredientsService(recipe);
    dispatch({
      type: GET_RECIPE,
      item: data
    });
  };
};

const saveIngredientItem = item => {
  return dispatch => {
    dispatch({
      type: RECIPE_SAVE_ITEM,
      item: item
    });
    dispatch(reset("formRecipeIngredient"));
  };
};

const deleteIngredientItem = () => {
  return dispatch => {
    dispatch({
      type: RECIPE_DELETE
    });
    dispatch(reset("formRecipeIngredient"));
  };
};

const saveRecipe = (recipe, callback) => {
  return async dispatch => {
    try {
      const data = await saveRecipeService(recipe);
      callback();
    } catch (e) {
      alert(e.message);
      return dispatch({ type: getFailed(RECIPE_SAVE), error: e });
    }
  };
};

const saveClickedRecipe = () => {
  return dispatch => {
    dispatch(submit("formRecipe"));
  };
};

const clearRecipe = () => {
  return dispatch => {
    dispatch({
      type: RECIPE_CLEAR
    });
    dispatch(reset("formRecipe"));
    dispatch(reset("formRecipeIngredient"));
  };
};

const createCuisine = createActionThunk(RECIPE_CREATE_CUISINE, cuisine =>
  createCuisineService(cuisine)
);

const createMeasurement = createActionThunk(
  RECIPE_CREATE_MEASUREMENT,
  measurement => createMeasurementService(measurement)
);

const searchIngredientOptions = key => {
  return async dispatch => {
    let data = [];
    dispatch({
      type: SEARCH_INGREDIENTS,
      //item: data,
      recipe: key
    });
    // try {
    //   //data = await searchIngredientsService(key);
    //   // if(data.length==0)
    //   //     data.push({value: key, label: "Create:" + key});

    // } catch (e) {
    //   // if(data.length==0)
    //   //     data.push({value: key, label: "Create:" + key});
    //   dispatch({
    //     type: SEARCH_INGREDIENTS,
    //     item: data,
    //     recipe: key
    //   });
    // }
  };
};
const searchRecipeOptions = key => {
  return async dispatch => {
    dispatch({
      type: SEARCH_RECIPES,
      recipe: key
    });
  };
};
const onChangeIngredientForm = e => {
  return dispatch => {
    dispatch({
      type: ON_CHANGE_INGREDIENTFORM,
      event: e
    });
  };
};
const onChangeRecipeForm = e => {
  return dispatch => {
    dispatch({
      type: ON_CHANGE_MYRECIPENTFORM,
      event: e
    });
  };
};
const IngredientOptionSelected = item => {
  return dispatch => {
    dispatch({
      type: INGREDIENT_OPTION_SELECTED,
      item: item
    });
  };
};
export default {
  formInitialization,
  addClicked,
  saveClicked,
  addIngredientItem,
  editIngredientItem,
  saveIngredientItem,
  deleteIngredientItem,
  saveRecipe,
  clearRecipe,
  getIngredients,
  createCuisine,
  createMeasurement,
  saveClickedRecipe,
  searchIngredientOptions,
  searchRecipeOptions,
  onChangeIngredientForm,
  onChangeRecipeForm,
  IngredientOptionSelected,
  loadIngredients
};
