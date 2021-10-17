import _ from 'lodash';
import {checkStatus, parseJSON, getApiUrl, getHeaderForAjax, getProductApiUrl} from './ServiceHelper';
import {getLoggedInUser} from './AuthenticationService';
import idb from 'idb';

export function saveProduct(product) {
    const userId = getLoggedInUser()._id;
    let url = getProductApiUrl() + '/users/' + userId + '/contributions';
    let method = "post";
    return fetch(url, {
        method: method,
        headers: getHeaderForAjax(),
        body: JSON.stringify(product)
    })
        .then(checkStatus)
        .then(parseJSON)
        .then((res) => {
            return res;
        })
}

export function saveToStore(product) {
    product._id = (new Date()).getTime();
    putData('STORE','product', [product]);
    return product;
}

export async function saveFromStore() {
    const database = 'STORE';
    const table = 'product';
    let db = await idb.open(database, 1, upgradeDB => upgradeDB.createObjectStore(table, {keyPath: 'id'}));
    
    let tx = db.transaction(table, 'readwrite')
    let store = tx.objectStore(table);
    let data = await store.getAll();
    data.forEach(async (e) => {
        const ee = JSON.parse(JSON.stringify(e));
        delete ee['_id'];
        try{
            let data = await saveProduct(ee);
            deleteData(database, table, e._id);
        }
        catch (err){
        }
    });
    await tx.complete;
    db.close();
}

async function deleteData(database, table, key){
    let db = await idb.open(database, 1, upgradeDB => { upgradeDB.createObjectStore(table, {keyPath: '_id'});});
    let transaction = db.transaction(table, 'readwrite');
    let productsStore = transaction.objectStore(table);
    productsStore.delete(key);
}

export function setMeasurements() {
    return fetch(getProductApiUrl() + '/recipes/measurement_units/', {
        method: 'GET',
        headers: getHeaderForAjax()
    })
        .then(checkStatus)
        .then(parseJSON)
        .then((res) => {
            res.sort();
            let data = res.map((e, i) => {
                return {
                    _id: i,
                    name: e,
                }
            });
            return data;
        }).catch(async (e) => {
            return [];
        });
}
async function putData(database, table, data)
{
    // TODO:
    // please fix because its showing warnings in Google Chrome
    let db = await idb.open(database, 1, upgradeDB => { upgradeDB.createObjectStore(table, {keyPath: '_id'});});
    let transaction = db.transaction(table, 'readwrite');

    let productsStore = transaction.objectStore(table);
    data.forEach(function(item){
        productsStore.put(item);
    });
}
/*
export function setProducts() {
    const last_sync = localStorage.getItem('last_sync_product') || 0;
    return fetch(getProductApiUrl() + '/contributions/category/product?last_sync=' + last_sync, {
        method: 'GET',
        headers: getHeaderForAjax()
    })
        .then(checkStatus)
        .then(parseJSON)
        .then((res) => {
            localStorage.setItem('last_sync_product', (new Date()).getTime());
            putData('PRODUCT','products', res);
            return res;
        }).catch(() => {
        });
}
export function setFoods() {
    const last_sync = localStorage.getItem('last_sync_food') || 0;
    return fetch(getProductApiUrl() + '/contributions/category/food?last_sync=' + last_sync, {
        method: 'GET',
        headers: getHeaderForAjax()
    })
        .then(checkStatus)
        .then(parseJSON)
        .then((res) => {
            localStorage.setItem('last_sync_food', (new Date()).getTime());
            putData('FOOD','foods', res);
            return res;
        }).catch(() => {
        });
}
export function setBrands() {
    const last_sync = localStorage.getItem('last_sync_brand') || 0;
  return fetch(getProductApiUrl() + '/contributions/personal_care_products/brands?last_sync=' + last_sync , {
    method: 'GET',
    headers: getHeaderForAjax()
  })
      .then(checkStatus)
      .then(parseJSON)
      .then((res) => {
          localStorage.setItem('last_sync_brand', (new Date()).getTime());
        putData('BRAND','brands', res);
        return res;
      }).catch(() => {
      });
}
export function setFoodBrands() {
    const last_sync = localStorage.getItem('last_sync_food_brand') || 0;
  return fetch(getProductApiUrl() + '/contributions/recipes/brands?last_sync=' + last_sync, {
    method: 'GET',
    headers: getHeaderForAjax()
  })
      .then(checkStatus)
      .then(parseJSON)
      .then((res) => {
        putData('FOODBRAND','brands', res);
          localStorage.setItem('last_sync_food_brand', (new Date()).getTime());
        return res;
      }).catch(() => {
      });
}
export function setProductIngredient() {
    const last_sync = localStorage.getItem('last_sync_product_ingredient') || 0;
    return fetch(getProductApiUrl() + '/personalcares/ingredients?last_sync=' + last_sync, {
        method: 'GET',
        headers: getHeaderForAjax()
    })
        .then(checkStatus)
        .then(parseJSON)
        .then((res) => {
            putData('PRODUCT_INGREDIENT','ingredients', res);
            localStorage.setItem('last_sync_product_ingredient', (new Date()).getTime());
            return res;
        }).catch(() => {
        });
}
export function setFoodIngredient() {
    const last_sync = localStorage.getItem('last_sync_food_ingredient') || 0;
    return fetch(getProductApiUrl() + '/recipes?last_sync=' + last_sync , {
        method: 'GET',
        headers: getHeaderForAjax()
    })
        .then(checkStatus)
        .then(parseJSON)
        .then((res) => {
            putData('FOOD_INGREDIENT','ingredients', res);
            localStorage.setItem('last_sync_food_ingredient', (new Date()).getTime());
            return res;
        }).catch(() => {
        });
}
export function setTotalIngredient() {
    const last_sync = localStorage.getItem('last_sync_ingredient') || 0;
    return fetch(getProductApiUrl() + '/recipes?last_sync=' + last_sync , {
        method: 'GET',
        headers: getHeaderForAjax()
    })
        .then(checkStatus)
        .then(parseJSON)
        .then((res) => {
            putData('TOTAL_INGREDIENT','ingredients', res);
            localStorage.setItem('last_sync_ingredient', (new Date()).getTime());
            return res;
        }).catch(() => {
        });
}
async function getData(database, table, key)
{
    let db = await idb.open(database, 1, upgradeDB => upgradeDB.createObjectStore(table, {keyPath: 'id'}));
    
    let tx = db.transaction(table, 'readonly');
    let store = tx.objectStore(table);
    let data = await store.getAll();
    await tx.complete;
    db.close()
    return data;
    // let tx = db.transaction(table, 'readonly');
    // let store = tx.objectStore(table);
    // console.log(store);
    // let data = await store.openCursor(IDBKeyRange.bound(key, key + '\uffff'), 'prev');
    // console.log(data);
    // return [];
}
*/
export function getIngredients(recipe) {
    
    let url = getApiUrl() + '/users/' + getLoggedInUser()._id + '/recipes/' + recipe.id;
    
    return fetch(url, {
        method: 'GET',
        headers: getHeaderForAjax()
    })
        .then(checkStatus)
        .then(parseJSON);
}

