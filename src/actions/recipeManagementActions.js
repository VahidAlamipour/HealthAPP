import { createActionThunk } from 'redux-thunk-actions';

import { 
  getOwnRecipes, 
  deleteRecipes as deleteRecipesService,
  updateRating as updateRatingService,
  updateRank as updateRankService,
  getIngredients as getIngredientsService,
} from '../services/RecipeService';
import {
    RECIPE_MANAGEMENT_INITIALIZATION,
    RECIPE_MANAGEMENT_INGREDIENT_TOGGLE,
    RECIPE_MANAGEMENT_INGREDIENT_FILTER,
    RECIPE_MANAGEMENT_RECIPE_SELECT_TOGGLE,
    RECIPE_MANAGEMENT_DELETE,
    RECIPE_MANAGEMENT_UPDATE_RATING,
    RECIPE_MANAGEMENT_UPDATE_RANK, GET_RECIPE, getFailed
} from './constant';

const initialization = createActionThunk(RECIPE_MANAGEMENT_INITIALIZATION, () => getOwnRecipes());
const ingredientToggle = (id, isExpand, isDone) => {
    if(isExpand || (typeof isDone!="undefined" && isDone)) {
        return (dispatch) => {
            dispatch({
                type: RECIPE_MANAGEMENT_INGREDIENT_TOGGLE,
                item: {_id: id}
            });
        };
    }
    else{
        return async (dispatch) => {
            try {
                const recipe={
                    id: id
                };
                let data = await getIngredientsService(recipe);
                dispatch({
                    type: RECIPE_MANAGEMENT_INGREDIENT_TOGGLE,
                    item: data
                });
            }
            catch (e) {
                console.log(e);
                // return dispatch({type: getFailed(GET_RECIPE), error: e});
            }
        }
    }
    
};
const ingredientFilter = (search, sortBy) => {
  if(typeof search=="undefined")
    search="";
  return (dispatch) => {
    dispatch({
      type: RECIPE_MANAGEMENT_INGREDIENT_FILTER,
      search: search,
      sortBy: sortBy
    });
  }
}
const recipeSelectToggle = (id) => {
  return (dispatch) => {
    dispatch({
      type: RECIPE_MANAGEMENT_RECIPE_SELECT_TOGGLE,
      id: id
    });
  };
};
const deleteRecipes = createActionThunk(RECIPE_MANAGEMENT_DELETE, (ids) => deleteRecipesService(ids));
const updateRating = createActionThunk(RECIPE_MANAGEMENT_UPDATE_RATING, (id, rating) => updateRatingService(id, rating));
const updateRank = createActionThunk(RECIPE_MANAGEMENT_UPDATE_RANK, (id, rank, rankBefore) => updateRankService(id, rank, rankBefore));

export default { 
  initialization, 
  ingredientToggle, 
  ingredientFilter, 
  recipeSelectToggle, 
  deleteRecipes, 
  updateRating, 
  updateRank 
};
