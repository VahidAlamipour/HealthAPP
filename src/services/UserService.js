import {
  checkStatus,
  parseJSON,
  getApiUrl,
  getHeaderForAjax
} from "./ServiceHelper";
import { getLocations, getEthnicities } from "./LookupService";

export function signUp(user) {
  return fetch(getApiUrl() + "/users", {
    method: "POST",
    headers: getHeaderForAjax(),
    body: JSON.stringify(user)
  })
    .then(checkStatus)
    .then(parseJSON);
}

export function getUser(id) {
  console.log("UserService::getUser(), id=" + id);
  return fetch(getApiUrl() + "/users/" + id, {
    method: "GET",
    headers: getHeaderForAjax()
  })
    .then(checkStatus)
    .then(parseJSON);
}

export function getSubUser(userId, subUserId) {
  return fetch(getApiUrl() + "/users/" + userId + "/subusers/" + subUserId, {
    method: "GET",
    headers: getHeaderForAjax()
  })
    .then(checkStatus)
    .then(parseJSON);
}

/**
 * this function is called from the function getUserWithMainUserAndSubUsers
 * @param {string} id Main User's ID
 */
export function getSubUsers(id) {
  return fetch(getApiUrl() + "/users/" + id + "/subusers", {
    method: "GET",
    headers: getHeaderForAjax()
  })
    .then(checkStatus)
    .then(parseJSON)
    .catch(function(err) {
      // put a catch here
      // because we still need to return the process
      // even if it was a Promise.all
      // because the API
      // returns a status of 404 if the Main User
      // doesn't have a Sub User
      // ( the default structure for a new user is really without a sub user )
      console.log("UserService::getSubUsers(), Error:" + err);
    });
}

/**
 * This function will return values to profileReducer::reducer()switch case getSucceeded(PROFILE_GET_USER_AND_SUBUSERS):
 * @param {String} id the current active user's ID
 * @param {String} mainId the main user's ID
 */
export function getUserWithMainUserAndSubUsers(id, mainId) {
  return Promise.all([getUser(mainId), id, getSubUsers(mainId)]);
}

export function updateProfile(user) {
  return fetch(getApiUrl() + "/users/" + user._id, {
    method: "PUT",
    headers: getHeaderForAjax(),
    body: JSON.stringify(user)
  })
    .then(checkStatus)
    .then(parseJSON);
}

export function createSubUser(userId, subUser) {
  return fetch(getApiUrl() + "/users/" + userId + "/subusers", {
    method: "POST",
    headers: getHeaderForAjax(),
    body: JSON.stringify(subUser)
  })
    .then(checkStatus)
    .then(parseJSON);
}

export function updateSubUser(userId, subUser) {
  return fetch(getApiUrl() + "/users/" + userId + "/subusers/" + subUser._id, {
    method: "PUT",
    headers: getHeaderForAjax(),
    body: JSON.stringify(subUser)
  })
    .then(checkStatus)
    .then(parseJSON);
}
export function updateUserAndSubuser(MainUser, subUser) {
  if (MainUser._id === subUser._id) {
    var data = Promise.all([updateProfile(subUser)]);
  } else {
    var data = Promise.all([updateSubUser(MainUser._id, subUser)]);
  }
  return data;
}

export function formUpdateInitialization(mainId, userId) {
  return Promise.all([
    mainId === userId ? getUser(userId) : getSubUser(mainId, userId),
    getLocations(),
    getEthnicities(),
    userId
  ]);
}
export function deleteSubUser(userId, subUserId) {
  return fetch(getApiUrl() + "/users/" + userId + "/subusers/" + subUserId, {
    method: "DELETE",
    headers: getHeaderForAjax()
  })
    .then(checkStatus)
    .then(() => ({ deletedId: subUserId }));
}
