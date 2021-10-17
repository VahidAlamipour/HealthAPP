import { ACCESS_TOKEN_KEY } from "./constant";
import Cookies from "js-cookie";

// Get and store access_token in local storage
export function getAccessToken() {
  const cookieToken = Cookies.get(ACCESS_TOKEN_KEY);
  if (cookieToken) {
    return Cookies.get(ACCESS_TOKEN_KEY);
  }
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(accessToken, isRememberMe) {
  if (isRememberMe) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  } else {
    Cookies.set(ACCESS_TOKEN_KEY, accessToken);
  }
}

export function isLoggedIn() {
  const accessToken = getAccessToken();
  return !!accessToken;
}

export function getLoggedInUser() {
  const loggedUser = JSON.parse(localStorage.getItem("user"));
  return loggedUser;
}
export function getSelectedSubUser() {
  var selectedUser = localStorage.getItem("Dashboard_User_Selected");
  return JSON.parse(selectedUser);
}

export function logout() {
  Cookies.remove(ACCESS_TOKEN_KEY);
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem("lastUpdateSyptoms");
  localStorage.removeItem("user");
  localStorage.clear();
}