export async function searchIngredients(input, type) {
    if(input === '')return {
        show: [],
        all: [],
    };
    let data = [];
    const rlt = [];
    const allrlt = [];
    if(type === 'product'){
        return fetch(getProductApiUrl() + '/personalcares/ingredients/keywords/' + input + '/', {
            method: 'GET',
            headers: getHeaderForAjax()
        })
            .then(checkStatus)
            .then(parseJSON)
            .then((res) => {
                let data = {
                    show: [],
                    all: [],
                };
                for (const item of res) {
                    data.all.push({id: item._id, value: item.name});
                    data.show.push(item.recipe);
                }
                return data;
            });
    }
    else if(type === 'food') {
        const userId = getLoggedInUser()._id;
        //let url = getApiUrl() + '/users/' + userId + '/recipes/keyword/' + input + '/';
        let url = getApiUrl() + '/users/' + userId + '/recipes/keywordCustom/11/' + input + '/1';
        return fetch(url, {
            method: 'GET',
            headers: getHeaderForAjax()
        })
            .then(checkStatus)
            .then(parseJSON)
            .then((res) => {
                let data = {
                    show: [],
                    all: [],
                };
                for (const item of res) {
                    data.all.push({id: item._id, value: item.recipe});
                    data.show.push(item.recipe);
                }
                return data;
            });
    } else {
        return fetch(getProductApiUrl() + '/contributions/ingredients/keywords/' + input + '/', {
            method: 'GET',
            headers: getHeaderForAjax()
        })
            .then(checkStatus)
            .then(parseJSON)
            .then((res) => {
                let data = {
                    show: [],
                    all: [],
                };
                for (const item of res) {
                    data.all.push({id: item._id, value: item.name});
                    data.show.push(item.name);
                }
                return data;
            });
    }
}
export async function searchBrands(input, type) {
    if(input === '')return [];
  input = input.toLowerCase();
  let data = [];
  if(type === 'product'){
      return fetch(getProductApiUrl() + '/contributions/personal_care_products/brands/keywords/' + input + '/', {
          method: 'GET',
          headers: getHeaderForAjax()
      })
          .then(checkStatus)
          .then(parseJSON)
          .then((res) => {
              let data = [];
              for (const item of res) {
                  data.push(item.name);
              }
              return data;
          });
  } else if(type === 'food') {
      return fetch(getProductApiUrl() + '/contributions/recipes/brands/keywords/' + input + '/', {
          method: 'GET',
          headers: getHeaderForAjax()
      })
          .then(checkStatus)
          .then(parseJSON)
          .then((res) => {
              let data = [];
              for (const item of res) {
                  data.push(item.name);
              }
              return data;
          });
  } else{
      return fetch(getProductApiUrl() + '/contributions/all/brands/keywords/' + input + '/', {
          method: 'GET',
          headers: getHeaderForAjax()
      })
          .then(checkStatus)
          .then(parseJSON)
          .then((res) => {
              let data = [];
              for (const item of res) {
                  data.push(item.name);
              }
              return data;
          });
  }
}

export async function validateUpc(category, upc) {
    return fetch(getApiUrl() + '/contributions/category/' + category + '?upc=' + upc , {
        method: 'GET',
        headers: getHeaderForAjax()
    })
        .then(checkStatus)
        .then(parseJSON)
        .then((res) => {
            return res;
        })
}
