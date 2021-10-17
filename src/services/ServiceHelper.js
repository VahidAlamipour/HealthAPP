import { getAccessToken } from "./AuthenticationService";

export function createSettingDefaultAction(type) {
  return () => {
    return { type: type };
  };
}

export async function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    console.log(
      "ServiceHelper::checkStatus(), Response:" + JSON.stringify(response)
    );
    return response;
  }
  const errorObj = await response.json();
  return Promise.reject(errorObj);
}

export function parseJSON(response) {
  return response.json();
}

export function getApiUrl() {
  return process.env.REACT_APP_API_URL;
}

export function getNewsApiUrl() {
  return process.env.REACT_APP_NEWS_API_URL;
}

export function getNewsApiKey() {
  return process.env.REACT_APP_NEWS_API_KEY;
}

export function getProductApiUrl() {
  return process.env.REACT_APP_PRODUCT_API_URL;
}

export function getHeaderForAjax() {
  return new Headers({
    "Content-Type": "application/json",
    token: getAccessToken()
  });
}
