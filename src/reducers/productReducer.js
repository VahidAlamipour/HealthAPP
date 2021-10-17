import _ from "lodash";
import {
  getFailed,
  getStarted,
  getSucceeded,
  getEnded,
  statusEnum,
  PRODUCT_INITIALIZATION,
  PRODUCT_ADD_ITEM,
  PRODUCT_EDIT_SELECTED,
  PRODUCT_SAVE_ITEM,
  PRODUCT_DELETE,
  PRODUCT_SAVE,
  PRODUCT_CLEAR,
  GET_PRODUCT,
  SEARCH_PRODUCT_INGREDIENTS,
  SEARCH_BRANDS,
  SEARCH_PRODUCTS,
  PRODUCT_CATEGORY_SELECTED,
  ON_CHANGE_PRODUCT,
  UPC_NOT_IN_PRODUCT,
  ON_CHANGE_INGREDIENTFORM_PRODUCT,
  ON_SELECT_INGREDIENNAME_PRODUCT
} from "../actions/constant";
import { stat } from "fs";

const initialState = {
  isLoading: false,
  status: statusEnum.DEFAULT,
  actionResponse: null,
  product: null,
  disabled: {
    UPC: true,
    productName: true,
    brand: true,
    comment: true,
    ingredientName: true,
    size: true,
    m_unit: true,
    clearBtn: true,
    addBtn: true,
    saveBtn: true
  },
  classNames: {
    category: "blinking"
  },
  measurementOptions: [],
  cuisineOptions: [],
  ingredientList: [],
  productOptions: [],
  brandOptions: [],
  productForm: {},
  ingredientForm: {},
  isEditing: false,
  ingredientTotalOptions: [],
  ingredientOptions: [],
  UPCisValid: true,
  selectedIndex: -1,
  counterState: 0,
  amountReseter: false,
  amounNewValue: null
};

