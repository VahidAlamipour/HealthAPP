import _ from "lodash";
import {
  checkStatus,
  parseJSON,
  getApiUrl,
  getHeaderForAjax
} from "./ServiceHelper";
import { getLoggedInUser } from "./AuthenticationService";

export function getOwnRecipes() {
  const userId = getLoggedInUser()._id;
  return fetch(getApiUrl() + "/users/" + userId + "/myrecipes/", {
    method: "GET",
    headers: getHeaderForAjax()
  })
    .then(checkStatus)
    .then(parseJSON);
  // .then(res => {
  //   // return _.sortBy(res, ["rank"]);
  // });
}

// Recipe filter for filter recipe by name, ingredient name, etc
export const recipeFilter = key => recipe => {
  if (recipe.recipe && _.startsWith(recipe.recipe.toLowerCase(), key)) {
    return recipe;
  }
  if (recipe.cuisine && _.startsWith(recipe.cuisine.toLowerCase(), key)) {
    return recipe;
  }

  // let isIngredientExist = false;
  // if (typeof recipe.ingredients !== 'undefined') {
  //     for (let i = 0; i < recipe.ingredients.length; i++) {
  //         const ingredient = recipe.ingredients[i];
  //         if (_.startsWith(ingredient.name.toLowerCase(), key)) {
  //             isIngredientExist = true;
  //             break;
  //         }
  //         else if (_.startsWith(ingredient.brand.toLowerCase(), key)) {
  //             isIngredientExist = true;
  //             break;
  //         }
  //         else if (_.startsWith(ingredient.comment.toLowerCase(), key)) {
  //             isIngredientExist = true;
  //             break;
  //         }
  //     }
  // }

  // if (isIngredientExist) {
  //     return recipe;
  // }
};

export function deleteRecipes(ids) {
  const userId = getLoggedInUser()._id;
  return (
    fetch(getApiUrl() + "/users/" + userId + "/recipes/" + ids, {
      method: "delete",
      headers: getHeaderForAjax(),
      body: ids
    })
      //.then(parseJSON)
      .then(checkStatus)
      .then(res => {
        return ids;
      })
      .catch(error => console.log(error))
  );
}

export function updateRating(id, rating) {
  const userId = getLoggedInUser()._id;
  let url =
    getApiUrl() + "/users/" + userId + "/recipes/" + id + "/rate/" + rating;
  return (
    fetch(url, {
      method: "put",
      headers: getHeaderForAjax()
    })
      .then(checkStatus)
      // .then(parseJSON)
      .then(() => {
        // localStorage.setItem("rating_" + id, rating);
        return { id: id, rating: rating };
      })
  );
}

export function updateRank(id, rank, rankBefore) {
  const userId = getLoggedInUser()._id;
  let url =
    getApiUrl() + "/users/" + userId + "/recipes/" + id + "/rank/" + rank;
  return (
    fetch(url, {
      method: "PUT",
      headers: getHeaderForAjax()
    })
      .then(checkStatus)
      //    .then(parseJSON)
      .then(() => {
        return { id: id, rank: rank, rankBefore: rankBefore };
      })
  );
}

export function saveRecipe(recipe) {
  const userId = getLoggedInUser()._id;
  let url = getApiUrl() + "/users/" + userId + "/recipes";
  let method = "post";
  if (!(recipe._id == undefined) && recipe._id != "") {
    url = url + "/" + recipe._id;
    method = "put";
    // if(confirm("Are you sure to update?")==false)
    //     return;
  }
  return fetch(url, {
    method: method,
    headers: getHeaderForAjax(),
    body: JSON.stringify(recipe)
  })
    .then(checkStatus)
    .then(parseJSON);
}

export function createCuisine(cuisine) {
  const userId = getLoggedInUser()._id;
  let url = getApiUrl() + "/users/" + userId + "/recipes/cuisines";
  return fetch(url, {
    method: "POST",
    headers: getHeaderForAjax(),
    body: JSON.stringify(cuisine)
  })
    .then(checkStatus)
    .then(parseJSON);
}

export function createMeasurement(measurement) {
  const userId = getLoggedInUser()._id;
  let url = getApiUrl() + "/users/" + userId + "/recipes/measurements";
  return fetch(url, {
    method: "POST",
    headers: getHeaderForAjax(),
    body: JSON.stringify(measurement)
  }).then(checkStatus);
}

export function getIngredients(recipe) {
  let url =
    getApiUrl() + "/users/" + getLoggedInUser()._id + "/recipes/" + recipe.id;

  return fetch(url, {
    method: "GET",
    headers: getHeaderForAjax()
  })
    .then(checkStatus)
    .then(parseJSON);
}

export function searchIngredients(input) {
  const userId = getLoggedInUser()._id;
  let url =
    getApiUrl() +
    "/users/" +
    userId +
    "/recipes/keywordCustom/11/" +
    input +
    "/1";
  return fetch(url, {
    method: "GET",
    headers: getHeaderForAjax()
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(data => {
      let arrRecipes = [];
      for (const item of data) {
        arrRecipes.push(item.recipe_full);
      }
      return arrRecipes;
    });
}

export function searchRecipes(input) {
  const userId = getLoggedInUser()._id;
  let url =
    getApiUrl() +
    "/users/" +
    userId +
    "/recipes/keywordCustom/011/" +
    input +
    "/1";
  //let url = getApiUrl() + '/users/' + userId + '/recipes/keyword/' + input + '/1';
  //let url = getApiUrl() + '/recipes/keyword/' + input + '/';
  return fetch(url, {
    method: "GET",
    headers: getHeaderForAjax()
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(res => {
      let data = {
        show: [],
        data: []
      };
      for (const item of res) {
        data.data.push({ id: item._id, value: item.recipe });
        data.show.push(item.recipe);
      }
      return data;
    });
}
