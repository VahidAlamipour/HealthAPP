import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import { Field, reduxForm } from "redux-form";
import { InputText, Dropdown, Loading, Valert } from "../components";
import { Row, Col, Button, Form, FormGroup, Alert } from "reactstrap";
import RecipeRatingStar from "../components/RecipeRatingStar";
import classNames from "classnames";
import _ from "lodash";

import {
  isLoadedFromMobile,
  getCurrentOrientation
} from "../services/MobileService";
import { Orientations } from "./PageConstants";

import recipeManagementActions from "../actions/recipeManagementActions";

import {
  REACT_STYLE_BUTTON_SIZE_DESKTOP,
  REACT_STYLE_BUTTON_SIZE_MOBILE
} from "./Constants";
import "./styles/recipeManagement.css";
import { isNull } from "util";
import { withRouter } from "react-router";

class RecipeManagementForm extends Component {
  constructor(props) {
    super(props);
    const { t } = this.props;
    this.rankOptions = [
      {
        value: "recipe",
        label: t("recipe_management.SORT_DROPDOWN_LABEL_NAME")
      },
      { value: "rank", label: t("recipe_management.SORT_DROPDOWN_LABEL_RANK") },
      {
        value: "rating",
        label: t("recipe_management.SORT_DROPDOWN_LABEL_RATE")
      },
      {
        value: "created",
        label: t("recipe_management.SORT_DROPDOWN_LABEL_DATE")
      }
    ];
    this.sortChange = this.sortChange.bind(this);
  }
  sortChange() {}
  render() {
    const { t } = this.props;
    return (
      <Form>
        <FormGroup row>
          <Col>
            <Field
              component={InputText}
              type="text"
              name="search"
              placeholder={t("recipe_management.SEARCH_FIELD_PLACEHOLDER")}
            />
            <a className={"search"}>
              <i className="fa fa-search" />
            </a>
          </Col>
          <Col>
            <Field
              name="sortBy"
              component={Dropdown}
              options={this.rankOptions}
              className="sortBy"
              placeholder={t("recipe_management.SORT_DROPDOWN_PLACEHOLDER")}
              onChange={this.sortChange}
            />
          </Col>
        </FormGroup>
      </Form>
    );
  }
}

RecipeManagementForm = reduxForm({
  form: "formRecipeManagement",
  onChange: (values, dispatch, props, previousValues) => {
    props.submit();
  },
  enableReinitialize: true,
  keepDirtyOnReinitialize: true
})(RecipeManagementForm);

RecipeManagementForm = connect(state => ({
  initialValues: state.recipeManagement.recipeManagementForm
}))(RecipeManagementForm);

class RecipeManagement extends Component {
  constructor(props) {
    super(props);

    this.ingredientTogglerClick.bind(this);
    this.state = {
      isDeleting: false,
      isEditing: false
    };

    this.deleteClicked = this.deleteClicked.bind(this);
    this.editClicked = this.editClicked.bind(this);
    this.rankClicked = this.rankClicked.bind(this);
    this.changeRank = this.changeRank.bind(this);
    this.NO_OP = this.NO_OP.bind(this);
  }

  componentDidMount() {
    this.props.initialization();
  }

  ingredientTogglerClick(id, isExpand, isDone) {
    this.props.ingredientToggle(id, isExpand, isDone);
  }

  recipeSelectToggle(id) {
    this.props.recipeSelectToggle(id);
  }

  componentWillReceiveProps(nextProps) {
    if (typeof nextProps.recipes !== "undefined") {
      let selected = 0;
      _.forEach(nextProps.recipes, recipe => {
        selected += recipe.isSelected ? 1 : 0;
      });

      this.setState({ isDeleting: selected > 0 });
      this.setState({ isEditing: selected === 1 });
    }
  }

  handleSubmit(values) {
    this.props.ingredientFilter(values.search, values.sortBy);
  }

