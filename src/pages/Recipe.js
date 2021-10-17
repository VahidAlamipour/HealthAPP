import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import { isLoggedIn } from "../services/AuthenticationService";
import { Field, reduxForm, submit } from "redux-form";
import {
  InputText,
  Dropdown,
  VDropdown,
  VInputText,
  Loading,
  ReactSelectAsync,
  RecipePageRecipeFormDropdown,
  InputAmount,
  Valert,
  VautoComplete
} from "../components";
import { Async } from "react-select";
import { Row, Col, Button, Form, FormGroup, Alert } from "reactstrap";
import classNames from "classnames";
import _ from "lodash";

import recipeActions from "../actions/recipeActions";
import { searchRecipe } from "../services/LookupService";
import Validations from "../components/Validations";
import { Input } from "reactstrap";
//import Autocomplete from 'react-autocomplete';
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { AutoComplete } from "redux-form-material-ui";
import { withRouter, Prompt } from "react-router";
import PropTypes from "prop-types";

import {
  isLoadedFromMobile,
  getCurrentOrientation
} from "../services/MobileService";
import { Orientations } from "./PageConstants";

import {
  REACT_STYLE_BUTTON_SIZE_DESKTOP,
  REACT_STYLE_BUTTON_SIZE_MOBILE
} from "./Constants";
import "./styles/recipe.css";

//const RECIPE_NAME_KEY = "RECIPE_NAME_KEY";
const CUISINE_CLICK_COUNT_KEY = "CUISINE_CLICK_COUNT_KEY";
const CUISINE_CURRENT_VALUE = "CUISINE_CURRENT_VALUE";
const SIZE_KEY = "SIZE_KEY";

class IngredientForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      autoIngredientValidator: "",
      symbolValue: "",
      symbolValidator: "",
      sizeValue: "",
      sizeValidator: ""
    };
    this.selectIngredientOptions = this.selectIngredientOptions.bind(this);
    this.symbolOnChange = this.symbolOnChange.bind(this);
    this.sizeOnChange = this.sizeOnChange.bind(this);
    this.stateChanger = this.stateChanger.bind(this);
    this.onChangeIngredientForm = this.onChangeIngredientForm.bind(this);
  }
  componentDidMount() {
    this.props.onRef(this);
  }
  stateChanger(key, value) {
    var data = {};
    data[key] = value;
    this.setState(data, function() {
      console.log(this.state);
    });
  }
  //functions
  symbolOnChange(e) {
    var val = e.target.value == "null" ? "" : e.target.value;
    this.setState({ symbolValue: val });
    if (val) {
      this.setState({ symbolValidator: "" });
    }
    e.target.val = val;
    this.props.onChangeIngredientForm(e);
    return true;
  }
  sizeOnChange(event) {
    var word = event.target.value;
    if (word || word != "null") {
      // var lastChar = word[word.length - 1];
      // var charCode = lastChar.charCodeAt();
      // if (charCode < 46 || charCode > 57) {
      //    word = word.substring(0, word.length - 1);

      //    this.props.change('size', word);

      // }
      this.setState({ sizeValidator: "" });
    }
    return true;
  }
  selectIngredientOptions(e) {
    var resultVal = e.recipe_full;
    var flagVal = false;
    if (e) flagVal = true;
    if (flagVal) {
      this.props.change("_id", "1");
      this.props.change("ingredientFlag", true);
    } else {
      this.props.change("_id", undefined);
      this.props.change("ingredientFlag", false);
    }
    this.props.change("recipe", resultVal);
    this.props.IngredientOptionSelected(e);
  }
  amountReset() {
    this.amountRef.valueChenger("");
  }
  amountChenger(val) {
    this.amountRef.valueChenger(val);
  }
  onChangeIngredientForm(e) {
    //e.target.value = this.amountRef.getValue();
    this.props.onChangeIngredientForm(e);
  }
  render() {
    let props = this.props;
    const { t, ingredientForm } = this.props;
    const positive = value => {
      if (value < 0) {
        return 0;
      } else {
        return value;
      }
    };

    return (
      <Form>
        <FormGroup>
          <Field
            name="recipe"
            component={VautoComplete}
            disabled={this.props.disabled.ingredientName}
            placeholder={this.props.t("recipe.INGREDIENT_FIELD_DEFAULT_TEXT")}
            show={this.state.show}
            onChangeText={this.props.searchIngredientOptions}
            onSelect={this.selectIngredientOptions}
            val={ingredientForm.recipe || ""}
            category="02"
            level="11"
          />
        </FormGroup>
        <FormGroup row>
          <Col className={"border-col"}>
            <Field
              component={InputAmount}
              normalize={positive}
              name="size"
              placeholder={t("recipe.UNIT_FIELD_DEFAULT_TEXT")}
              className={`${this.state.sizeValidator && "is-invalid"}`}
              onRef={ref => (this.amountRef = ref)}
              disabled={this.props.disabled.ingredientsize}
              onKeyUp={e => this.onChangeIngredientForm(e)}
              reseter={this.props.amountReseter}
              amounNewValue={this.props.amounNewValue}
              pattern="[0-9./ ]*"
            />

            {this.state.sizeValidator && (
              <div className="invalid-feedback">{this.state.sizeValidator}</div>
            )}
          </Col>
          <Col className={"border-col"}>
            <Field
              name="symbol"
              component={Dropdown}
              options={props.measurementOptions}
              placeholder={t("recipe.MEASUREMENT_DROPDOWN_PLACEHOLDER")}
              className={`${this.state.symbolValidator && "is-invalid"}`}
              onChange={this.symbolOnChange}
              disabled={this.props.disabled.ingredientsymbol}
            />
            {this.state.symbolValidator && (
              <div className="invalid-feedback">
                {this.state.symbolValidator}
              </div>
            )}
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col className={"border-col"}>
            <Field
              component={InputText}
              type="text"
              name="brand"
              disabled={this.props.disabled.ingredientbrand}
              placeholder={t("recipe.BRAND_FIELD_DEFAULT_TEXT")}
              onChange={e => this.onChangeIngredientForm(e)}
            />
          </Col>
        </FormGroup>
        <Field
          component={InputText}
          type="hidden"
          name="index"
          placeholder="Index"
        />
        <Field
          component={InputText}
          type="hidden"
          name="_id"
          placeholder="Id"
        />
      </Form>
    );
  }
}

