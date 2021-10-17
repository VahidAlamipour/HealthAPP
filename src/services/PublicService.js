import {
  checkStatus,
  parseJSON,
  getApiUrl,
  getHeaderForAjax
} from "./ServiceHelper";
import moment from "moment";

export function checkSettingData() {
  let requestFlag = true;
  let setting = localStorage.getItem("setting12u12");
  let lastUpdateStr = "";
  if (setting) {
    setting = JSON.parse(setting);
    lastUpdateStr = setting.lastupdate;
    let lastCheckMoment = setting.lastCheckMoment;
    let checkMoment = moment().add(-3, "days");
    if (lastCheckMoment < checkMoment) {
      requestFlag = true;
    } else {
      requestFlag = false;
    }
  }
  if (requestFlag) {
    let url = `${getApiUrl()}/lookup/appsettings/${lastUpdateStr}`;
    return fetch(url, {
      method: "GET",
      headers: getHeaderForAjax()
    }).then(async res => {
      var status = res.status;
      var result = {};
      if (status == 200) {
        result = await res.json();
        result.lastCheckMoment = moment().valueOf();
        localStorage.setItem("setting12u12", JSON.stringify(result));
        return result;
      } else if (status == 201) {
        setting.lastCheckMoment = moment().valueOf();
        localStorage.setItem("setting12u12", JSON.stringify(setting));
        return result;
      }
    });
  } else {
    return setting;
  }
}
export function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
