import _ from "lodash";
import {
  getFailed,
  getStarted,
  getSucceeded,
  getEnded,
  statusEnum,
  RECIPE_MANAGEMENT_INITIALIZATION,
  RECIPE_MANAGEMENT_INGREDIENT_TOGGLE,
  RECIPE_MANAGEMENT_INGREDIENT_FILTER,
  RECIPE_MANAGEMENT_RECIPE_SELECT_TOGGLE,
  RECIPE_MANAGEMENT_DELETE,
  RECIPE_MANAGEMENT_UPDATE_RATING,
  RECIPE_MANAGEMENT_UPDATE_RANK
} from "../actions/constant";

import { recipeFilter } from "../services/RecipeService";

const initialState = {
  isLoading: false,
  status: statusEnum.DEFAULT,
  recipesAll: [],
  recipes: [],
  recipeManagementForm: {
    sortBy: "rank"
  },
  counterState: 0
};
function orderedListMaker(recipesFilter, sortBy) {
  if (sortBy == "null" || sortBy == "rank") {
    return _.orderBy(recipesFilter, ["rank"], ["asc"]);
  } else if (sortBy == "rating") {
    return _.orderBy(recipesFilter, ["rate", "rank"], ["desc", "asc"]);
  } else if (sortBy == "recipe") {
    return _.orderBy(recipesFilter, ["recipe", "rank"], ["asc", "asc"]);
  } else {
    return _.orderBy(recipesFilter, [sortBy, "rank"], ["desc", "asc"]);
  }
}

function reducer(state = initialState, action) {
  switch (action.type) {
    case getStarted(RECIPE_MANAGEMENT_INITIALIZATION):
    case getStarted(RECIPE_MANAGEMENT_DELETE):
    case getStarted(RECIPE_MANAGEMENT_UPDATE_RATING):
      return { ...state, isLoading: true };
    case getSucceeded(RECIPE_MANAGEMENT_INITIALIZATION):
      const recipesInitial = action.payload.map(recipe => {
        recipe.isExpand = false;
        recipe.isSelected = false;
        recipe.rate = recipe.rate || 0;

        return recipe;
      });

      var defaultRecipeManagmentSorting = localStorage.getItem(
        "defaultRecipeManagmentSorting"
      );
      var recipeOrdered = orderedListMaker(
        { ...recipesInitial },
        defaultRecipeManagmentSorting
      );
      return {
        ...state,
        status: statusEnum.SUCCESS,
        recipesAll: recipesInitial,
        recipes: recipeOrdered,
        recipeManagementForm: { sortBy: defaultRecipeManagmentSorting }
      };
    case getSucceeded(RECIPE_MANAGEMENT_DELETE):
      const ids = action.payload;
      const recipesDelete = [];
      const recipesAllDelete = [];

      // remove from recipes
      state.recipes.map(recipe => {
        if (!_.includes(ids, recipe._id)) {
          recipe.isExpand = false;
          recipe.isSelected = false;
          recipesDelete.push(recipe);
        }
        return recipe;
      });

      // remove from recipes all
      state.recipesAll.map(recipe => {
        if (!_.includes(ids, recipe._id)) {
          recipe.isExpand = false;
          recipe.isSelected = false;
          recipesAllDelete.push(recipe);
        }
        return recipe;
      });

      return {
        ...state,
        recipesAll: recipesAllDelete,
        recipes: recipesDelete,
        status: statusEnum.SUCCESS
      };
    case getSucceeded(RECIPE_MANAGEMENT_UPDATE_RATING):
      var rankrecipes = state.recipes;
      var recipeUpdateRatings = rankrecipes.map(recipe => {
        if (recipe._id === action.payload.id) {
          recipe.rate = action.payload.rating;
        }
        return recipe;
      });
      return {
        ...state,
        recipes: recipeUpdateRatings
        //counterState: state.counterState + 1,
        //recipeManagementForm: { ...state.recipeManagementForm, sortBy: "null" }
      };
    case getSucceeded(RECIPE_MANAGEMENT_UPDATE_RANK):
      const rankUpdated = parseInt(action.payload.rank, 10);
      const rankBefore =
        action.payload.rankBefore === ""
          ? 0
          : parseInt(action.payload.rankBefore, 10);
      var recipeUpdateRanks = state.recipes.map(recipe => {
        if (recipe._id === action.payload.id) {
          recipe.rank = rankUpdated;
        } else {
          if (
            rankUpdated > rankBefore &&
            recipe.rank <= rankUpdated &&
            recipe.rank > rankBefore
          ) {
            recipe.rank = recipe.rank - 1;
          }
          if (
            rankUpdated < rankBefore &&
            recipe.rank >= rankUpdated &&
            recipe.rank < rankBefore
          ) {
            recipe.rank = recipe.rank + 1;
          }
        }
        //localStorage.setItem("rank_" + recipe._id, recipe.rank);

        return recipe;
      });
      recipeUpdateRanks = _.orderBy(recipeUpdateRanks, ["rank"], ["asc"]);
      return {
        ...state,
        recipes: recipeUpdateRanks,
        recipeManagementForm: { ...state.recipeManagementForm, sortBy: "rank" }
      };
    case getFailed(RECIPE_MANAGEMENT_INITIALIZATION):
      return {
        ...state,
        actionResponse: action.payload,
        status: statusEnum.ERROR
      };
    case getEnded(RECIPE_MANAGEMENT_INITIALIZATION):
      // recipesFilter = state.recipes;
      // recipesFilter = _.sortBy(recipesFilter, ["rank"]);
      return { ...state, isLoading: false };
    case getEnded(RECIPE_MANAGEMENT_DELETE):
    case getEnded(RECIPE_MANAGEMENT_UPDATE_RATING):
      return { ...state, isLoading: false };
    case RECIPE_MANAGEMENT_INGREDIENT_TOGGLE:
      const recipeToggles = state.recipes.map(recipe => {
        if (recipe._id === action.item._id) {
          recipe.isExpand = !recipe.isExpand;
          if (
            recipe.isExpand &&
            (typeof recipe.isDone == "undefined" || !recipe.isDone)
          ) {
            recipe.ingredients = action.item.ingredients;
            recipe.cuisine = action.item.cuisine;
            recipe.original_size = action.item.original_size;
            recipe.symbol = action.item.symbol;
            recipe.comment = action.item.comment;
            recipe.isDone = 1;
          }
        }
        return recipe;
      });
      return { ...state, recipes: recipeToggles };
    case RECIPE_MANAGEMENT_INGREDIENT_FILTER:
      const key = action.search ? action.search.toLowerCase() : "";
      let recipesFilter = state.recipes;
      recipesFilter = _.filter(state.recipesAll, recipeFilter(key));
      action.sortBy = action.sortBy == "null" ? "rank" : action.sortBy;
      localStorage.setItem("defaultRecipeManagmentSorting", action.sortBy);
      recipesFilter = orderedListMaker(recipesFilter, action.sortBy);
      return {
        ...state,
        recipes: recipesFilter,
        recipeManagementForm: { search: action.search, sortBy: action.sortBy }
      };
    case RECIPE_MANAGEMENT_RECIPE_SELECT_TOGGLE:
      const recipeSelectToggles = state.recipes.map(recipe => {
        if (recipe._id === action.id) {
          recipe.isSelected = !recipe.isSelected;
        }
        return recipe;
      });
      return { ...state, recipes: recipeSelectToggles };
    default:
      return state;
  }
}

export default reducer;