IngredientForm = reduxForm({
  form: "formRecipeIngredient",
  enableReinitialize: true
})(IngredientForm);

IngredientForm = connect(state => ({
  initialValues: state.recipe.ingredientForm
}))(IngredientForm);

class RecipeForm extends Component {
  static propTypes = {
    router: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);

    this.state = {
      searchText: "",
      autoRecipeValidator: "",
      cuisineValidator: ""
    };

    const { t } = this.props;
    this.stateChanger = this.stateChanger.bind(this);
    // Recipe Name Input field methods
    // this.getCurrentRecipeName = this.getCurrentRecipeName.bind(this);
    // this.setCurrentRecipeName = this.setCurrentRecipeName.bind(this);
    this.recipeOnChange = this.recipeOnChange.bind(this);
    this.recipeFocus = this.recipeFocus.bind(this);
    // Cuisine Dropdown methods
    this.cuisineOnChange = this.cuisineOnChange.bind(this);
    //this.cuisineClicked = this.cuisineClicked.bind(this);
    //this.cuisineBlurred = this.cuisineBlurred.bind(this);
    this.logCurrentClickCount = this.logCurrentClickCount.bind(this);
    this.getCurrentSelectedCuisine = this.getCurrentSelectedCuisine.bind(this);
    this.setCurrentSelectedCuisine = this.setCurrentSelectedCuisine.bind(this);
    this.getCurrentCuisineClickCount = this.getCurrentCuisineClickCount.bind(
      this
    );
    this.setCurrentCuisineClickCount = this.setCurrentCuisineClickCount.bind(
      this
    );
    // Size Dropdown
    this.onSizeChanged = this.onSizeChanged.bind(this);
    this.getCurrentSelectedSize = this.getCurrentSelectedSize.bind(this);
    //this.setCurrentSelectedSize = this.setCurrentSelectedSize.bind(this);
  }
  componentDidMount() {
    this.props.onRef(this);
    this.setCurrentCuisineClickCount(0);
    this.setCurrentSelectedCuisine("");
    //this.setCurrentSelectedSize(null);
  }
  stateChanger(key, value) {
    var data = {};
    data[key] = value;
    this.setState(data, function() {
      console.log(this.state);
    });
  }
  onSizeChanged(event) {
    this.props.onChangeRecipeForm(event);
    //this.setCurrentSelectedSize(event.target.value);
  }
  getCurrentSelectedSize() {
    var size = localStorage.getItem(SIZE_KEY);
    return size;
  }
  // setCurrentSelectedSize(p_value) {
  //   localStorage.setItem(SIZE_KEY, p_value);
  // }
  getCurrentSelectedCuisine() {
    return localStorage.getItem(CUISINE_CURRENT_VALUE);
  }
  setCurrentSelectedCuisine(p_cuisineName) {
    localStorage.setItem(CUISINE_CURRENT_VALUE, p_cuisineName);
  }
  getCurrentCuisineClickCount() {
    return localStorage.getItem(CUISINE_CLICK_COUNT_KEY);
  }
  setCurrentCuisineClickCount(p_clickCount) {
    localStorage.setItem(CUISINE_CLICK_COUNT_KEY, p_clickCount);
  }
  logCurrentClickCount() {
    console.log(
      "Recipe::RecipeForm::logCurrentClickCount()" +
        this.getCurrentCuisineClickCount()
    );
  }
  // cuisineClicked(event) {
  //   //console.log("Recipe::RecipeForm::cuisineClicked()");
  //   //this.logCurrentClickCount();
  //   this.setCurrentCuisineClickCount(
  //     parseInt(this.getCurrentCuisineClickCount()) + 1
  //   );
  //   //this.logCurrentClickCount();
  //   if (parseInt(this.getCurrentCuisineClickCount()) > 1) {
  //     this.setCurrentCuisineClickCount(0);
  //     this.props.otherCuisineModal(event);
  //   }
  // }
  // cuisineBlurred(event) {
  //   //console.log("Recipe::RecipeForm::cuisineBlurred()");
  //   if (parseInt(this.getCurrentCuisineClickCount()) > 0) {
  //     //this.logCurrentClickCount();
  //     this.setCurrentCuisineClickCount(
  //       parseInt(this.getCurrentCuisineClickCount()) - 1
  //     );
  //     //this.logCurrentClickCount();
  //   }
  // }
  cuisineOnChange(event) {
    //console.log("Recipe::RecipeForm::cuisineOnChange(), event.target.value:" + event.target.value );
    this.props.onChangeRecipeForm(event);
    if (event.target.value || event.target.value != "null") {
      this.setState({ cuisineValidator: "" });
    }
    // if (
    //   event.target.value === this.props.t("recipe.CUISINE_DROPDOWN_VALUE_OTHER")
    // ) {
    //   this.props.otherCuisineModal(event);
    //   this.setCurrentCuisineClickCount(0);
    //   this.setCurrentSelectedCuisine(
    //     this.props.t("recipe.CUISINE_DROPDOWN_VALUE_OTHER")
    //   );
    // } else {
    //   this.setCurrentSelectedCuisine(event.target.value);
    // }
    this.setCurrentSelectedCuisine(event.target.value);
    return true;
  }
  // getCurrentRecipeName() {
  //   return localStorage.getItem(RECIPE_NAME_KEY);
  // }
  // setCurrentRecipeName(p_value) {
  //   localStorage.setItem(RECIPE_NAME_KEY, p_value);
  // }
  recipeOnChange = val => {
    //this.setState({ searchText: e.target.value });

    //this.setCurrentRecipeName(val);
    if (window.id == "") {
      this.props.change("_id", "");
      this.props.change("user", "");
    }
    this.props.searchRecipeOptions(val);
    return true;
  };
  recipeFocus = e => {
    console.log("Recipe::recipeFocus(), e.target.value:" + e.target.value);
  };

  render() {
    let props = this.props;
    const { t, classNames, recipeForm } = this.props;
    let servingOptions = [];
    _.times(50, i => {
      const serving = i + 1;
      servingOptions.push({ value: serving, label: serving });
    });
    return (
      <Form onSubmit={props.handleSubmit}>
        <FormGroup>
          <Field
            name="recipe"
            component={VautoComplete}
            placeholder={this.props.t("recipe.RECIPE_NAME_DEFAULT_TEXT")}
            //show={this.state.show}
            onChangeText={val => {
              this.recipeOnChange(val);
            }}
            onSelect={props.getIngredients}
            val={recipeForm.recipe}
            category="02"
            level="01111"
          />
          {/* <Col className={"border-col"}>
            <Field
              name="recipe"
              component={AutoComplete}
              className={`item-input-text ${this.state.autoRecipeValidator &&
                "is-invalid"}  ${classNames.recipeName}`}
              onFocus={true}
              // note:
              // I don't know w/c of the ff properties
              // really modify the value of the AutoComplete component
              // so I used the 3 properties to be sure
              value={_recipeValue}
              placeholder={t("recipe.RECIPE_NAME_DEFAULT_TEXT")}
              defaultValue={_recipeValue}
              //hintText="Enter Recipe Name..."
              //hintText={_recipeNameHint}

              //floatingLabelText="Enter Recipe Name..."
              listStyle={{ maxHeight: 200, overflow: "auto" }}
              openOnFocus
              fullWidth={true}
              onKeyUp={this.recipeOnChange}
              //onKeyDown={this.recipeFocus}
              dataSource={props.recipeOptions}
              //validate={_recipeValidation}
              filter={(searchText, key) => true}
              underlineStyle={{ display: "none" }}
              //dataSourceConfig={{ text: 'value', value: 'id'}}
              //dataSourceConfig={{ text: 'value', value: 'id'}}
              onNewRequest={props.getIngredients}
              maxlength="63"
            />
          </Col> */}
        </FormGroup>
        <FormGroup row>
          <Col className={"border-col"}>
            <Field
              name="cuisine"
              component={RecipePageRecipeFormDropdown}
              options={props.cuisineOptions}
              className={`${this.state.cuisineValidator && "is-invalid"}`}
              placeholder={t("recipe.CUISINE_DROPDOWN_PLACEHOLDER")}
              //validate={Validations.select_required}
              onChange={this.cuisineOnChange}
              // onClick={
              //   this.getCurrentSelectedCuisine() ===
              //     t("recipe.CUISINE_DROPDOWN_VALUE_OTHER") &&
              //   this.cuisineClicked
              // }
              // onBlur={
              //   this.getCurrentSelectedCuisine() ===
              //     t("recipe.CUISINE_DROPDOWN_VALUE_OTHER") &&
              //   this.cuisineBlurred
              // }
              disabled={this.props.disabled.cuisine}
            />
          </Col>
          <Col className={"border-col"}>
            <Field
              name="size"
              //component={Dropdown}
              component={RecipePageRecipeFormDropdown}
              options={servingOptions}
              placeholder={
                /*"Serving"*/ t("recipe.SERVING_DROPDOWN_PLACEHOLDER")
              }
              onChange={this.onSizeChanged}
              disabled={this.props.disabled.cuisine}
              //defaultValue={_sizeValue}
            />
          </Col>
          <Field
            component={InputText}
            type="hidden"
            name="_id"
            placeholder="ID"
          />
          <Field
            component={InputText}
            type="hidden"
            name="user"
            placeholder="user"
          />
        </FormGroup>
        <FormGroup row>
          <Col className={"border-col"}>
            <Field
              component={InputText}
              type="textarea"
              name="comment"
              placeholder={t("recipe.COMMENT_FIELD_DEFAULT_TEXT")}
              disabled={this.props.disabled.ingredientcomment}
              onChange={this.props.onChangeRecipeForm}
            />
          </Col>
        </FormGroup>
      </Form>
    );
  }
}

