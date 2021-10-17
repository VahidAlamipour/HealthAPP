import _ from "lodash";
import {
  getFailed,
  getStarted,
  getSucceeded,
  getEnded,
  statusEnum,
  RECIPE_INITIALIZATION,
  RECIPE_ADD_ITEM,
  RECIPE_EDIT_SELECTED,
  RECIPE_SAVE_ITEM,
  RECIPE_DELETE,
  RECIPE_SAVE,
  RECIPE_CLEAR,
  RECIPE_CREATE_CUISINE,
  RECIPE_CREATE_MEASUREMENT,
  GET_RECIPE,
  SEARCH_INGREDIENTS,
  SEARCH_RECIPES,
  ON_CHANGE_INGREDIENTFORM,
  ON_CHANGE_MYRECIPENTFORM,
  INGREDIENT_OPTION_SELECTED
} from "../actions/constant";

const initialState = {
  isLoading: false,
  status: statusEnum.DEFAULT,
  actionResponse: null,
  recipe: null,
  measurementOptions: [],
  cuisineOptions: [],
  ingredientList: [],
  ingredientForm: {},
  recipeOptions: [],
  recipeForm: {},
  isEditing: false,
  recipeTotalOptions: [],
  ingredientOptions: [],
  selectedIndex: -1,
  disabled: {
    cuisine: true,
    size: true,
    ingredientName: true,
    ingredientbrand: true,
    ingredientcomment: true,
    ingredientsymbol: true,
    ingredientsize: true,
    addBtn: true,
    saveBtn: true,
    clearBtn: true
  },
  classNames: {
    recipeName: "blinking"
  },
  deleteMode: false,
  updateMode: false,
  amountReseter: false,
  amounNewValue: null,
  counterState: 0,
  firstChange: false
};

