import _ from "lodash";
import { checkStatus, parseJSON } from "./ServiceHelper";
import { getLoggedInUser } from "./AuthenticationService";
import { getAccessToken } from "./AuthenticationService";

function getApiUrl() {
  return "http://php12api.us-east-2.elasticbeanstalk.com/api/";
}
function getHeaderForAjax() {
  return new Headers({
    "Content-Type": "application/json",
    token: getAccessToken(),
    user: getLoggedInUser()._id
  });
}

export function shareForum(inputs, linksToNewPostItems) {
  let body = {
    body: inputs.body,
    symptom: inputs.symptom
  };
  if (linksToNewPostItems) {
    body.related = linksToNewPostItems;
  }
  let url = getApiUrl() + "forum/share";
  let method = "POST";
  return fetch(url, {
    method: method,
    headers: getHeaderForAjax(),
    body: JSON.stringify(body)
  })
    .then(checkStatus)
    .then(parseJSON);
}
export function doArchiveService(data) {
  let body = {
    post: data
  };
  let url = getApiUrl() + "forum/savepost";
  let method = "POST";
  return fetch(url, {
    method: method,
    headers: getHeaderForAjax(),
    body: JSON.stringify(body)
  })
    .then(checkStatus)
    .then(parseJSON);
}
export function editForum(inputs) {
  let body = {
    body: inputs.body
  };
  let url = getApiUrl() + "forum/edit/" + inputs._id;
  let method = "PUT";
  return fetch(url, {
    method: method,
    headers: getHeaderForAjax(),
    body: JSON.stringify(body)
  })
    .then(checkStatus)
    .then(parseJSON);
}
export function getList(symptomId, sortBy, keyWord, userId) {
  symptomId = symptomId == "null" ? "" : symptomId;
  sortBy = sortBy || "";
  keyWord = keyWord || "";

  userId = userId || "";

  let url = `${getApiUrl()}forum/index?symptom=${symptomId}&sortby=${sortBy}&keyword=${keyWord}&user_id=${userId}`;

  let method = "GET";
  return fetch(url, {
    method: method,
    headers: getHeaderForAjax()
  })
    .then(checkStatus)
    .then(parseJSON);
}
export function getArchiveList() {
  let url = `${getApiUrl()}forum/listsaved`;
  let method = "GET";
  return fetch(url, {
    method: method,
    headers: getHeaderForAjax()
  })
    .then(checkStatus)
    .then(parseJSON);
}
export function likedActService(postId, flag) {
  let body = {
    post_id: postId
  };
  if (flag) {
    body.up = 1;
  } else {
    body.down = 1;
  }
  let url = getApiUrl() + "forum/relevant";
  let method = "POST";
  return fetch(url, {
    method: method,
    headers: getHeaderForAjax(),
    body: JSON.stringify(body)
  })
    .then(checkStatus)
    .then(parseJSON);
}
export function removeSaveService(postId) {
  let url = getApiUrl() + "forum/removesaved/" + postId;
  let method = "DELETE";
  return fetch(url, {
    method: method,
    headers: getHeaderForAjax()
  })
    .then(checkStatus)
    .then(parseJSON);
}
export function deletePostService(postId) {
  let url = getApiUrl() + `forum/delete/${postId}`;
  let method = "DELETE";
  return fetch(url, {
    method: method,
    headers: getHeaderForAjax()
  })
    .then(checkStatus)
    .then(parseJSON);
}
export function singlePostGet(postId) {
  let url = `${getApiUrl()}forum/post/${postId}`;
  let method = "GET";
  return fetch(url, {
    method: method,
    headers: getHeaderForAjax()
  })
    .then(checkStatus)
    .then(parseJSON);
}
