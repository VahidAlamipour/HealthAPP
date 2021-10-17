import _ from "lodash";
import {
  checkStatus,
  parseJSON,
  getApiUrl,
  getNewsApiUrl,
  getNewsApiKey,
  getHeaderForAjax
} from "./ServiceHelper";
import { checkSettingData } from "./PublicService";
import { getLoggedInUser, getSelectedSubUser } from "./AuthenticationService";
import { I18n } from "react-i18next";
import moment from "moment";

export function getStocks(subUser) {
  var result = JSON.parse(localStorage.getItem("lastUpdateSyptoms"));
  let user = {};
  if (subUser) {
    user = subUser;
  } else {
    user = JSON.parse(localStorage.getItem("user"));
  }

  result = result.Data.filter(item => {
    return item.participant == user._id;
  });

  if (result && result.length > 0) {
    result = result[0].Symptoms.map(item => {
      item.order = parseInt(item.order);
      return item;
    });
    result = _.orderBy(result, ["visibility", "order"], ["desc", "asc"]);
  } else
    return {
      data: [],
      currentUser: user
    };

  return {
    data: result,
    currentUser: user
  };

  // try {
  //   // let data = user.usersymptoms.filter((e)=>{
  //   //    console.log("StockService::getStocks(), e.visibility:" + e.visibility);
  //   //     return e.visibility
  //   // });
  //   let data = user.usersymptoms;
  //   for (let i = 0; i < data.length; i++) {
  //     if (localStorage.getItem("stock_" + data[i]._id))
  //       data[i].index = localStorage.getItem("stock_" + data[i]._id);
  //     else data[i].index = -1;
  //   }
  //   data = _.sortBy(data, ["index"]);
  //   return {
  //     data: data,
  //     currentUser: user
  //   };
  // } catch (err) {
  //   return {
  //     data: [],
  //     currentUser: user
  //   };
  //   console.log("StockService::getStocks(), ERROR:" + err);
  //}
}

export function addNewOrdering(data, user) {
  var sendingData = {
    user: user._id,
    data: []
  };
  var visibility = true;
  sendingData.data = data.map((item, index) => {
    if (item.type && item.type == "seprator") {
      visibility = false;
    }
    let order = index;
    if (!visibility) {
      --order;
    }
    if (!item.type || item.type != "seprator")
      return {
        _id: item._id,
        symptom: item.symptom,
        visibility: visibility,
        order: order
      };
  });
  sendingData.data = sendingData.data.filter(item => item != undefined);

  const userId = getLoggedInUser()._id;
  let url = getApiUrl() + "/users/" + userId + "/response/viewsummaryorder/";
  return fetch(url, {
    method: "PUT",
    body: JSON.stringify(sendingData),
    headers: getHeaderForAjax()
  })
    .then(checkStatus)
    .then(parseJSON);
}

export function deleteStock(_id) {
  const userId = getLoggedInUser()._id;

  return fetch(getApiUrl() + "/users/" + userId + "/symptoms_uncheck/" + _id, {
    method: "get",
    headers: getHeaderForAjax()
  })
    .then(checkStatus)
    .then(res => {
      return { _id: _id };
    })
    .catch(error => console.log(error));

  //return {_id: _id};
}

export function addStock(_id) {
  const userId = getLoggedInUser()._id;

  return fetch(getApiUrl() + "/users/" + userId + "/symptoms_check/" + _id, {
    method: "get"
  })
    .then(checkStatus)
    .then(res => {
      return { _id: _id };
    })
    .catch(error => console.log(error));
}