RecipeForm = reduxForm({
  form: "formRecipe",
  enableReinitialize: true
})(RecipeForm);

RecipeForm = withRouter(
  connect(state => ({
    initialValues: state.recipe.recipeForm
  }))(RecipeForm)
);

class Recipe extends React.Component {
  constructor(props) {
    super(props);
    this.addClicked = this.addClicked.bind(this);
    this.ingredientSubmit = this.ingredientSubmit.bind(this);
    this.saveClicked = this.saveClicked.bind(this);
    //this.deleteClicked = this.deleteClicked.bind(this);
    this.saveRecipe = this.saveRecipe.bind(this);
    this.saveClickedRecipe = this.saveClickedRecipe.bind(this);
    this.clearRecipe = this.clearRecipe.bind(this);
    this.otherCuisineModal = this.otherCuisineModal.bind(this);
    this.recipeSubmit = this.recipeSubmit.bind(this);
    this.askClearRecipe = this.askClearRecipe.bind(this);
    this.ingredientUpdatedFunction = this.ingredientUpdatedFunction.bind(this);
    this.submitAfterAsk = this.submitAfterAsk.bind(this);
    this.savedAddItem = this.savedAddItem.bind(this);
    this.state = {
      changedCnt: 1,
      is_saved: 0,
      ingredientValidator: "",
      clearModalStatus: false
    };
    this.saveFalg = false;
    this.idNoProblem = false;
  }
  componentDidMount() {
    if (!isLoggedIn()) {
      this.props.history.push("/");
      return;
    }
    let id = this.props.location.search.replace("?id=", "");
    this.props.formInitialization(id);
    window.id = id;
    if (id == "") {
      this.props.clearRecipe();
    } else {
      this.props.loadIngredients({
        id: id
      });
    }
  }