// Recipe reducer
function reducer(state = initialState, action) {
  function buttonsChecker() {
    // var addBtn = true;

    //window.changeData = true;

    if (state.productForm.category && state.productForm.category != "null") {
      state.disabled.UPC = false;
      state.classNames.category = "";
    } else {
      state.disabled.UPC = true;
      state.disabled.productName = true;
      state.disabled.brand = true;
      state.disabled.comment = true;
      state.disabled.ingredientName = true;
      state.disabled.size = true;
      state.disabled.m_unit = true;
      state.classNames.category = "blinking";
    }
    if (state.UPCisValid) {
      state.disabled.productName = true;
      state.disabled.brand = true;
      state.disabled.comment = true;
      state.disabled.ingredientName = true;
      state.disabled.size = true;
      state.disabled.m_unit = true;
    } else {
      //state.productForm.UPC = '';
      state.disabled.productName = false;
      state.disabled.brand = false;
      state.disabled.comment = false;
      state.disabled.ingredientName = false;
      state.disabled.size = false;
      state.disabled.m_unit = false;
    }
    // if (!state.disabled.name && state.symptomForm.name && state.symptomForm.name.length > 1
    //     && state.unitOptions && state.unitOptions.length > 0) {
    //     state.disabled.unit = false;
    // } else {
    //     state.disabled.unit = true;
    // }
    // if (!state.disabled.name && state.symptomForm.name && state.symptomForm.name.length > 1) {
    //     state.disabled.time = false;
    //     state.disabled.comment = false;
    // } else {
    //     state.disabled.time = true;
    //     state.disabled.comment = true;

    // }
    //addBtn
    if (!state.disabled.ingredientName && state.ingredientForm.name) {
      if (
        state.ingredientForm.m_unit &&
        state.ingredientForm.m_unit != "null" &&
        !state.ingredientForm.size
      ) {
        state.disabled.addBtn = true;
      } else {
        state.disabled.addBtn = false;
      }
    } else {
      state.disabled.addBtn = true;
    }
    // clear Button
    if (
      (state.productForm.category && state.productForm.category != "null") ||
      state.productForm.UPC ||
      state.productForm.name ||
      state.productForm.brand ||
      state.ingredientList.length > 0 ||
      state.productForm.comment
    ) {
      state.disabled.clearBtn = false;
    } else {
      state.disabled.clearBtn = true;
    }
    // save button
    if (
      state.ingredientList.length > 0 &&
      state.productForm.category &&
      state.productForm.category != "null" &&
      state.productForm.UPC &&
      state.productForm.name &&
      state.productForm.brand &&
      !state.disabled.UPC &&
      !state.disabled.name &&
      !state.disabled.brand
    ) {
      state.disabled.saveBtn = false;
    } else {
      state.disabled.saveBtn = true;
    }
    // // delete and update
    // if (state.selectedList.length >= 1) {
    //     if (state.selectedList.length == 1 &&
    //         (state.selectedItem.category != state.symptomForm.category ||
    //             state.selectedItem.scale != state.symptomForm.scale ||
    //             state.selectedItem.name != state.symptomForm.name ||
    //             state.selectedItem.unit != state.symptomForm.unit ||
    //             state.selectedItem.comment != state.symptomForm.comment
    //         )
    //     ) {
    //         state.deleteMode = false;
    //         state.updateMode = true;
    //     } else {
    //         state.deleteMode = true;
    //         state.updateMode = false;
    //     }
    // } else {
    //     state.deleteMode = false;
    //     state.updateMode = false;
    // }
    // state.disabled.addBtn = addBtn;
    state.counterState = state.counterState + 1;
  }
  let ingredientList = [];
  let selectedIndex = -1;

  switch (action.type) {
    case getSucceeded(PRODUCT_INITIALIZATION):
      let isEditing = false;
      let measurements = action.payload[0];
      let measurementOptions = [];
      for (const measurement of measurements) {
        measurementOptions.push({
          value: measurement.name,
          label: measurement.name
        });
      }
      buttonsChecker();
      return { ...state, status: statusEnum.SUCCESS, measurementOptions };

    case PRODUCT_EDIT_SELECTED:
      selectedIndex = action.index;

      ingredientList = [...state.ingredientList];
      let ingredientSelected = { ...ingredientList[selectedIndex] };

      for (const ingredient of ingredientList) {
        ingredient.isSelected = false;
      }
      ingredientList[selectedIndex].isSelected = true;
      isEditing = true;
      if (selectedIndex === state.selectedIndex) {
        ingredientSelected = {};
        ingredientList[selectedIndex].isSelected = false;
        selectedIndex = -1;
        isEditing = false;
        state.amountReseter = !state.amountReseter;
        state.amounNewValue = "";
      } else {
        state.amountReseter = !state.amountReseter;
        state.amounNewValue = ingredientSelected.size;
      }
      state.ingredientList = ingredientList;
      state.selectedIndex = selectedIndex;
      state.ingredientForm = { ...ingredientSelected };

      buttonsChecker();
      return { ...state, isEditing };

    case getSucceeded(PRODUCT_SAVE):
      return {
        ...state,
        isEditing: false,
        selectedIndex: -1,
        ingredientList: [],
        ingredientForm: {},
        status: statusEnum.SUCCESS
      };
    case getFailed(PRODUCT_INITIALIZATION):
    case getFailed(PRODUCT_SAVE):
      return { ...state, actionResponse: action.payload };
    case getEnded(PRODUCT_INITIALIZATION):
    case getEnded(PRODUCT_SAVE):
      return { ...state, isLoading: false };

    case GET_PRODUCT:
      ingredientList = [...state.ingredientList];
      let item = action.item;
      // ingredientList = [];
      // if (item._id != '') {
      //     if (item.ingredients)
      //         ingredientList = item.ingredients;
      //     //ingredientList = [{"_id": "5af146b55f4de5e098671162", "product": "WHITE SUGAR", "size": 1, "unit": null, "symbol": "Kg"}, {"_id": "5af146b55f4de5e098671159", "product": "CARROTS,RAW", "size": 250, "unit": null, "symbol": "gram"}];
      // }
      state.productForm.brand = item;
      buttonsChecker();
      //return { ...state, ingredientList, productForm: { ...state.productForm, _id: item._id, size: item.size, user: item.user, product: item.product, cuisine: item.cuisine } };
      return { ...state };

    case SEARCH_PRODUCT_INGREDIENTS:
      if (state.ingredientForm.name != action.key) {
        state.ingredientForm._id = "";
      }
      state.ingredientForm.name = action.key;
      window.changeData = true;
      buttonsChecker();
      return {
        ...state,
        ingredientOptions: action.item.show,
        ingredientTotalOptions: action.item.all
      };
    case SEARCH_PRODUCTS:
      return { ...state, productOptions: action.item };

    case SEARCH_BRANDS:
      state.productForm.brand = action.key;
      buttonsChecker();
      window.changeData = true;
      return { ...state, brandOptions: action.item };

    case PRODUCT_ADD_ITEM:
      ingredientList = [...state.ingredientList];
      if (state.selectedIndex < 0) {
        var newData = [];
        var updateFlag = false;
        if (!state.ingredientList <= 0) {
          newData = state.ingredientList.map(item => {
            if (
              item.name.toLocaleLowerCase().trim() ==
              action.item.name.toLocaleLowerCase().trim()
            ) {
              updateFlag = true;
              return action.item;
            } else {
              return item;
            }
          });
          if (!updateFlag) {
            newData = [...state.ingredientList, action.item];
          }
          ingredientList = newData;
        }
        // if (!updateFlag) {
        //     ingredientList = [...state.ingredientList, action.item];
        // }
      } else {
        ingredientList[state.selectedIndex] = action.item;
        ingredientList[state.selectedIndex].isSelected = false;
      }
      state.ingredientForm = {};
      state.ingredientList = ingredientList;
      window.changeData = true;
      buttonsChecker();
      return { ...state, ingredientOptions: [] };
    case PRODUCT_SAVE_ITEM:
      ingredientList = [...state.ingredientList];
      if (state.selectedIndex < 0) {
        var newData = [];
        var updateFlag = false;
        if (!state.ingredientList <= 0) {
          newData = state.ingredientList.map(item => {
            if (
              item.name.toLocaleLowerCase().trim() ==
              action.item.name.toLocaleLowerCase().trim()
            ) {
              updateFlag = true;
              return action.item;
            } else {
              return item;
            }
          });
          ingredientList = newData;
        }
        // if (!updateFlag) {
        //     ingredientList = [...state.ingredientList, action.item];
        // }
      } else {
        ingredientList[state.selectedIndex] = action.item;
        ingredientList[state.selectedIndex].isSelected = false;
      }

      // ingredientList = [...state.ingredientList];
      // if (state.selectedIndex < 0) {
      //     for (let i = 0; i < ingredientList.length; i++) {
      //         if (ingredientList[i].name === action.item.name) {
      //             ingredientList[i] = action.item;
      //             break;
      //         }
      //     }
      // }

      return {
        ...state,
        ingredientList,
        isEditing: false,
        selectedIndex: -1,
        ingredientForm: {}
      };
    case PRODUCT_DELETE:
      ingredientList = [...state.ingredientList];
      state.ingredientForm = {};
      ingredientList.splice(action.index, 1);
      //_.pullAt(ingredientList, action.index);
      buttonsChecker();
      return { ...state, ingredientList, isEditing: false, selectedIndex: -1 };
    case PRODUCT_CLEAR:
      state.productForm = {};
      state.ingredientForm = {};
      state.ingredientList = [];
      state.UPCisValid = true;
      window.changeData = false;
      buttonsChecker();
      return { ...state, isEditing: false, selectedIndex: -1 };

    case PRODUCT_CATEGORY_SELECTED:
      return {
        ...state,
        productForm: { ...state.productForm, category: action.value }
      };
    case ON_CHANGE_PRODUCT:
      if (action.event.target.name == "UPC") {
        state.UPCisValid = true;
      }
      state.productForm[action.event.target.name] = action.event.target.value;
      window.changeData = true;
      buttonsChecker();
      return { ...state };
    case ON_CHANGE_INGREDIENTFORM_PRODUCT:
      state.ingredientForm[action.event.target.name] =
        action.event.target.value;
      buttonsChecker();
      return { ...state };
    case UPC_NOT_IN_PRODUCT:
      state.UPCisValid = action.status;
      if (action.status) {
        state.productForm = { category: state.productForm.category };
      }
      buttonsChecker();
      return { ...state };
    case ON_SELECT_INGREDIENNAME_PRODUCT:
      state.ingredientForm.name = action.item.name;
      state.ingredientForm._id = action.item.id;
      buttonsChecker();
    default:
      return state;
  }
}

export default reducer;
