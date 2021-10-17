import {
  checkStatus,
  parseJSON,
  getApiUrl,
  getHeaderForAjax
} from "./ServiceHelper";
import { appendFile } from "fs";
function getUserByEmail(authData, isRememberMe) {
  console.log(
    "LoginService::getUserByEmail(), authData:" + JSON.stringify(authData)
  );
  return fetch(getApiUrl() + "/users/email/" + authData.subs, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      token: authData.access_token
    }
  })
    .then(checkStatus)
    .then(
      //response => response.json()
      function(response) {
        return response.json();
      }
    )
    .then(
      /*userData =>
      ({
          authData,
          userData,
          isRememberMe
       })*/
      function(userData) {
        return { authData, userData, isRememberMe };
      }
    );
}
export function authenticate(user, isRememberMe) {
  return (
    fetch(getApiUrl() + "/security/authenticate", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        //'Cache-Control': 'no-cache',
        email: user.email,
        password: user.password
      }
    })
      //.then(checkStatus)
      .then(function(response) {
        console.log(
          "LoginService::authenticate(), response:" + JSON.stringify(response)
        );
        return checkStatus(response);
      })
      //.then(response => response.json())
      .then(function(resp) {
        console.log(
          "LoginService::authenticate(), resp:" + JSON.stringify(resp)
        );
        return resp.json();
      })
      //.then(authData => getUserByEmail(authData, isRememberMe) );
      .then(function(authData) {
        if (authData.message !== undefined) {
          console.log(
            "LoginService::authenticate(), ERROR:" + JSON.stringify(authData)
          );
          return Error(authData.message);
        } else {
          console.log(
            "LoginService::authenticate(), SUCCESS:" + JSON.stringify(authData)
          );
          return getUserByEmail(authData, isRememberMe);
        }
      })
  );
}

export function forgotPassword(email) {
  return fetch(getApiUrl() + "/users/forgotpassword", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(email)
  })
    .then(checkStatus)
    .then(parseJSON);
}

export function forgotPasswordReset(resetForm) {
  return fetch(getApiUrl() + "/users/forgotpassword", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(resetForm)
  })
    .then(checkStatus)
    .then(parseJSON);
}

export function resetPassword(passwords) {
  return fetch(getApiUrl() + "/resetpassword", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(passwords)
  })
    .then(checkStatus)
    .then(parseJSON);
}

export function changePassword(passwords) {
  return fetch(getApiUrl() + "/users/resetpassword", {
    method: "POST",
    headers: getHeaderForAjax(),
    body: JSON.stringify(passwords)
  })
    .then(checkStatus)
    .then(parseJSON);
}
export function activeUser(e) {
  let url =
    getApiUrl() +
    "/users/activation/?code=" +
    e.code +
    "&subscriber=" +
    e.subscriber;
  return fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json", "Cache-Control": "no-cache" }
  })
    .then(checkStatus)
    .then(parseJSON);
}