// export function getdetailStocks(subUser) {
//    try {
//       var baseUser;
//       let user = {};
//       if (subUser) {
//          user = subUser;
//       } else {
//          baseUser = localStorage.getItem('user');
//          user = JSON.parse(baseUser);
//       }
//       let data = user.usersymptoms.filter((e) => {
//          return e.visibility
//       });
//       for (let i = 0; i < data.length; i++) {
//          if (localStorage.getItem("stock_" + data[i]._id))
//             data[i].index = localStorage.getItem("stock_" + data[i]._id);
//          else
//             data[i].index = -1;
//       }
//       data = _.sortBy(data, ['index']);
//       return {
//          data: data
//       };
//    }
//    catch (err) {
//       console.log("StockService::getDetailsStocks(), ERROR:" + err);
//    }
//    // return {
//    //     data: [{_id: 1, name: 'geadache', severity: 4, state: 1, created: '2018-4-5 23:34:34'},
//    //         {_id: 2, name: 'Fart', severity: 3, state: 1, created: '2018-4-5 23:34:34'},
//    //         {_id: 3, name: 'Stool', severity: 2, state: 0, created: '2018-4-25 23:34:34'},
//    //         {_id: 4, name: 'Left Elbow Pitch', severity: 4, state: 0, created: '2018-4-5 23:34:34'},
//    //         {_id: 5, name: 'Headache', severity: 1, state: -1, created: '2015-4-5 23:34:34'},
//    //         {_id: 6, name: 'Fart Sample', severity: 5, state: 1, created: '2018-5-5 23:34:34'},
//    //         {_id: 7, name: 'Stool Sample', severity: 6, state: -1, created: '2018-4-6 23:34:34'},
//    //         {_id: 8, name: 'Left Elbow Sample', severity: 7, state: 1, created: '2018-8-5 23:34:34'}]
//    // }
// }
export function getdetailStocks() {
  var baseUser = localStorage.getItem("user");
  let user = JSON.parse(baseUser);
  var lastUpdateSyptom = localStorage.getItem("lastUpdateSyptoms");
  var lastTime = "";
  if (lastUpdateSyptom) {
    lastUpdateSyptom = JSON.parse(lastUpdateSyptom);
    lastTime = lastUpdateSyptom.lastdate;
  } else {
    lastTime = "";
  }
  lastTime = lastTime || "";
  let url = `${getApiUrl()}/users/${
    user._id
  }/response/viewsummary/?lastupdate=${lastTime}`;
  return fetch(url, {
    method: "GET",
    headers: getHeaderForAjax()
  })
    .then(async res => {
      var status = res.status;
      var result = {};
      if (status == 200) {
        result = await res.json();
        localStorage.setItem("lastUpdateSyptoms", JSON.stringify(result));
      } else if (status == 201) {
        result = JSON.parse(localStorage.getItem("lastUpdateSyptoms"));
      }
      if (result.Data && result.Data.length > 0) {
        return result;
      } else {
        return new Error("Problem in data");
      }
    })
    .catch(ex => {
      return {
        data: []
      };
    });
}

