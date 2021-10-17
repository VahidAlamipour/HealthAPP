//#region imports
import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import { Field, reduxForm, submit } from "redux-form";
import {
  InputText,
  Dropdown,
  Loading,
  Valert,
  Vmodal,
  //DateTimeField,
  VautoComplete,
  VdateTimePicker
} from "../components";
import { Prompt } from "react-router";

import { Row, Col, Form, FormGroup } from "reactstrap";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { AutoComplete } from "redux-form-material-ui";
import mealPlannerActions from "../actions/mealPlannerActions";
import "./styles/mealPlanner.css";
import moment from "moment";
//#endregion
class MealPlannerForm extends Component {
  constructor(props) {
    super(props);
    this.selectIngredientOptions = this.selectIngredientOptions.bind(this);
  }
  selectIngredientOptions(e) {
    this.props.onChangeMealPlanner({
      target: { value: e, name: "addMealPlan" }
    });
    // var resultVal = encodeURI;
    // // this.props.typeAheadSearchObjects.forEach(element => {
    // //   if (e.toLowerCase().trim() == element.recipe.toLowerCase().trim()) {
    // //     resultVal = element;
    // //   }
    // // });
    // if (resultVal) {
    //   this.props.change("_id", resultVal._id);
    //   this.props.change("newMeal", resultVal.fullName);
    //   this.props.onChangeMealPlanner({
    //     target: { value: resultVal, name: "addMealPlan" }
    //   });
    // } else {
    //   this.props.change("_id", undefined);
    // }
  }
  vFilter(mealListAll, meal) {
    let result = [];
    mealListAll.forEach(element => {
      if (element.meal.toLowerCase() == meal) {
        result.push(element);
      }
    });
    return result;
  }
  render() {
    const {
      disabled,
      mealList,
      dropDownList,
      onChangeMealPlanner,
      typeAheadSearchOptions,
      addFood,
      mealPlannerForm,
      mealItemOnClick,
      deleteItem,
      deletAlertChangeStatus,
      ingredientsModalHandler
    } = this.props;

    let body = [];
    if (mealList && mealList.length > 0) {
      body = [
        { meal: "breakfast", mealList: this.vFilter(mealList, "breakfast") },
        { meal: "lunch", mealList: this.vFilter(mealList, "lunch") },
        { meal: "dinner", mealList: this.vFilter(mealList, "dinner") },
        { meal: "supper", mealList: this.vFilter(mealList, "supper") },
        { meal: "snack1", mealList: this.vFilter(mealList, "snack1") },
        { meal: "snack2", mealList: this.vFilter(mealList, "snack2") },
        { meal: "snack3", mealList: this.vFilter(mealList, "snack3") }
      ];
    }

    return (
      <Form>
        <FormGroup row>
          <Col>
            <VdateTimePicker
              name="time"
              placeholder={this.props.t("meal_planner.DATE_TEXT")}
              value={mealPlannerForm.time}
              onChange={val => {
                var result = { target: {} };
                result.target.value = val;
                result.target.name = "time";
                if (
                  !mealPlannerForm.time ||
                  result.target.value.unix() != mealPlannerForm.time.unix()
                ) {
                  onChangeMealPlanner(result);
                }
              }}
              dateFormat="DD MMM YYYY, hh:mm A"
              //disabled={this.props.disabled.time}
            />
            {/* <div className="d-block dateTimeContainer">
              <label className="d-block popper-left">
                <Field
                  name="time"
                  placeholder={this.props.t("meal_planner.DATE_TEXT")}
                  component={DateTimeField}
                  timeFormat={false}
                  closeOnSelect={true}
                  onChange={val => {
                    var result = { target: {} };
                    result.target.value = moment(val);
                    result.target.name = "time";
                    if (
                      !mealPlannerForm.time ||
                      result.target.value.unix() != mealPlannerForm.time.unix()
                    ) {
                      onChangeMealPlanner(result);
                    }
                  }}
                />
                <span>
                  <i className="fa fa-calendar-alt" />
                </span>
              </label>
            </div> */}
          </Col>
          <Col>
            <Field
              name="meals"
              component={Dropdown}
              placeholder={this.props.t("meal_planner.SELECT_MEAL_TEXT")}
              options={dropDownList}
              onChange={onChangeMealPlanner}
            />
          </Col>
        </FormGroup>
        <div className={`grayList ingredient-list`}>
          {!body ||
            (body.length === 0 && (
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
          {body &&
            body.map(mealItem => {
              if (mealItem.mealList && mealItem.mealList.length > 0)
                return (
                  <div>
                    <h3>{mealItem.meal}</h3>
                    {mealItem.mealList.map((item, i) => {
                      let desc = `${item.food.recipe}`;
                      return (
                        <div key={i} className="usersItem">
                          <div
                            onClick={() => mealItemOnClick(item.food._id)}
                            className="wrapper mealPlannerGridItem"
                          >
                            <span className="desc">{desc}</span>
                            {item.isSelected && <i className="fas fa-check" />}
                            {item.food.ingredients && (
                              <i
                                className="fas fa-info"
                                onClick={e => {
                                  e.stopPropagation();
                                  ingredientsModalHandler(
                                    item.food.recipe,
                                    item.food.ingredients
                                  );
                                }}
                              />
                            )}
                            <i
                              className="fas fa-trash deleteIcon"
                              onClick={e => {
                                e.stopPropagation();
                                deletAlertChangeStatus(item.food._id);
                                //deleteItem(item.food._id);
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
            })}
        </div>
        <FormGroup row>
          <Field component={InputText} type="hidden" name="_id" />

          <Col xs="10" className="border-col">
            <Field
              name="name"
              component={VautoComplete}
              disabled={disabled.newMeal}
              placeholder={`${this.props.t("meal_planner.ITEM_NAME_TEXT")}${
                disabled.newMeal ? " (please select a meal)" : ""
              }`}
              onChangeText={val => {
                this.props.change("_id", "");
                onChangeMealPlanner({
                  target: { value: val, name: "newMeal" }
                });
              }}
              onSelect={this.selectIngredientOptions}
              val={mealPlannerForm.newMeal}
              category="02"
              level="111111"
            />
            {/* <Field
              name="newMeal"
              className={`item-input-text ${
                disabled.newMeal ? "disabled" : ""
              }`}
              component={AutoComplete}
              hintText={this.props.t("meal_planner.ITEM_NAME_TEXT")}
              openOnFocus
              fullWidth={true}
              listStyle={{ maxHeight: 200, overflow: "auto" }}
              onKeyUp={e => {
                e.target.name = "newMeal";
                this.props.change("_id", "");
                //this.props.change("newMeal", e.target.value);
                onChangeMealPlanner({
                  target: { value: e.target.value, name: e.target.name }
                });
              }}
              //value={mealPlannerForm.newMeal}
              filter={(searchText, key) => true}
              dataSource={typeAheadSearchOptions}
              underlineStyle={{ display: "none" }}
              onNewRequest={this.selectIngredientOptions}
              disabled={disabled.newMeal}
              maxlength="63"
            /> */}
          </Col>
          <Col xs="2">
            <button
              type="button"
              className="btn btn-primary btnWide editInputSearchBtn"
              disabled={disabled.addBtn}
              onClick={() => addFood()}
            >
              Add
            </button>
          </Col>
        </FormGroup>
      </Form>
    );
  }
}
class MealPlanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDuplicateError: false,
      ingredientsVmodal: false,
      ingredientsVmodalData: []
    };
    this.deletAlertChangeStatus = this.deletAlertChangeStatus.bind(this);
    this.addFood = this.addFood.bind(this);
    this.ingredientsModalHandler = this.ingredientsModalHandler.bind(this);
  }
  componentDidMount() {
    this.props.initialization(this.props.match.params.date);
  }
  // componentWillUnmount() {
  //   if (this.props.firstChange) {
  //     alert("hey bro you will lose");
  //   }
  // }
  deletAlertChangeStatus(id) {
    this.deletedId = id;
    this.removeItemValert.changeStatus();
  }
  addFood() {
    let flag = true;
    this.props.mealListShow.forEach(item => {
      if (item.food.recipe == this.props.mealPlannerForm.addMealPlan.recipe) {
        flag = false;
      }
    });
    if (flag) {
      this.props.addFood();
    } else {
      this.setState({ showDuplicateError: true });
    }
  }
  ingredientsModalHandler(title, ingredients) {
    let returnHTml = (
      <div className="ingredientsAreaInMealPlanner">
        <h4>Ingredients of {title}</h4>
        <ul>
          {ingredients.map(item => {
            return <li>{item.recipe}</li>;
          })}
        </ul>
      </div>
    );

    this.setState({
      ingredientsVmodal: true,
      ingredientsVmodalData: returnHTml
    });
  }
  leave = location => {
    if (this.props.firstChange)
      return "Unsaved info will be lost. Are you sure to leave?";
  };
  render() {
    const {
      isLoading,
      mealListShow,
      nutritionsList,
      t,
      dropDownList,
      updateMode,
      disabled,
      onChangeMealPlanner,
      typeAheadSearchOptions,
      typeAheadSearchObjects,
      mealPlannerForm,
      mealItemOnClick,
      counterState,
      deleteItem,
      savePage,
      mealListAll,
      replaceValertShowStatus,
      listCombine,
      planId
    } = this.props;
    return (
      <div className="vPage mealPlannerPage flex">
        <Loading isLoading={isLoading} />
        <Vmodal
          displayStatus={this.props.saveSuccess}
          data={
            <div>
              <h4>{t("meal_planner.SAVE_SUCCESSFULLY_TITLE")}</h4>
              <p>{t("meal_planner.SAVE_SUCCESSFULLY_TEXT")}</p>
            </div>
          }
        />
        <Vmodal
          displayStatus={this.props.saveFailed}
          data={
            <div>
              <h4>{t("meal_planner.SAVE_UNSUCCESSFULLY_TITLE")}</h4>
              <p>{t("meal_planner.SAVE_UNSUCCESSFULLY_TEXT")}</p>
            </div>
          }
          closeFunc={this.props.toggleUnsaveMessage}
        />
        <Vmodal
          displayStatus={this.state.ingredientsVmodal}
          data={this.state.ingredientsVmodalData}
          closeFunc={() => {
            this.setState({
              ingredientsVmodal: false,
              ingredientsVmodalData: ""
            });
          }}
        />
        <Valert
          display={false}
          onRef={ref => (this.removeItemValert = ref)}
          title={t("meal_planner.DELETE_ITEM_TITLE")}
          question={t("meal_planner.DELETE_PROMPT_TEXT")}
          positiveAction={() => {
            deleteItem(this.deletedId);
          }}
          positiveText="Yes"
          negativeText="Cancel"
        />
        <Valert
          display={this.state.showDuplicateError}
          //onRef={ref => (this.warningDuplicateItemValert = ref)}
          title={t("meal_planner.DUPLICATE_ENTRY_TITLE")}
          question={t("meal_planner.DUPLICATE_ENTRY_ERROR_TEXT")}
          positiveAction={() => {
            this.setState({ showDuplicateError: false });
          }}
          positiveText="Ok"
          readonly={true}
        />
        <Valert
          display={replaceValertShowStatus}
          //onRef={ref => (this.removeItemValert = ref)}
          title="Warning!"
          question="Do you want to combine or replace?"
          positiveAction={() => {
            listCombine("combine");
          }}
          positiveText="Combine"
          negativeText="Replace"
          negativeAction={() => {
            listCombine("replace");
          }}
          disableAutoClose={true}
          thirdActionText="Cancel"
          ThirdAction={() => {
            listCombine("cancel");
          }}
        />
        <MuiThemeProvider>
          <MealPlannerForm
            t={t}
            mealList={mealListShow}
            dropDownList={dropDownList}
            onChangeMealPlanner={onChangeMealPlanner}
            disabled={disabled}
            typeAheadSearchOptions={typeAheadSearchOptions}
            typeAheadSearchObjects={typeAheadSearchObjects}
            addFood={this.addFood}
            mealPlannerForm={mealPlannerForm}
            mealItemOnClick={mealItemOnClick}
            counterState={counterState}
            deleteItem={deleteItem}
            deletAlertChangeStatus={this.deletAlertChangeStatus}
            ingredientsModalHandler={this.ingredientsModalHandler}
          />
        </MuiThemeProvider>
        <h5 className="nutritionsListTitle">
          Nutrients per serving of checked item(s):
        </h5>
        <div
          className={`grayList ingredient-list`}
          style={{ flex: 1 }}
          ref="ingredients_container"
        >
          {nutritionsList &&
            nutritionsList.map((item, i) => {
              let titleClass = item.bold
                ? "nutritionsItemTitle special"
                : "nutritionsItemTitle";
              let pointerClass = item.bold
                ? "nutritionsItemAmount special"
                : "nutritionsItemAmount";
              if (item.ind == 1) {
                titleClass += " subNut";
              }
              let desc = `${item.name}`;
              return (
                <div className="nutritionsItem" key={i}>
                  <div className={titleClass}>{desc}</div>
                  <div className={pointerClass}>
                    {item.sum || 0}
                    {item.sum > 0 ? item.symbol : ""}
                  </div>
                  <div className="percentageContainerArea">
                    <div className="percentageContainer">
                      <div
                        className={`percentagePointer ${
                          i < 8 ? "special" : ""
                        }`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="nutritionsItemPercentage">
                    {item.percentage}%
                  </div>
                </div>
              );
            })}
        </div>
        <div className="row ">
          <div className="col">
            <button
              className="btn btn-primary btnWide"
              //href="/mealplansummary"
              onClick={() => this.props.history.push("/mealplansummary")}
              //disabled={disabled.saveBtn ? "disabled" : ""}
            >
              {"Meal Plan Summay"}
            </button>
          </div>
          {!updateMode && (
            <div className="col">
              <button
                type="button"
                className="btn btn-primary btnWide"
                onClick={() =>
                  savePage(mealPlannerForm.time, mealListAll, undefined)
                }
                disabled={disabled.savePageBtn}
              >
                {t("meal_plan_summary.SAVE_BUTTON")}
              </button>
            </div>
          )}
          {updateMode && (
            <div className="col">
              <button
                type="button"
                className="btn btn-primary btnWide"
                disabled={disabled.updatePageBtn}
                onClick={() =>
                  savePage(mealPlannerForm.time, mealListAll, planId)
                }
              >
                {t("meal_plan_summary.UPDATE_BUTTON")}
              </button>
            </div>
          )}
        </div>
        <Prompt message={this.leave} />
      </div>
    );
  }
}
//#region exports

MealPlannerForm = reduxForm({
  form: "formMealPlanner",
  enableReinitialize: true
})(MealPlannerForm);

MealPlannerForm = connect(state => ({
  initialValues: state.mealPlanner.mealPlannerForm
}))(MealPlannerForm);
MealPlanner = translate("translations")(MealPlanner);

const mapStateToProps = state => ({
  ...state.mealPlanner
});

const matchDispatchToProps = dispatch =>
  bindActionCreators({ ...mealPlannerActions }, dispatch);

export default connect(mapStateToProps, matchDispatchToProps)(MealPlanner);
//#endregion