  componentWillUnmount() {
    localStorage.removeItem(SIZE_KEY);
    //localStorage.removeItem(RECIPE_NAME_KEY);
    this.props.clearRecipe();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.refs.ingredients_container != null) {
      this.refs.ingredients_container.scrollTop = this.refs.ingredients_container.scrollHeight;
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.ingredientList && nextProps.ingredientList.length > 1) {
      this.setState({ ingredientValidator: "" });
    }
  }
  addClicked() {
    this.props.addClicked();
  }
  savedAddItem() {
    this.idNoProblem = true;
    this.ingredientSubmit(this.savedValues);
  }
  ingredientSubmit(values) {
    if (!values.recipe) {
      values = this.props.ingredientForm;
    }
    var validationFlag = true;
    var { recipe, symbol, size } = values;
    var newValue = values.recipe;
    this.props.ingredientOptions.forEach(item => {
      if (
        item &&
        item.toLowerCase().trim() == values.recipe.toLowerCase().trim()
      ) {
        values._id = "1";
        newValue = item;
      }
    });
    if (!this.idNoProblem && !values._id) {
      this.noIdValert.changeStatus();
      this.savedValues = values;
      return false;
    }
    this.idNoProblem = false;
    values.recipe = newValue;
    if (values.ingredientFlag) {
      values._id = "1";
    }
    if (!this.props.updateMode && !this.props.ingredientList <= 0) {
      this.props.ingredientList.forEach(item => {
        if (
          item.recipe.toLocaleLowerCase().trim() ==
          values.recipe.toLocaleLowerCase().trim()
        ) {
          validationFlag = false;
          this.updateIngredientValert.changeStatus();
          this.ingredientUpdatedValues = values;
          this.updateIngradientMessage = `This ingredient is already on the list. If you want to replace, click Yes. Otherwise, click Cancel.`;
          return;
        }
      });
    }

    if (!validationFlag) return;

    //return;
    // if (typeof values._id == "undefined" || values._id == "") {
    //    alert(this.props.t('recipe.PROMPT_INGREDIENT_NOT_IN_DB_WARNING'));
    // }
    if (!this.props.updateMode) {
      this.props.addIngredientItem(values);
      this.ingredient.stateChanger("autoIngredientValidator", "");
      this.ingredient.stateChanger("symbolValidator", "");
      this.ingredient.stateChanger("sizeValidator", "");
    } else {
      this.props.saveIngredientItem(this.props.formRecipeIngredient.values);
    }
  }
  ingredientUpdatedFunction() {
    this.props.addIngredientItem(this.ingredientUpdatedValues);
  }
  submitAfterAsk(values) {
    this.ingredientFromValues = {};
    this.recipeSubmit(this.afterAskValues);
  }

  recipeSubmit() {
    let values = this.props.recipeForm;
    var inF =
      this.ingredientFromValues == undefined
        ? this.props.ingredientForm
        : this.ingredientFromValues;
    if (
      inF.recipe ||
      inF.size ||
      inF.brand ||
      inF.comment ||
      (inF.symbol && inF.symbol != "null")
    ) {
      this.dataInFormValert.changeStatus();
      this.afterAskValues = values;
      return false;
    }
    this.ingredientFromValues = undefined;
    if (!this.saveFalg) {
      return;
    }
    this.saveFalg = false;

    var validationFlag = true;
    // var { cuisine, recipe, size } = values;
    // var _recipeName;
    // if (localStorage.getItem(RECIPE_NAME_KEY)) {
    //   _recipeName = localStorage.getItem(RECIPE_NAME_KEY);
    // } else {
    //   _recipeName = values.recipe;
    // }
    let data = {
      recipe: values.recipe,
      cuisine: values.cuisine,
      user: values.user,
      size: values.size,
      comment: values.comment,
      ingredients: this.props.ingredientList
    };

    if (data.ingredients.length < 2) {
      validationFlag = false;
      this.setState({
        ingredientValidator: "You have to create at least 2 ingredients!"
      });
    } else {
      this.setState({ ingredientValidator: "" });
    }
    if (!validationFlag) return;
    setTimeout(() => {
      if (!(values._id == undefined) && values._id != "") {
        if (typeof data.user == "undefined" || data.user == "") {
          let recipe_name = prompt(
            "That already exists in references. Please enter another name!"
          );
          if (recipe_name == null || typeof recipe_name == undefined)
            return false;
          data.recipe = recipe_name;
          data._id = "";
        } else {
          let message =
            "There is already a recipe with that name.. Do you want to update?";
          if (window.id != "" && values._id == window.id) {
            //message="Do you want to update?";
            message = this.props.t("recipe.PROMPT_UPDATE_RECIPE");
          }

          if (!window.confirm(message)) return false;
          data._id = values._id;
        }
      }
      this.props.saveRecipe(data, () => {
        localStorage.setItem("defaultRecipeManagmentSorting", "rank");
        this.state.is_saved = 1;
        this.props.history.push("/recipemanagement");
      });
    }, 300);
  }

  ingredientItemOnClick(index) {
    const ingredient = this.props.ingredientList[index];
    //this.ingredient.amountChenger(ingredient.original_size);
    ingredient.isSelected = true;
    this.props.editIngredientItem(index, this.props.selectedIndex, ingredient);
  }

  saveClicked() {
    this.props.saveClicked();
  }

  // deleteClicked() {
  //   let confirmResponse = window.confirm("Are you sure delete ingredient?");
  //   if (confirmResponse) {
  //     this.props.deleteIngredientItem();
  //   }
  // }

  saveRecipe() {
    this.props.saveRecipe();
  }

  saveClickedRecipe() {
    this.saveFalg = true;
    this.props.saveClickedRecipe();
  }
  askClearRecipe() {
    this.clearValert.changeStatus();
    //this.setState({clearModalStatus:true});
  }
  clearRecipe() {
    if (this.props.isEditing) {
      window.location = "/recipe";
    }
    this.props.clearRecipe();
    this.recipe.stateChanger("autoRecipeValidator", "");
    this.recipe.stateChanger("cuisineValidator", "");
    this.setState({ ingredientValidator: "" });
    this.ingredient.stateChanger("autoIngredientValidator", "");
    this.ingredient.stateChanger("symbolValidator", "");
    this.ingredient.stateChanger("sizeValidator", "");
    this.ingredient.amountReset();
  }

  otherCuisineModal(e) {
    const cuisineName = window.prompt("Insert new cuisine");
    // if (cuisineName) {
    //     let last = this.cuisineOptions.pop();
    //     const cuisineObj = {value: cuisineName, label: cuisineName};
    //     this.cuisineOptions.push(cuisineObj);
    //     this.cuisineOptions.push(last);
    //     // let cnt = this.state.changedCnt;
    //     // this.setState({changedCnt: ++cnt});
    //     setTimeout(()=>{
    //         e.target.value = cuisineName;
    //     }, 100);
    //     return true;
    // }
    // else{
    //     e.preventDefault();
    //     return false;
    // }
    if (cuisineName) {
      const cuisineObj = { cuisine: cuisineName };
      this.props.createCuisine(cuisineObj);
    }
  }
  // getIngredients(e) {
  //   let ele, data;
  //   for (let i = 0; i < this.props.recipeTotalOptions.length; i++) {
  //     ele = this.props.recipeTotalOptions[i];
  //     if (ele.value == e) {
  //       data = ele;
  //       break;
  //     }
  //   }
  //   this.props.getIngredients(data);
  // }
  leave = location => {
    if (
      !this.state.is_saved &&
      (!this.recipe.props.pristine ||
        !this.ingredient.props.pristine ||
        this.props.firstChange)
    )
      return "Unsaved info will be lost. Are you sure to leave?";
  };
  render() {
    let {
      isLoading,
      status,
      actionResponse,
      measurementOptions,
      cuisineOptions,
      ingredientList,
      ingredientSelected,
      isEditing,
      ingredientOptions,
      searchIngredientOptions,
      searchRecipeOptions,
      recipeOptions,
      t,
      classNames,
      disabled,
      onChangeIngredientForm,
      onChangeRecipeForm,
      amountReseter,
      amounNewValue,
      IngredientOptionSelected,
      updateMode,
      deleteMode,
      ingredientForm,
      recipeForm
    } = this.props;

    let isShowSaveIngredient = false;
    if (
      isEditing &&
      this.props.formRecipeIngredient &&
      this.props.formRecipeIngredient.initial !=
        this.props.formRecipeIngredient.values
      //&& this.props.formRecipeIngredient.active
    ) {
      isShowSaveIngredient = true;
    }
    var _pageFitter, _btnFontSize;
    return (
      <div className="vPage mealPlannerPage flex">
        <Loading isLoading={isLoading} />
        <Valert
          display={false}
          title={t("recipe.DELETE_INGREDIENT_TITLE")}
          question={t("recipe.DELETE_PROMPT_TEXT")}
          onRef={ref => (this.deleteValert = ref)}
          positiveAction={() => {
            this.props.deleteIngredientItem();
          }}
          positiveText="Yes"
          negativeText="Cancel"
        />
        <Valert
          display={false}
          question={
            "You have not added your last item to the list. Do you want to save your data without this item?"
          }
          onRef={ref => (this.dataInFormValert = ref)}
          positiveAction={this.submitAfterAsk}
          positiveText="Yes"
          negativeText="Cancel"
        />
        <Valert
          display={false}
          title="Warning!"
          question={t("symptoms.OTHER_ENTRY_ERROR_TEXT")}
          onRef={ref => (this.noIdValert = ref)}
          positiveAction={this.savedAddItem}
        />
        <Valert
          display={false}
          title={t("recipe.CLEAR_RECIPE_TITLE")}
          question={
            isEditing
              ? t("recipe.RESET_TO_NEW_RECIPE_QUESTION")
              : t("recipe.CLEAR_QUESTION_RECIPE")
          }
          onRef={ref => (this.clearValert = ref)}
          positiveAction={this.clearRecipe}
        />
        <Valert
          display={false}
          question={this.updateIngradientMessage}
          onRef={ref => (this.updateIngredientValert = ref)}
          positiveAction={this.ingredientUpdatedFunction}
          positiveText="Yes"
          negativeText="Cancel"
        />
        {/*<h4 className="title">{t('recipe.PAGE_TITLE')}</h4>*/}
        <MuiThemeProvider>
          <RecipeForm
            cuisineOptions={cuisineOptions}
            otherCuisineModal={this.otherCuisineModal}
            recipeOnChange={this.recipeOnChange}
            recipeOptions={recipeOptions}
            getIngredients={this.props.getIngredients}
            searchRecipeOptions={searchRecipeOptions}
            onSubmit={this.recipeSubmit}
            onRef={ref => (this.recipe = ref)}
            classNames={classNames}
            disabled={disabled}
            t={t}
            onChangeRecipeForm={onChangeRecipeForm}
            recipeForm={recipeForm}
          />
        </MuiThemeProvider>
        {/* <h6 className="entered-ingredients">
          {t("recipe.INGREDIENTS_LIST_DEFAULT_TEXT")}
        </h6> */}
        <div
          className={`grayList ingredient-list ${this.state
            .ingredientValidator && "is-invalid"}`}
          ref="ingredients_container"
          style={{ flex: 1 }}
        >
          {!ingredientList ||
            (ingredientList.length === 0 && (
              <div className="usersItem">
                <Row className="wrapper">
                  <Col>
                    <div>
                      <span className="desc" />
                      {this.props.t("recipe.INGREDIENTS_EMPTY")}
                    </div>
                  </Col>
                </Row>
              </div>
            ))}
          {ingredientList &&
            ingredientList.map((item, i) => {
              let desc = `${item.size || ""} ${item.symbol || ""}   ${
                item.recipe
              }`;
              return (
                <div className="usersItem">
                  <Row
                    className="wrapper"
                    key={i}
                    onClick={this.ingredientItemOnClick.bind(this, i)}
                  >
                    <Col>
                      <div>
                        <span className="desc">{desc}</span>
                        {item.isSelected && <i className="fas fa-check" />}
                        <div className="clearfix" />
                      </div>
                    </Col>
                  </Row>
                </div>
              );
            })}
        </div>
        {/* {this.state.ingredientValidator && (
          <div className="invalid-feedback">
            {this.state.ingredientValidator}
          </div>
        )} */}
        <MuiThemeProvider>
          <IngredientForm
            measurementOptions={measurementOptions}
            ingredientOptions={ingredientOptions}
            searchIngredientOptions={searchIngredientOptions}
            onRef={ref => (this.ingredient = ref)}
            onSubmit={this.ingredientSubmit}
            isEditing={isEditing}
            ingredientSelected={ingredientSelected}
            t={t}
            classNames={classNames}
            disabled={disabled}
            onChangeIngredientForm={onChangeIngredientForm}
            amountReseter={amountReseter}
            amounNewValue={amounNewValue}
            IngredientOptionSelected={IngredientOptionSelected}
            ingredientForm={ingredientForm}
          />
        </MuiThemeProvider>
        <div className="row ops-section formRow baseRow">
          {!updateMode && !deleteMode && (
            <div className="col">
              <button
                type="button"
                className="btn btn-primary"
                style={{ fontSize: _btnFontSize }}
                onClick={this.addClicked}
                disabled={disabled.addBtn ? "disabled" : ""}
              >
                {t("recipe.ADD_INGREDIENT_BUTTON_NAME")}
              </button>
            </div>
          )}
          {updateMode && (
            <div className="col">
              <button
                type="button"
                className="btn btn-primary"
                style={{ fontSize: _btnFontSize }}
                disabled={disabled.addBtn ? "disabled" : ""}
                onClick={this.saveClicked}
              >
                {t("recipe.UPDATE_INGREDIENT_BUTTON_NAME")}
              </button>
            </div>
          )}
          {deleteMode && (
            <div className="col">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => this.deleteValert.changeStatus()}
              >
                {t("recipe.DELETE_INGREDIENT_BUTTON_NAME")}
              </button>
            </div>
          )}
          <div className="col">
            <button
              type="button"
              className="btn btn-primary"
              onClick={this.saveClickedRecipe}
              disabled={disabled.saveBtn ? "disabled" : ""}
            >
              {isEditing
                ? "Update Recipe"
                : t("recipe.SAVE_RECIPE_BUTTON_NAME")}
            </button>
          </div>
          <div className="col">
            <button
              type="button"
              className="btn btn-primary"
              onClick={this.askClearRecipe}
              disabled={disabled.clearBtn ? "disabled" : ""}
            >
              {isEditing ? "New Recipe" : t("recipe.CLEAR_RECIPE_BUTTON_NAME")}
            </button>
          </div>
        </div>
        <br />
        <Prompt message={this.leave} />
      </div>
    );
  }
}

Recipe = translate("translations")(Recipe);

const mapStateToProps = state => ({
  ...state.recipe,
  formRecipeIngredient: state.form.formRecipeIngredient,
  formRecipe: state.form.formRecipe
});

const matchDispatchToProps = dispatch =>
  bindActionCreators({ ...recipeActions }, dispatch);

export default withRouter(
  connect(mapStateToProps, matchDispatchToProps)(Recipe)
);
