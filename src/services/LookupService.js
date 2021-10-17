import _ from "lodash";
import {
  checkStatus,
  parseJSON,
  getApiUrl,
  getHeaderForAjax
} from "./ServiceHelper";
import { getLoggedInUser } from "./AuthenticationService";
import { checkSettingData } from "./PublicService";

// export function getLocations() {
//     return (
//       fetch(getApiUrl() + "/lookup/countrycity", {
//         method: "GET",
//         headers: getHeaderForAjax()
//       })
//         /*.then(checkStatus)*/
//         .then(function(response) {
//           return checkStatus(response);
//         })
//         /*.then(parseJSON);*/
//         .then(function(response) {
//           return parseJSON(response);
//         })
//     );
//   }
export async function getLocations() {
  var setting = await checkSettingData();
  return setting.countrycities.map(item => {
    return { value: item._id, label: item.name };
  });
}

// export function getEthnicities() {
//     return fetch(getApiUrl() + '/lookup/ethnicity', {
//         method: 'GET',
//         headers: getHeaderForAjax()
//     })
//         .then(checkStatus)
//         .then(parseJSON);
// }
export async function getEthnicities() {
  var setting = await checkSettingData();
  return setting.ethnicities.map(item => {
    return { value: item._id, label: item.name };
  });
}

export function getEthnicitiesOptions(ethnicitiesProps) {
  let ethnicityOptions = [];
  _.forIn(ethnicitiesProps, (ethnicities, group) => {
    ethnicityOptions.push({ optGroup: group });
    for (const ethnicity of ethnicities) {
      ethnicityOptions.push({ value: ethnicity, label: ethnicity });
    }
  });

  return ethnicityOptions;
}

export function getMeasurements() {
  return fetch(getApiUrl() + "/recipes/measurement_units/", {
    method: "GET",
    headers: getHeaderForAjax()
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(data => {
      let arrMeasurements = [];
      for (const item of data) {
        arrMeasurements.push(item);
      }
      return arrMeasurements;
    });
}

export function getIngredientOptions(input, callback) {
  const userId = getLoggedInUser()._id;
  let url =
    getApiUrl() + "/users/" + userId + "/recipes/keyword/" + input + "/";
  return fetch(url, {
    method: "GET",
    headers: getHeaderForAjax()
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(data => {
      let arrIngredient = [];
      for (const ingredient of data) {
        arrIngredient.push({ value: ingredient, label: ingredient });
      }
      return arrIngredient;
    });
}

export function searchRecipe(input, callback) {
  const userId = getLoggedInUser()._id;
  let url =
    getApiUrl() + "/users/" + userId + "/recipes/keyword/" + input + "/";
  return fetch(url, {
    method: "GET",
    headers: getHeaderForAjax()
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(data => {
      let arrRecipes = [];
      for (const item of data) {
        arrRecipes.push({
          value: item._id,
          label: item.recipe,
          href: item.href
        });
      }
      return arrRecipes;
    });
}

export function getCuisines() {
  const userId = getLoggedInUser()._id;
  return fetch(getApiUrl() + "/users/" + userId + "/recipes/cuisines", {
    method: "GET",
    headers: getHeaderForAjax()
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(data => {
      let arrCuisines = [];
      for (const item of data) {
        arrCuisines.push(item.cuisine);
      }
      return arrCuisines;
    });
}