  deleteClicked(e) {
    let confirmResponse = window.confirm(
      "Are you sure you want to delete the recipe?"
    );
    if (confirmResponse) {
      let ids = [];
      _.forEach(this.props.recipes, recipe => {
        if (recipe.isSelected) {
          ids.push(recipe._id);
          this.props.deleteRecipes(recipe._id);
        }
      });
      //this.props.deleteRecipes(ids);
    }
  }

  editClicked(e) {
    let id = 0;
    _.forEach(this.props.recipes, recipe => {
      if (recipe.isSelected) {
        id = recipe._id;
      }
    });
    localStorage.setItem("recipePageTitle", "Edit My Recipe");

    this.props.history.push("/recipe?id=" + id);
  }

  NO_OP(e) {}

  rankClicked(id, rank) {
    this.rankStack = { id: id, rank: rank };
    this.setState({ rankValue: rank });
    this.RankValert.changeStatus();
    this.rankValertSentence = `You have ${
      this.props.recipes.length
    } recipes on the list. Please enter a number between 1-${
      this.props.recipes.length
    } for this recipe `;
  }
  changeRank() {
    var rankUpdate = this.RankValert.getInputValue();
    rankUpdate =
      this.props.recipes.length < rankUpdate
        ? this.props.recipes.length
        : rankUpdate;
    const { id, rank } = this.rankStack;
    this.props.updateRank(id, rankUpdate, rank);
  }
  render() {
    const {
      isLoading,
      status,
      actionResponse,
      t,
      recipesAll,
      recipes
    } = this.props;

    const deleteClass = classNames("btn", "btn-primary", {
      disabled: !this.state.isDeleting
    });
    const editClass = classNames("btn", "btn-primary", {
      disabled: !this.state.isEditing
    });
    var _pageFitter, _btnFontSize;
    if (
      isLoadedFromMobile() ||
      getCurrentOrientation() === Orientations.PORTRAIT
    ) {
      _pageFitter = "page-fitter-mobile";
      _btnFontSize = REACT_STYLE_BUTTON_SIZE_MOBILE;
    } else {
      _pageFitter = "page-fitter";
      _btnFontSize = REACT_STYLE_BUTTON_SIZE_DESKTOP;
    }
    //page-wrapper-recipe-management
    return (
      <div>
        <div className="vPage">
          <Loading isLoading={isLoading} />
          <Valert
            display={false}
            question={"coming soon!"}
            onRef={ref => (this.MealPlanValert = ref)}
            readonly={true}
            positiveText="Ok"
          />
          <Valert
            display={false}
            title="Enter Rank"
            question={this.rankValertSentence}
            onRef={ref => (this.RankValert = ref)}
            positiveText="Ok"
            negativeText="Cancel"
            inputField={true}
            positiveAction={this.changeRank}
            inputValue={this.state.rankValue}
          />
          <RecipeManagementForm onSubmit={this.handleSubmit.bind(this)} t={t} />
          <div className="recipeList grayList">
            {recipes &&
              typeof recipes.map !== "undefined" &&
              recipes.map((recipe, i) => {
                const isExpand =
                  typeof recipe.isExpand !== "undefined"
                    ? recipe.isExpand
                    : false;
                const ingredientTogglerClass = classNames(
                  "fas",
                  { "fa-plus-circle fa-xs": !isExpand },
                  { "fa-minus-circle fa-xs": isExpand }
                );
                const ingredientListClass = classNames("ingredient-list1", {
                  expand: isExpand
                });

                return (
                  <ul className="recipe-item" key={i}>
                    <li className="wrapper">
                      <div
                        className="recipeItemTopSection"
                        onClick={this.recipeSelectToggle.bind(this, recipe._id)}
                      >
                        <div className="row recipe-item-title">
                          <div className="no">
                            {
                              recipe.rank
                              // (recipe.rank = localStorage.getItem(
                              //   "rank_" + recipe._id
                              // )
                              //   ? parseInt(
                              //       localStorage.getItem("rank_" + recipe._id)
                              //     )
                              //   : i + 1)
                            }
                          </div>
                          <div className="name">{recipe.recipe}</div>
                        </div>
                        <div className="checkmarkContainer">
                          <input
                            type="checkbox"
                            checked={recipe.isSelected ? "checked" : ""}
                          />
                          {recipe.isSelected}
                          <span class="checkmark" />
                        </div>
                      </div>

                      <div className="recipe-item-desc">
                        <div className="row recipe-item-rate">
                          <div className="expand">
                            <a
                              className="ingredient-toggle"
                              onClick={this.ingredientTogglerClick.bind(
                                this,
                                recipe._id,
                                isExpand,
                                recipe.isDone
                              )}
                            >
                              <i className={ingredientTogglerClass} />
                            </a>
                          </div>
                          <RecipeRatingStar
                            recipeId={recipe._id}
                            // rating={
                            //   !recipe.rating
                            //     ? (recipe.rating = localStorage.getItem(
                            //         "rating_" + recipe._id
                            //       )
                            //         ? localStorage.getItem(
                            //             "rating_" + recipe._id
                            //           )
                            //         : 0)
                            //     : recipe.rating
                            // }
                            rating={recipe.rate || 0}
                            updateRating={this.props.updateRating}
                          />
                          <div className="rank-link">
                            <a
                              onClick={this.rankClicked.bind(
                                this,
                                recipe._id,
                                recipe.rank
                              )}
                            >
                              {/*Rank*/ t(
                                "recipe_management.INGREDIENT_ITEM_RANK_LABEL"
                              )}
                            </a>
                          </div>
                          {/* <div className="checkbox">
                                                        
                                                    </div> */}
                        </div>
                        <div>
                          <ul className={ingredientListClass}>
                            {recipe.ingredients &&
                              recipe.ingredients.map((ingredient, j) => {
                                return (
                                  <li key={j} className="">
                                    {ingredient.size} {ingredient.symbol}{" "}
                                    {ingredient.recipe} {ingredient.brand}{" "}
                                    {ingredient.command}
                                  </li>
                                );
                              })}
                          </ul>
                          {recipe.ingredients && isExpand && (
                            <div className="manageRecipeItemDes">{`${
                              recipe.cuisine
                            }.  ${recipe.original_size} Serving. ${
                              recipe.comment ? recipe.comment : ""
                            }`}</div>
                          )}
                        </div>
                      </div>
                    </li>
                  </ul>
                );
              })}
          </div>

          <div className="row ops-section baseRow">
            <div className="col">
              <button
                className={deleteClass}
                type="button"
                onClick={this.deleteClicked}
                disabled={!this.state.isDeleting}
              >
                {/*Delete <i className="fas fa-trash-alt" />*/
                t("recipe_management.DELETE_RECIPE_BUTTON_NAME")}
              </button>
            </div>

            <div class="btn-spacer" />
            <div className="col">
              <button
                className={editClass}
                type="button"
                disabled={!this.state.isEditing}
                disabled={editClass.indexOf("disabled") >= 0 ? true : false}
                onClick={
                  editClass.indexOf("disabled") >= 0
                    ? this.NO_OP
                    : this.editClicked
                }
              >
                {/*Edit <i className="far fa-edit" />*/
                t("recipe_management.EDIT_RECIPE_BUTTON_NAME")}
              </button>
            </div>
            <div class="btn-spacer" />
            <div className="col">
              <button
                className="btn btn-primary"
                type="button"
                onClick={e => this.MealPlanValert.changeStatus()}
              >
                {/*Create Meal Plan <i className="far fa-file" />*/
                t("recipe_management.CREATE_MEAL_PLAN_BUTTON_NAME")}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

RecipeManagement = translate("translations")(RecipeManagement);

const mapStateToProps = state => ({
  ...state.recipeManagement,
  formRecipeManagement: state.form.formRecipeManagement
});

const matchDispatchToProps = dispatch =>
  bindActionCreators({ ...recipeManagementActions }, dispatch);

export default connect(
  mapStateToProps,
  matchDispatchToProps
)(RecipeManagement);