// Recipe reducer
function reducer(state = initialState, action) {
  function buttonsChecker() {
    var addBtn = true;
    // if (state.symptomForm.users && state.symptomForm.users.length > 0) {
    //    state.disabled.category = false;
    //    state.classNames.UsersBox = '';
    // } else {
    //    state.disabled.category = true;
    //    state.classNames.UsersBox = 'blinking';
    // }
    // if (!state.disabled.category && state.symptomForm.category && state.symptomForm.category != 'null') {
    //    state.disabled.name = false;
    // } else {
    //    state.disabled.name = true;
    // }
    if (state.recipeForm.recipe && state.recipeForm.recipe.length > 1) {
      state.disabled.scale = false;
      state.disabled.cuisine = false;
      state.disabled.size = false;
      state.disabled.ingredientName = false;
      state.disabled.ingredientbrand = false;
      state.disabled.ingredientcomment = false;
      state.disabled.ingredientsymbol = false;
      state.disabled.ingredientsize = false;
      state.classNames.recipeName = "";
    } else {
      state.disabled.scale = true;
      state.disabled.cuisine = true;
      state.disabled.size = true;
      state.disabled.ingredientName = true;
      state.disabled.ingredientbrand = true;
      state.disabled.ingredientcomment = true;
      state.disabled.ingredientsymbol = true;
      state.disabled.ingredientsize = true;
      state.classNames.recipeName = "blinking";
    }
    // if (!state.disabled.name && state.symptomForm.name && state.symptomForm.name.length > 2
    //    && state.unitOptions && state.unitOptions.length > 0) {
    //    state.disabled.unit = false;
    // } else {
    //    state.disabled.unit = true;
    // }
    // if (!state.disabled.name && state.symptomForm.name && state.symptomForm.name.length > 2) {
    //    state.disabled.time = false;
    //    state.disabled.comment = false;
    // } else {
    //    state.disabled.time = true;
    //    state.disabled.comment = true;

    // }
    if (
      state.ingredientForm.recipe &&
      state.ingredientForm.recipe.length > 2 &&
      state.ingredientForm.symbol &&
      state.ingredientForm.symbol != "null" &&
      state.ingredientForm.size
    ) {
      addBtn = false;
    } else {
      addBtn = true;
    }
    // clear Button
    if (
      state.recipeForm.recipe ||
      state.recipeForm.cuisine ||
      state.recipeForm.size ||
      state.ingredientForm.recipe ||
      state.ingredientForm.symbol ||
      state.ingredientForm.size ||
      state.ingredientForm.comment ||
      state.ingredientForm.brand ||
      state.ingredientList.length > 0
    ) {
      state.disabled.clearBtn = false;
    } else {
      state.disabled.clearBtn = true;
    }
    // delete and update
    if (state.selectedIndex >= 0) {
      if (
        state.ingredientSelected.recipe != state.ingredientForm.recipe ||
        state.ingredientSelected.symbol != state.ingredientForm.symbol ||
        state.ingredientSelected.size != state.ingredientForm.size ||
        state.ingredientSelected.brand != state.ingredientForm.brand ||
        state.ingredientSelected.comment != state.ingredientForm.comment
      ) {
        state.deleteMode = false;
        state.updateMode = true;
      } else {
        state.deleteMode = true;
        state.updateMode = false;
      }
    } else {
      state.deleteMode = false;
      state.updateMode = false;
    }

    var saveBtn = true;
    if (
      state.ingredientList &&
      state.ingredientList.length > 1 &&
      state.recipeForm.recipe &&
      state.recipeForm.recipe.length > 1 &&
      state.recipeForm.cuisine &&
      state.recipeForm.cuisine != "null" &&
      state.recipeForm.size &&
      state.recipeForm.size != "null"
    ) {
      saveBtn = false;
    } else {
      saveBtn = true;
    }
    if (state.ingredientList.length > 0) {
      window.changeData = true;
    } else {
      window.changeData = false;
    }
    state.disabled.saveBtn = saveBtn;
    state.disabled.addBtn = addBtn;
    state.counterState = state.counterState + 1;
  }

  let ingredientList = [];
  let selectedIndex = -1;

  switch (action.type) {
    case getStarted(RECIPE_INITIALIZATION):
    case getStarted(RECIPE_SAVE):
    case getStarted(RECIPE_CREATE_CUISINE):
    case getStarted(RECIPE_CREATE_MEASUREMENT):
      return { ...state, isLoading: true };
    case getSucceeded(RECIPE_INITIALIZATION):
      let measurements = action.payload[0];
      let cuisines = action.payload[1];
      let EditId = action.payload[2];

      let measurementOptions = [];
      for (const measurement of measurements) {
        measurementOptions.push({ value: measurement, label: measurement });
      }
      let cuisineOptions = [];
      for (const cuisine of cuisines) {
        cuisineOptions.push({ value: cuisine, label: cuisine });
      }
      // cuisineOptions.push({ value: "Other", label: "Other" });
      return {
        ...state,
        status: statusEnum.SUCCESS,
        measurementOptions,
        cuisineOptions,
        isEditing: EditId ? true : false
      };
    case getSucceeded(RECIPE_CREATE_CUISINE):
      let cuisineName = action.payload.cuisine;

      cuisines = [...state.cuisineOptions];
      cuisines.splice(0, 0, { value: cuisineName, label: cuisineName });
      return {
        ...state,
        cuisineOptions: cuisines,
        recipeForm: { ...state.recipeForm, cuisine: cuisineName }
      };
    case getSucceeded(RECIPE_CREATE_MEASUREMENT):
      let measurementName = action.payload.name;
      measurements = [...state.measurementOptions];
      measurements.splice(0, 0, {
        value: measurementName,
        label: measurementName
      });
      return {
        ...state,
        measurementOptions: measurements,
        ingredientForm: {
          ...state.ingredientForm,
          measurement: measurementName
        }
      };
    case RECIPE_EDIT_SELECTED:
      selectedIndex = action.index;
      ingredientList = [...state.ingredientList];
      let ingredientSelected = { ...ingredientList[selectedIndex] };

      for (const ingredient of ingredientList) {
        ingredient.isSelected = false;
      }
      ingredientList[selectedIndex].isSelected = true;
      if (selectedIndex === state.selectedIndex) {
        ingredientSelected = {};
        ingredientList[selectedIndex].isSelected = false;
        selectedIndex = -1;
        state.amountReseter = !state.amountReseter;
        state.amounNewValue = "";
      } else {
        state.amountReseter = !state.amountReseter;
        state.amounNewValue = ingredientSelected.size;
      }
      //            document.getElementById('ingredient').value = ingredientSelected.recipe;
      state.ingredientList = ingredientList;
      state.selectedIndex = selectedIndex;
      state.ingredientForm = { ...ingredientSelected };
      state.ingredientSelected = ingredientSelected;
      buttonsChecker();
      return { ...state };
    case getSucceeded(RECIPE_SAVE):
      state.disabled = {
        addBtn: true,
        saveBtn: true,
        clearBtn: true
      };
      state.classNames = {
        recipeName: "blinking"
      };
      state.amountReseter = !state.amountReseter;
      state.amounNewValue = "";
      buttonsChecker();
      return {
        ...state,
        isEditing: false,
        selectedIndex: -1,
        ingredientList: [],
        ingredientForm: {},
        status: statusEnum.SUCCESS
      };
    case getFailed(RECIPE_INITIALIZATION):
    case getFailed(RECIPE_CREATE_CUISINE):

    case getFailed(RECIPE_SAVE):
      return { ...state, actionResponse: action.payload };
    case getEnded(RECIPE_INITIALIZATION):
    case getEnded(RECIPE_SAVE):
    case getEnded(RECIPE_CREATE_CUISINE):
    case getEnded(RECIPE_CREATE_MEASUREMENT):
      return { ...state, isLoading: false };

    case GET_RECIPE:
      //ingredientList = [...state.ingredientList];
      let item = action.item;
      ingredientList = [];
      if (item._id != "") {
        if (item.ingredients) ingredientList = item.ingredients;
      }
      state.ingredientList = ingredientList;
      state.recipeForm = {
        ...state.recipeForm,
        _id: item._id,
        size: item.size,
        user: item.user,
        recipe: item.recipe,
        cuisine: item.cuisine,
        firstChange: false
      };
      state.ingredientForm = {};
      buttonsChecker();
      return { ...state };

    case SEARCH_INGREDIENTS:
      state.ingredientForm.recipe = action.recipe;
      state.ingredientForm._id = "";
      buttonsChecker();
      return { ...state };
    case SEARCH_RECIPES:
      if (state.recipeForm.recipe != action.recipe) {
        state.recipeForm._id = "";
        state.firstChange = true;
      }
      state.recipeForm.recipe = action.recipe;
      buttonsChecker();
      return {
        ...state
        //recipeOptions: action.item.show,
        //recipeTotalOptions: action.item.data
      };

    case RECIPE_ADD_ITEM:
      var newData = [];
      var updateFlag = false;
      if (!state.ingredientList <= 0) {
        newData = state.ingredientList.map(item => {
          if (
            item.recipe.toLocaleLowerCase().trim() ==
            action.item.recipe.toLocaleLowerCase().trim()
          ) {
            updateFlag = true;
            return action.item;
          } else {
            return item;
          }
        });
      }
      if (!updateFlag) {
        newData = [...state.ingredientList, action.item];
      }
      state.ingredientList = newData;
      state.ingredientForm = {};
      state.amountReseter = !state.amountReseter;
      state.amounNewValue = "";
      state.firstChange = true;
      buttonsChecker();
      return { ...state };
    //return { ...state, ingredientList: [...state.ingredientList, action.item] };
    case RECIPE_SAVE_ITEM:
      ingredientList = [...state.ingredientList];
      ingredientList[state.selectedIndex] = action.item;
      ingredientList[state.selectedIndex].isSelected = false;
      state.amountReseter = !state.amountReseter;
      state.amounNewValue = "";
      state.selectedIndex = -1;
      state.ingredientForm = {};
      state.ingredientList = ingredientList;
      state.firstChange = true;
      buttonsChecker();
      return { ...state };
    case RECIPE_DELETE:
      ingredientList = [...state.ingredientList];
      _.pullAt(ingredientList, state.selectedIndex);
      //reset form
      state.amountReseter = !state.amountReseter;
      state.amounNewValue = "";
      state.ingredientForm = {};
      state.selectedIndex = -1;
      state.ingredientList = ingredientList;
      state.firstChange = true;

      buttonsChecker();
      return { ...state };
    case RECIPE_CLEAR:
      state.ingredientForm = {};
      state.recipeForm = {};
      state.ingredientList = [];
      state.ingredientOptions = [];
      localStorage.removeItem("recipePageTitle");
      buttonsChecker();

      return { ...state, isEditing: false, selectedIndex: -1 };
    case ON_CHANGE_INGREDIENTFORM:
      state.ingredientForm[action.event.target.name] =
        action.event.target.value;
      state.firstChange = true;

      buttonsChecker();
      return { ...state };
    case ON_CHANGE_MYRECIPENTFORM:
      state.recipeForm[action.event.target.name] = action.event.target.value;
      state.firstChange = true;
      buttonsChecker();
      return { ...state };
    case INGREDIENT_OPTION_SELECTED:
      state.ingredientForm.recipe = action.item.recipe_full;
      state.ingredientForm._id = action.item._id;
      buttonsChecker();
      return { ...state };
    default:
      return state;
  }
}

export default reducer;
