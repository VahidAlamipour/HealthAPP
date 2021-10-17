import _ from "lodash";
import {
  checkStatus,
  parseJSON,
  getApiUrl,
  getHeaderForAjax
} from "./ServiceHelper";
import { getLoggedInUser } from "./AuthenticationService";

export function getPlan(date, otherObjects) {
  // let url =
  //   getApiUrl() + "/users/" + getLoggedInUser()._id + "/recipes/" + recipe.id;

  // return fetch(url, {
  //   method: "GET",
  //   headers: getHeaderForAjax()
  // })
  //   .then(checkStatus)
  //   .then(parseJSON);
  return {
    ...otherObjects,
    date,
    plan: {
      date,
      meals: [
        {
          title: "Breakfast",
          foods: []
        },
        {
          title: "Lunch",
          foods: [
            { id: `2323234wew2`, name: "egg" },
            { id: `2tea2tea2tea2tea`, name: "Tea" }
          ]
        },
        {
          title: "Dinner",
          foods: [
            { id: `2323234wew2`, name: "egg" },
            { id: `2tea2tea2tea2tea`, name: "Tea" }
          ]
        },
        {
          title: "supper",
          foods: [
            { id: `2323234wew2`, name: "egg" },
            { id: `2tea2tea2tea2tea`, name: "Tea" }
          ]
        },
        {
          title: "snack 1",
          foods: []
        },
        {
          title: "snack 2"
        },
        {
          title: "snack 3",
          foods: [
            { id: `2323234wew2`, name: "egg" },
            { id: `2tea2tea2tea2tea`, name: "Tea" }
          ]
        }
      ]
    }
  };
}
export function searchIngredients(input) {
  const userId = getLoggedInUser()._id;
  let url =
    getApiUrl() +
    "/users/" +
    userId +
    "/recipes/keywordCustom/11111/" +
    input +
    "/1";
  return fetch(url, {
    method: "GET",
    headers: getHeaderForAjax()
  })
    .then(checkStatus)
    .then(parseJSON);
}
export function getDetail(_id) {
  const userId = getLoggedInUser()._id;
  let url = getApiUrl() + "/users/" + userId + "/recipes/" + _id;
  return fetch(url, {
    method: "GET",
    headers: getHeaderForAjax()
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(res => {
      return res;
    });
}
export function addUpdateMealPlanService(time, mealListAll, planId) {
  const userId = getLoggedInUser()._id;
  function vFilter(meal) {
    let result = [];
    mealListAll.forEach(element => {
      if (element.meal.toLowerCase() == meal) {
        result.push({ _id: element.food._id, recipe: element.food.recipe });
      }
    });
    return result;
  }

  const body = {
    date: time.unix() * 1000,
    breakfast: vFilter("breakfast"),
    lunch: vFilter("lunch"),
    dinner: vFilter("dinner"),
    supper: vFilter("supper"),
    snack1: vFilter("snack1"),
    snack2: vFilter("snack2"),
    snack3: vFilter("snack3")
  };
  let url = getApiUrl() + "/users/" + userId + "/mealplans";
  let method = "post";
  if (planId) {
    url = `${url}/${planId}`;
    method = "put";
  }
  return fetch(url, {
    method: method,
    headers: getHeaderForAjax(),
    body: JSON.stringify(body)
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(data => ({ data, time }));
}

export function getNutrientsList() {
  const userId = getLoggedInUser()._id;
  let url = getApiUrl() + "/users/" + userId + "/mealplans/nutrients";
  return fetch(url, {
    method: "GET",
    headers: getHeaderForAjax()
  })
    .then(checkStatus)
    .then(parseJSON);
}
export function getPlanByDate(from, howManyDay) {
  const userId = getLoggedInUser()._id;
  let url = `${getApiUrl()}/users/${userId}/mealplans?date=${from}&day=${howManyDay}`;
  return fetch(url, {
    method: "GET",
    headers: getHeaderForAjax()
  })
    .then(checkStatus)
    .then(parseJSON);
}
export function dragAndDropService(fromTime, fromMeal, foodId, toTime, toMeal) {
  const userId = getLoggedInUser()._id;
  let url = `${getApiUrl()}/users/${userId}/mealplans/?to_date=${toTime}&from_date=${fromTime}&to_meal=${toMeal}&from_meal=${fromMeal}&_id=${foodId}`;
  let method = "put";
  return fetch(url, {
    method: method,
    headers: getHeaderForAjax()
  }).then(checkStatus);
}
