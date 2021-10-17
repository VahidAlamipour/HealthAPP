import _ from "lodash";
import {
  checkStatus,
  parseJSON,
  getApiUrl,
  getHeaderForAjax
} from "./ServiceHelper";
import { checkSettingData } from "./PublicService";
import { getLoggedInUser } from "./AuthenticationService";
import { I18n } from "react-i18next";
import moment from "moment";
import check from "material-ui/svg-icons/navigation/check";

export function getEditSymptomUsers() {
  return {
    data: [
      { label: "User1", value: 1 },
      { label: "User2", value: 2 },
      { label: "User3", value: 3 },
      { label: "User4", value: 4 }
    ]
  };
}

export function getSymptomDetail(_id, type) {
  const userId = getLoggedInUser()._id;
  let url = getApiUrl() + "/symptoms/" + _id;
  if (type != "symptom")
    url = getApiUrl() + "/users/" + userId + "/recipes/" + _id;

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
export function getSymptomResponseDetail(_id, type) {
  const userId = getLoggedInUser()._id;
  let url = getApiUrl() + "/users/" + userId + "/response/symptoms/" + _id;
  if (type != "symptom")
    url = getApiUrl() + "/users/" + userId + "/response/meals/" + _id;

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

export function searchSymptom(val, type) {
  val = val.toLowerCase();
  const userId = getLoggedInUser()._id;
  let url = getApiUrl() + "/symptoms/keywords/" + val + "/" + userId + "/";
  var category =
    type !== "symptom" && type !== "symptoms" ? "meals" : "symptoms";
  if (category !== "symptoms") {
    url = getApiUrl() + "/users/" + userId + "/recipes/keyword/" + val + "/";
  }
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
        if (category == "symptoms") {
          data.data.push({
            _id: item._id,
            name: item.displayname,
            fullName: item.name
          });
          data.show.push(item.name);
        } else {
          data.data.push({
            _id: item._id,
            name: item.recipe,
            fullName: item.recipe_full
          });
          data.show.push(item.recipe_full);
        }
      }

      return data;
    })
    .catch(function() {
      let data = {
        show: [],
        data: []
      };
      return data;
    });
}
export function createSymptom(data, type, callback) {
  const userId = getLoggedInUser()._id;
  let url = getApiUrl() + "/users/" + userId + "/response/symptoms/";
  if (type !== "symptom")
    url = getApiUrl() + "/users/" + userId + "/response/meals/";
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: getHeaderForAjax()
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(res => {
      if (callback) callback();
    });
}
export function saveFoodAndSymptoms(data) {
  const userId = getLoggedInUser()._id;
  var AllList = [];
  data.forEach(element => {
    element.inputs.forEach(item => {
      var hasFlag = false;
      AllList.forEach(element => {
        if (
          element.category == item.category &&
          element.time.valueOf() == item.time.valueOf() &&
          element.name == item.name &&
          element.scale == item.scale &&
          element.unit == item.unit
        ) {
          hasFlag = true;
          item.users.forEach(user => {
            var checkuser = element.users.filter(eachuser => eachuser == user);
            if (checkuser.length <= 0) {
              element.users.push(user);
            }
          });
        }
      });
      if (!hasFlag) {
        AllList.push(item);
      }
    });
  });
  var SymptomsList = [];
  var MealsList = [];
  AllList.forEach(form => {
    let newData = {};
    if (!form.time) form.time = moment();
    if (form.category === "01") {
      newData = {
        participants: form.users,
        _id: form.symptom,
        symptom_name: form.name,
        date: form.time.unix() * 1000,
        type: form.type,
        severity: form.scale,
        label: form.unit || "",
        comment: form.comment || ""
      };
      SymptomsList.push(newData);
    } else if (form.category === "02") {
      newData = {
        participants: form.users,
        date: form.time.unix() * 1000,
        comment: form.comment || "",
        meals: [
          {
            _id: form.symptom,
            recipe: form.name,
            size: form.scale,
            symbol: form.unit || ""
          }
        ]
      };
      MealsList.push(newData);
    }
  });
  var result = { SymptomsList, MealsList };
  var url = getApiUrl() + "/users/" + userId + "/response/mealsymptom/";
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(result),
    headers: getHeaderForAjax()
  })
    .then(checkStatus)
    .then(parseJSON)
    .catch(e => {
      return e;
    });
}

export function updateSymptom(data, type, callback) {
  const userId = getLoggedInUser()._id;
  let url = getApiUrl() + "/users/" + userId + "/response/all";
  // if (type !== "symptom")
  //   url = getApiUrl() + "/users/" + userId + "/response/meals";
  return fetch(url, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: getHeaderForAjax()
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(res => {
      if (callback) callback();
      return res;
    });
}

export function deleteSymptom(_id, type) {
  const userId = getLoggedInUser()._id;

  let url = getApiUrl() + "/users/" + userId + "/response/symptoms/" + _id;
  if (type !== "symptom")
    url = getApiUrl() + "/users/" + userId + "/response/meals/" + _id;

  return fetch(url, {
    method: "delete"
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(res => {})
    .catch(e => {
      return e;
    });
}

export function getSymptomList(cond) {
  const userId = getLoggedInUser()._id;
  let start = 0;
  var newEnd = moment(cond.start);
  let end = 0;
  //let end = (new Date()).getTime() * 1000;
  if (cond.start) start = cond.start.unix() * 1000;
  if (cond.to) end = newEnd.add(cond.to, "days").unix() * 1000;

  let url = `${getApiUrl()}/users/${userId}/response/${
    cond.category
  }/?start=${start}&end=${end}&participant=${cond.user}`;
  //   if (cond.category == "symptom")
  //     url =
  //       getApiUrl() +
  //       "/users/" +
  //       userId +
  //       "/response/symptoms/?start=" +
  //       start +
  //       "&end=" +
  //       end +
  //       "&participant=" +
  //       cond.user;
  //   else if (cond.category == "symptom") url = ;
  //   else
  //     url =
  //       getApiUrl() +
  //       "/users/" +
  //       userId +
  //       "/response/meals/?start=" +
  //       start +
  //       "&end=" +
  //       end +
  //       "&participant=" +
  //       cond.user;

  return fetch(url, {
    method: "GET",
    headers: getHeaderForAjax()
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(res => {
      var result = [];
      if (cond.category == "00") {
        if (res.meals) {
          result = res.meals.map((item, index) => {
            item.category = "02";
            return item;
          });
        }
        if (res.symptoms) {
          res.symptoms.forEach((item, index) => {
            item.category = "01";
            result.push(item);
          });
        }
        if (res.activities) {
          res.symptoms.forEach((item, index) => {
            item.category = "03";
            result.push(item);
          });
        }
      } else {
        result = res.map((item, index) => {
          item.category = cond.category;
          return item;
        });
      }

      return result;
    })
    .catch(e => {
      return [];
    });
}
export async function getCategories() {
  var setting = await checkSettingData();
  return setting.categories.map(item => {
    return { value: item.code, label: item.name };
  });
}
