import {
  saveProduct as saveProductService,
  getIngredients as getIngredientsService,
  searchIngredients as searchIngredientsService,
  searchProducts as searchProductsService,
  setMeasurements as setMeasurementsService,
  // setProducts as setProductsService,
  // setFoods as setFoodsService,
  setTotalIngredient as setTotalIngredientService,
  setBrands as setBrandsService,
  setFoodBrands as setFoodBrandsService,
  searchBrands as searchBrandsService,
  setProductIngredient as setProductIngredientService,
  setFoodIngredient as setFoodIngredientService,
  saveToStore as saveToStoreService,
  validateUpc as validateUpcService
} from "../services/ProductService";
import { createActionThunk } from "redux-thunk-actions";
import i18n from "../i18n";
import {
  getFailed,
  getStarted,
  getSucceeded,
  getEnded,
  PRODUCT_INITIALIZATION,
  PRODUCT_ADD_ITEM,
  PRODUCT_EDIT_SELECTED,
  PRODUCT_SAVE_ITEM,
  PRODUCT_DELETE,
  PRODUCT_SAVE,
  GET_PRODUCT,
  PRODUCT_CLEAR,
  PRODUCT_CREATE_CUISINE,
  PRODUCT_CREATE_MEASUREMENT,
  SEARCH_PRODUCT_INGREDIENTS,
  SEARCH_BRANDS,
  SEARCH_PRODUCTS,
  PRODUCT_CATEGORY_SELECTED,
  ON_CHANGE_PRODUCT,
  UPC_NOT_IN_PRODUCT,
  ON_CHANGE_INGREDIENTFORM_PRODUCT,
  ON_SELECT_INGREDIENNAME_PRODUCT
} from "./constant";
import { submit, reset } from "redux-form";

const formInitialization = createActionThunk(PRODUCT_INITIALIZATION, () =>
  Promise.all([setMeasurementsService()])
);

const addClicked = () => {
  return dispatch => {
    dispatch(submit("formProductIngredient"));
  };
};

const saveClicked = () => {
  return dispatch => {
    dispatch(submit("formProductIngredient"));
  };
};

const addIngredientItem = item => {
  return dispatch => {
    dispatch({
      type: PRODUCT_ADD_ITEM,
      item: item
    });
    dispatch(reset("formProductIngredient"));
  };
};

const editIngredientItem = (index, selectedIndex, item) => {
  return dispatch => {
    dispatch({
      type: PRODUCT_EDIT_SELECTED,
      index: index
    });
    dispatch(reset("formProductIngredient"));
  };
};

const getIngredients = e => {
  let product = e;
  return async dispatch => {
    try {
      //let data = await getIngredientsService(product);
      dispatch({
        type: GET_PRODUCT,
        item: product
      });
      // dispatch(reset('formProductIngredient'));
    } catch (e) {
      return dispatch({ type: getFailed(GET_PRODUCT), error: e });
    }
  };
};

const saveIngredientItem = item => {
  return dispatch => {
    dispatch({
      type: PRODUCT_SAVE_ITEM,
      item: item
    });
    dispatch(reset("formProductIngredient"));
  };
};

const deleteIngredientItem = dIndex => {
  return dispatch => {
    dispatch({
      type: PRODUCT_DELETE,
      index: dIndex
    });
    dispatch(reset("formProductIngredient"));
  };
};

const saveProduct = (product, callback) => {
  return async dispatch => {
    try {
      const data = await saveProductService(product);
      callback();
      dispatch({
        type: PRODUCT_CLEAR
      });
      dispatch(reset("formProduct"));
      dispatch(reset("formProductIngredient"));
    } catch (e) {
      alert(e.message);
      // if (e.message === "Failed to fetch"){
      //     await saveToStoreService(product);
      // }
      // return dispatch({type: getFailed(PRODUCT_SAVE), error: e});
    }
  };
};

const saveClickedProduct = () => {
  return dispatch => {
    dispatch(submit("formProduct"));
  };
};

const clearProduct = () => {
  return dispatch => {
    dispatch({
      type: PRODUCT_CLEAR
    });
    dispatch(reset("formProduct"));
    dispatch(reset("formProductIngredient"));
  };
};

const searchIngredientOptions = (key, category) => {
  return async dispatch => {
    let data = {
      show: [],
      all: []
    };
    try {
      data = await searchIngredientsService(key, category);
      dispatch({
        type: SEARCH_PRODUCT_INGREDIENTS,
        item: data,
        key: key
      });
    } catch (e) {
      dispatch({
        type: SEARCH_PRODUCT_INGREDIENTS,
        item: data,
        key: key
      });
    }
  };
};
const validateUpc = (category, upc, callback) => {
  return async dispatch => {
    try {
      var data = await validateUpcService(category, upc);
      //var data = [{}];
      //var data = [];
      var result = data.length > 0 ? true : false;
      callback(result);
      //alert(i18n.t("products.UPC_EXIST"));
    } catch (e) {}
  };
};

const searchProductOptions = (key, type) => {
  return;
};
const searchBrandOptions = (key, type) => {
  return async dispatch => {
    let data = [];
    try {
      data = await searchBrandsService(key, type);
      dispatch({
        type: SEARCH_BRANDS,
        item: data,
        key: key
      });
    } catch (e) {
      // if(data.length==0)
      //     data.push({value: key, label: "Create:" + key});
      dispatch({
        type: SEARCH_BRANDS,
        item: data,
        key: key
      });
    }
  };
};

const categorySelected = e => {
  return dispatch => {
    dispatch({
      type: PRODUCT_CATEGORY_SELECTED,
      value: e
    });
  };
};
const onChangeForm = e => {
  return dispatch => {
    dispatch({
      type: ON_CHANGE_PRODUCT,
      event: e
    });
  };
};
const thereIsNotUPC = status => {
  return dispatch => {
    dispatch({
      type: UPC_NOT_IN_PRODUCT,
      status: status
    });
  };
};
const onChangeIngredientForm = e => {
  return dispatch => {
    dispatch({
      type: ON_CHANGE_INGREDIENTFORM_PRODUCT,
      event: e
    });
  };
};
const selectIngredientName = (name, id) => {
  return dispatch => {
    dispatch({
      type: ON_SELECT_INGREDIENNAME_PRODUCT,
      item: { name: name, id: id }
    });
  };
};
export default {
  formInitialization,
  addClicked,
  saveClicked,
  addIngredientItem,
  editIngredientItem,
  saveIngredientItem,
  deleteIngredientItem,
  saveProduct,
  clearProduct,
  getIngredients,
  saveClickedProduct,
  searchIngredientOptions,
  searchProductOptions,
  categorySelected,
  searchBrandOptions,
  validateUpc,
  onChangeForm,
  thereIsNotUPC,
  onChangeIngredientForm,
  selectIngredientName
};