export function getFoodGragh(factorId, _id, time, startTime, subUser) {
  if (!_id) {
    return [];
  }
  console.log("injaServ: ", factorId, _id, time, startTime, subUser);
  //#region time handeling
  var start = startTime || moment();
  let end = Date.now();
  if (startTime) {
    if (time == "1W") {
      end =
        moment(startTime)
          .add(1, "week")
          .unix() * 1000;
    } else if (time == "2W") {
      end =
        moment(startTime)
          .add(2, "weeks")
          .unix() * 1000;
    } else if (time == "1M") {
      end =
        moment(startTime)
          .add(1, "months")
          .unix() * 1000;
    } else if (time == "3M") {
      end =
        moment(startTime)
          .add(3, "months")
          .unix() * 1000;
    } else if (time == "6M") {
      end =
        moment(startTime)
          .add(6, "months")
          .unix() * 1000;
    } else if (time == "1Y") {
      end =
        moment(startTime)
          .add(1, "year")
          .unix() * 1000;
    } else if (time == "2Y") {
      end =
        moment(startTime)
          .add(2, "years")
          .unix() * 1000;
    } else if (time == "5Y") {
      end =
        moment(startTime)
          .add(5, "year")
          .unix() * 1000;
    }
  } else {
    if (time == "1D") {
      //start = moment();
      start.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
      start = start.unix() * 1000;
    } else if (time == "1W") {
      start = start.clone().weekday(1);
      start = start.unix() * 1000;
    } else if (time == "1M") {
      //start = moment();
      start.set({ date: 1, hour: 0, minute: 0, second: 0, millisecond: 0 });
      start = start.unix() * 1000;
    } else if (time == "3M") start = end - 3 * 30 * 86400 * 1000;
    else if (time == "6M") start = end - 6 * 30 * 86400 * 1000;
    else if (time == "1Y") start = end - 12 * 30 * 86400 * 1000;
    else start = end - 2 * 12 * 30 * 86400 * 1000;
  }

  //#endregion

  const userId = getLoggedInUser()._id;
  subUser = subUser || userId;
  let url =
    getApiUrl() +
    "/users/" +
    userId +
    "/graph/" +
    factorId +
    "/?start=" +
    start +
    "&end=" +
    Date.now() +
    "&participant=" +
    subUser +
    "&item=" +
    _id;

  return fetch(url, {
    method: "GET",
    headers: getHeaderForAjax()
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(res => {
      let data = res.items.map((item, key) => {
        return {
          x: moment(item.date),
          y: item.value,
          items: item.items
        };
      });
      return data;
    })
    .catch(err => {
      console.log(
        "StockService::getStockGraph(), ERROR:" + JSON.stringify(err)
      );
      return [];
    });
}

export function getStockGraph(_id, time, startTime, subUser) {
  if (!_id) {
    return [];
  }
  //#region time handeling
  var start = startTime || moment();
  let end = Date.now();
  if (startTime) {
    if (time == "1W") {
      end =
        moment(startTime)
          .add(1, "week")
          .unix() * 1000;
    } else if (time == "2W") {
      end =
        moment(startTime)
          .add(2, "weeks")
          .unix() * 1000;
    } else if (time == "1M") {
      end =
        moment(startTime)
          .add(1, "months")
          .unix() * 1000;
    } else if (time == "3M") {
      end =
        moment(startTime)
          .add(3, "months")
          .unix() * 1000;
    } else if (time == "6M") {
      end =
        moment(startTime)
          .add(6, "months")
          .unix() * 1000;
    } else if (time == "1Y") {
      end =
        moment(startTime)
          .add(1, "year")
          .unix() * 1000;
    } else if (time == "2Y") {
      end =
        moment(startTime)
          .add(2, "years")
          .unix() * 1000;
    } else if (time == "5Y") {
      end =
        moment(startTime)
          .add(5, "year")
          .unix() * 1000;
    }
  } else {
    if (time == "1D") {
      //start = moment();
      start.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
      start = start.unix() * 1000;
    } else if (time == "1W") {
      // start = start.clone().weekday(1);
      // start = start.unix() * 1000;
      start = end - 7 * 86400 * 1000;
    } else if (time == "1M") {
      //start = moment();
      // start.set({ date: 1, hour: 0, minute: 0, second: 0, millisecond: 0 });
      // start = start.unix() * 1000;
      start = end - 30 * 86400 * 1000;
    } else if (time == "3M") start = end - 3 * 30 * 86400 * 1000;
    else if (time == "6M") start = end - 6 * 30 * 86400 * 1000;
    else if (time == "1Y") start = end - 12 * 30 * 86400 * 1000;
    else start = end - 2 * 12 * 30 * 86400 * 1000;
  }

  //#endregion
  const userId = getLoggedInUser()._id;
  if (!subUser) {
    subUser = getSelectedSubUser();
    subUser = subUser ? subUser._id : userId;
  }

  let url =
    getApiUrl() +
    "/users/" +
    userId +
    "/response/symptoms/?start=" +
    start +
    "&end=" +
    end +
    "&participant=" +
    subUser +
    "&symptom=" +
    _id;

  return fetch(url, {
    method: "GET",
    headers: getHeaderForAjax()
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(res => {
      let data = res.map((item, key) => {
        return {
          x: moment(item.date),
          y: item.severity
        };
      });
      return data;
    })
    .catch(err => {
      console.log(
        "StockService::getStockGraph(), ERROR:" + JSON.stringify(err)
      );
      return [];
    });
}

export function getStock(_id) {
  const userId = getLoggedInUser()._id;
  let url =
    getApiUrl() +
    "/users/" +
    userId +
    "/response/symptoms/?start=0&end=" +
    Date.now() +
    "&participant=" +
    userId +
    "&symptom=" +
    _id;

  return fetch(url, {
    method: "GET",
    headers: getHeaderForAjax()
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(res => {
      res = _.sortBy(res, ["date"]).reverse();
      if (res.length > 2) res = res.slice(0, 2);
      let ids = [];
      let rlt = res[0];
      if (res.length > 1) {
        if (parseInt(res[0].severity) > parseInt(res[1].severity)) {
          rlt.state = 1;
        } else if (parseInt(res[0].severity) < parseInt(res[1].severity)) {
          rlt.state = -1;
        } else {
          rlt.state = 0;
        }
      } else {
        rlt.state = 0;
      }

      // for (let i = res.length - 1; i >= 0; i--) {
      //     if (ids.indexOf(res[i].symptom) == -1) {
      //         res[i].status = 0;
      //         ids.push(res[i].symptom);
      //         rlt.push(res[i]);
      //     }
      //     else {
      //         for (let j = 0; j < rlt.length; j++) {
      //             if (rlt[j].symptom == res[i].symptom) {
      //                 let state = 0;
      //                 if (rlt[j].date < res[i].date) {
      //                     if (rlt[j].severity < res[i].severity)
      //                         state = 1;
      //                     else if (rlt[j].severity > res[i].severity)
      //                         state = -1;
      //                     rlt[j] = res[i];
      //                     rlt[j].state = state;
      //                 }
      //                 break;
      //             }
      //         }
      //     }
      // }
      //return rlt[0];
      return rlt;
    });
  // return {
  //     _id: _id,
  //     name: 'headache',
  //     serverity: 4,
  //     state: 1,
  //     news: ['asdfasdf', 'This is test!'],
  //     notes: ['asdfasdf', 'This is test!']
  // }
}

export function getSymptomChart(data, type) {
  const userId = getLoggedInUser()._id;
  const start = new Date(data.start).getTime();
  const end = new Date(data.end).getTime();
  let url = "";
  if (type == "symptom")
    url =
      getApiUrl() +
      "/users/" +
      userId +
      "/response/symptoms/?start=" +
      start +
      "&end=" +
      end +
      "&participant=" +
      data.user +
      "&symptom=" +
      data.symptom;
  else
    url =
      getApiUrl() +
      "/users/" +
      userId +
      "/response/meals/?start=" +
      start +
      "&end=" +
      end +
      "&participant=" +
      data.user +
      "&factor=" +
      data.factor;

  return fetch(url, {
    method: "GET",
    headers: getHeaderForAjax()
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(res => {
      let total = 0;
      let data = res.map((item, key) => {
        if (type == "symptom")
          return {
            x: moment(item.date).format("YYYY-MM-DD HH:mm"),
            y: item.severity
          };
        else {
          for (let i = 0; i < item.nutrients.length; i++)
            total += item.nutrients[i].size;
          return {
            x: moment(item.date).format("YYYY-MM-DD HH:mm"),
            y: parseInt(total)
          };
        }
      });
      return data;
    })
    .catch(() => {
      return [];
    });
}

export function getNews(name, trans) {
  console.log("StockService::getNews(), name:" + name + "|trans:" + trans);
  let url =
    getNewsApiUrl() + "?q=" + trans + " " + name + "&apiKey=" + getNewsApiKey();
  return fetch(url, {
    method: "GET",
    dataType: "json"
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(res => {
      console.log("StockService::getNews(), SUCCESS FETCHING NEWS");
      return res.articles.splice(0, 10);
    });
}

// export function getAllFactors(id) {
//   const userId = getLoggedInUser()._id;
//   id = id || userId;
//   let url = `${getApiUrl()}/users/${userId}/response/analyzepagecategory/${id}`;
//   return fetch(url, {
//     method: "GET",
//     headers: getHeaderForAjax()
//   })
//     .then(checkStatus)
//     .then(parseJSON);
// }
export async function getAllFactors(id) {
  var setting = await checkSettingData();
  return setting.analyzecategories.map(item => {
    return { value: item.code, label: item.name };
  });
}
export function getNutrients(id, text, subUser) {
  const userId = getLoggedInUser()._id;
  let subId = subUser || userId;
  //let category = "res_meals";
  //let url = `${getApiUrl()}/users/${userId}/response/analyzepagefactor/${category}/${id}/${subId}`;
  let url = `${getApiUrl()}/users/${userId}/response/factorlist/${id}/${subId}`;
  return fetch(url, {
    method: "GET",
    headers: getHeaderForAjax()
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(data => {
      if (data && data.length < 1) {
        data.push({
          _id: id,
          name: `${text} [THERE IS NOT IN OUR DATABASE]`
        });
      }
      var result = { id: id, data: data };
      return result;
    });
}

//have to remove
export function getFactors() {
  const userId = getLoggedInUser()._id;
  let url = getApiUrl() + "/meals/factors";
  return fetch(url, {
    method: "GET",
    dataType: "json"
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(res => {
      let rlt = res.map(e => {
        return { value: e._id, label: e.name };
      });
      return {
        data: rlt
      };
    })
    .catch(() => {
      return {
        data: []
      };
    });
  // return {
  //     data: [{value: 1, label: 'geadache'},
  //         {value: 2, label: 'Fart'},
  //         {value: 3, label: 'Stool'},
  //         {value: 4, label: 'Left Elbow Pitch'},
  //         {value: 5, label: 'Headache'},
  //         {value: 6, label: 'Fart'},
  //         {value: 7, label: 'Stool'},
  //         {value: 8, label: 'Left Elbow Pitch'}]
  // }
}

export function getUsers() {
  const userId = getLoggedInUser()._id;
  return fetch(getApiUrl() + "/users/" + userId + "/subusers/", {
    method: "GET",
    headers: getHeaderForAjax()
  })
    .then(parseJSON)
    .then(r => {
      let data = [];
      data = r.map(function(e) {
        return {
          label: e.last_name + " " + e.first_name,
          value: e._id
        };
      });
      return data;
    })
    .catch(function(err) {
      console.log("UserService::getSubUsers(), Error:" + err);
    });
}

export function getSymptoms() {
  let user = JSON.parse(localStorage.getItem("user"));
  let data = user.usersymptoms.filter(e => {
    return e.visibility;
  });
  let rlt = data.map(e => {
    return { value: e._id, label: e.name };
  });
  return {
    data: rlt
  };
}

export function getGraphFormData() {
  const data = [
    {
      foods: [
        {
          date: 1558056638000,
          severity: "4",
          symptom: "5c9c2c0806b014a1e9ab20ea",
          symptom_name: "Bleed, Bck of Rght Hand",
          visibility: true,
          arrow: "none",
          _id: "5cdd366178bdd12b4b066c92",
          order: "1",
          ingredients: [
            { name: "vitamin a", id: "sdfasfasfasdfaafs" },
            { name: "vitamin b", id: "sdfasfasfasdfaafs" },
            { name: "vitamin c", id: "sdfasfasfasdfaafs" }
          ]
        },
        {
          date: 1533809505000,
          severity: "4",
          symptom: "5c9c2c0806b014a1e9ab2517",
          symptom_name: "Bulging Eye",
          visibility: true,
          arrow: "none",
          _id: "5cdd366178bdd12b4b066c92",
          order: "2",
          ingredients: [
            { name: "vitamin d", id: "sdfasfasfasdfaafs" },
            { name: "vitamin e", id: "sdfasfasfasdfaafs" },
            { name: "vitamin f", id: "sdfasfasfasdfaafs" }
          ]
        },
        {
          date: 1558055519000,
          severity: "6",
          symptom: "5c9c2c0806b014a1e9ab2519",
          symptom_name: "Bulging Eye Rght Eye",
          visibility: false,
          arrow: "up",
          _id: "5cdd366178bdd12b4b066c92",
          order: "8",
          ingredients: [
            { name: "vitamin g", id: "sdfasfasfasdfaafs" },
            { name: "vitamin h", id: "sdfasfasfasdfaafs" },
            { name: "vitamin i", id: "sdfasfasfasdfaafs" }
          ]
        },
        {
          date: 1543915023000,
          severity: "7",
          symptom: "5c9c2c0a06b014a1e9ab2aef",
          symptom_name: "Cyst, Bck of Lft Hand",
          visibility: true,
          arrow: "none",
          _id: "5cdd366178bdd12b4b066c92",
          order: "3",
          ingredients: [
            { name: "vitamin m", id: "sdfasfasfasdfaafs" },
            { name: "vitamin n", id: "sdfasfasfasdfaafs" },
            { name: "vitamin o", id: "sdfasfasfasdfaafs" }
          ]
        },
        {
          date: 1558055679000,
          severity: "7",
          symptom: "5c9c2c0b06b014a1e9ab2cb2",
          symptom_name: "Discharge frm Rght Eye",
          visibility: false,
          arrow: "none",
          _id: "5cdd366178bdd12b4b066c92",
          order: "9",
          ingredients: [
            { name: "vitamin r", id: "sdfasfasfasdfaafs" },
            { name: "vitamin s", id: "sdfasfasfasdfaafs" },
            { name: "vitamin t", id: "sdfasfasfasdfaafs" }
          ]
        },
        {
          date: 1558429870000,
          severity: "38",
          symptom: "5c9c2c0c06b014a1e9ab30c6",
          symptom_name: "Fever",
          visibility: true,
          arrow: "none",
          _id: "5cdd366178bdd12b4b066c92",
          order: "4"
        },
        {
          date: 1558429963000,
          severity: "2",
          symptom: "5c9c2c0c06b014a1e9ab3136",
          symptom_name: "Headache",
          visibility: true,
          arrow: "down",
          _id: "5cdd366178bdd12b4b066c92",
          order: "0"
        },
        {
          date: 1558001528000,
          severity: "4",
          symptom: "5c9c2c0d06b014a1e9ab3514",
          symptom_name: "Itch, Bck of Lft Hand",
          visibility: true,
          arrow: "none",
          _id: "5cdd366178bdd12b4b066c92",
          order: "5"
        },
        {
          date: 1558509955000,
          severity: "3",
          symptom: "5c9c2c1306b014a1e9ab4581",
          symptom_name: "Rashes, Bck of Lft Hand",
          visibility: false,
          arrow: "none",
          _id: "5cdd366178bdd12b4b066c92",
          order: "7"
        },
        {
          date: 1559616740000,
          severity: "4",
          symptom: "5cf5dcf478bdd16adc5ade05",
          symptom_name: "dddddddd",
          visibility: true,
          arrow: "none",
          _id: "5cdd366178bdd12b4b066c92",
          order: "6"
        }
      ],
      Symptoms: [
        {
          date: 1558056638000,
          severity: "4",
          symptom: "5c9c2c0806b014a1e9ab20ea",
          symptom_name: "Bleed, Bck of Rght Hand",
          visibility: true,
          arrow: "none",
          _id: "5cdd366178bdd12b4b066c92",
          order: "1"
        },
        {
          date: 1533809505000,
          severity: "4",
          symptom: "5c9c2c0806b014a1e9ab2517",
          symptom_name: "Bulging Eye",
          visibility: true,
          arrow: "none",
          _id: "5cdd366178bdd12b4b066c92",
          order: "2"
        },
        {
          date: 1558055519000,
          severity: "6",
          symptom: "5c9c2c0806b014a1e9ab2519",
          symptom_name: "Bulging Eye Rght Eye",
          visibility: false,
          arrow: "up",
          _id: "5cdd366178bdd12b4b066c92",
          order: "8"
        },
        {
          date: 1543915023000,
          severity: "7",
          symptom: "5c9c2c0a06b014a1e9ab2aef",
          symptom_name: "Cyst, Bck of Lft Hand",
          visibility: true,
          arrow: "none",
          _id: "5cdd366178bdd12b4b066c92",
          order: "3"
        },
        {
          date: 1558055679000,
          severity: "7",
          symptom: "5c9c2c0b06b014a1e9ab2cb2",
          symptom_name: "Discharge frm Rght Eye",
          visibility: false,
          arrow: "none",
          _id: "5cdd366178bdd12b4b066c92",
          order: "9"
        },
        {
          date: 1558429870000,
          severity: "38",
          symptom: "5c9c2c0c06b014a1e9ab30c6",
          symptom_name: "Fever",
          visibility: true,
          arrow: "none",
          _id: "5cdd366178bdd12b4b066c92",
          order: "4"
        },
        {
          date: 1558429963000,
          severity: "2",
          symptom: "5c9c2c0c06b014a1e9ab3136",
          symptom_name: "Headache",
          visibility: true,
          arrow: "down",
          _id: "5cdd366178bdd12b4b066c92",
          order: "0"
        },
        {
          date: 1558001528000,
          severity: "4",
          symptom: "5c9c2c0d06b014a1e9ab3514",
          symptom_name: "Itch, Bck of Lft Hand",
          visibility: true,
          arrow: "none",
          _id: "5cdd366178bdd12b4b066c92",
          order: "5"
        },
        {
          date: 1558509955000,
          severity: "3",
          symptom: "5c9c2c1306b014a1e9ab4581",
          symptom_name: "Rashes, Bck of Lft Hand",
          visibility: false,
          arrow: "none",
          _id: "5cdd366178bdd12b4b066c92",
          order: "7"
        },
        {
          date: 1559616740000,
          severity: "4",
          symptom: "5cf5dcf478bdd16adc5ade05",
          symptom_name: "dddddddd",
          visibility: true,
          arrow: "none",
          _id: "5cdd366178bdd12b4b066c92",
          order: "6"
        }
      ],
      participant: "5cdd366178bdd12b4b066c92"
    },
    {
      Symptoms: [
        {
          date: 1533809505000,
          severity: "4",
          symptom: "5c9c2c0806b014a1e9ab2517",
          symptom_name: "Bulging Eye",
          visibility: false,
          arrow: "none",
          _id: "5cdd366178bdd12b4b066c92",
          order: "6"
        },
        {
          date: 1558001489000,
          severity: "5",
          symptom: "5c9c2c0806b014a1e9ab2519",
          symptom_name: "Bulging Eye Rght Eye",
          visibility: false,
          arrow: "none",
          _id: "5cdd366178bdd12b4b066c92",
          order: "4"
        },
        {
          date: 1543915023000,
          severity: "7",
          symptom: "5c9c2c0a06b014a1e9ab2aef",
          symptom_name: "Cyst, Bck of Lft Hand",
          visibility: false,
          arrow: "none",
          _id: "5cdd366178bdd12b4b066c92",
          order: "5"
        },
        {
          date: 1558429870000,
          severity: "38",
          symptom: "5c9c2c0c06b014a1e9ab30c6",
          symptom_name: "Fever",
          visibility: true,
          arrow: "none",
          _id: "5cdd366178bdd12b4b066c92",
          order: "1"
        },
        {
          date: 1558429963000,
          severity: "2",
          symptom: "5c9c2c0c06b014a1e9ab3136",
          symptom_name: "Headache",
          visibility: true,
          arrow: "down",
          _id: "5cdd366178bdd12b4b066c92",
          order: "0"
        },
        {
          date: 1558001528000,
          severity: "4",
          symptom: "5c9c2c0d06b014a1e9ab3514",
          symptom_name: "Itch, Bck of Lft Hand",
          visibility: true,
          arrow: "none",
          _id: "5cdd366178bdd12b4b066c92",
          order: "3"
        },
        {
          date: 1558509955000,
          severity: "3",
          symptom: "5c9c2c1306b014a1e9ab4581",
          symptom_name: "Rashes, Bck of Lft Hand",
          visibility: true,
          arrow: "none",
          _id: "5cdd366178bdd12b4b066c92",
          order: "2"
        },
        {
          date: 1559616740000,
          severity: "4",
          symptom: "5cf5dcf478bdd16adc5ade05",
          symptom_name: "dddddddd",
          visibility: true,
          arrow: "none",
          _id: "5cdd366178bdd12b4b066c92",
          order: "None"
        }
      ],
      participant: "5cdd36e478bdd12b4b066c93"
    },
    {
      Symptoms: [
        {
          date: 1543915023000,
          severity: "7",
          symptom: "5c9c2c0a06b014a1e9ab2aef",
          symptom_name: "Cyst, Bck of Lft Hand",
          arrow: "none",
          _id: "5cdd366178bdd12b4b066c92"
        },
        {
          date: 1558429870000,
          severity: "38",
          symptom: "5c9c2c0c06b014a1e9ab30c6",
          symptom_name: "Fever",
          visibility: true,
          arrow: "none",
          _id: "5cdd366178bdd12b4b066c92",
          order: "0"
        },
        {
          date: 1558429963000,
          severity: "2",
          symptom: "5c9c2c0c06b014a1e9ab3136",
          symptom_name: "Headache",
          arrow: "down",
          _id: "5cdd366178bdd12b4b066c92"
        }
      ],
      participant: "5cdd370d78bdd12b4b066c94"
    }
  ];

  return data;
}
