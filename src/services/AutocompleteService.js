import _ from "lodash";
import {
  checkStatus,
  parseJSON,
  getApiUrl,
  getHeaderForAjax
} from "./ServiceHelper";
import { getLoggedInUser } from "./AuthenticationService";

export function search(val, type, level, noUser) {
  level = level || "111111";
  val = val.toLowerCase();
  let url = "";

  if (noUser) {
    url = `${getApiUrl()}/lookup/typeaheadsearch/${type}/4/${level}/${val}/20/1`;
  } else {
    const userId = getLoggedInUser()._id;
    url = `${getApiUrl()}/users/${userId}/typeaheadsearch/${type}/4/${level}/${val}/20/1`;
  }

  return fetch(url, {
    method: "GET",
    headers: getHeaderForAjax()
  })
    .then(checkStatus)
    .then(parseJSON)
    .catch(function() {
      let data = {
        show: [],
        data: []
      };
      return data;
    });
}
export function getDetail(_id, type, noUser) {
  let url = "";
  if (noUser) {
    url = `${getApiUrl()}/lookup/getitem/${_id}`;
  } else {
    const userId = getLoggedInUser()._id;
    url = getApiUrl() + "/users/" + userId + "/getitem/" + _id;
  }
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
