//#region imports
import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import { Loading, Valert, VdateTimePicker } from "../components";
import { Row, Col, Button } from "reactstrap";
import mealPlanSummaryActions from "../actions/mealPlanSummaryActions";
import "./styles/mealPlanner.css";
import moment from "moment";
import { Draggable, Droppable } from "react-drag-and-drop";
//#endregion

class List extends React.Component {
  constructor() {
    super();
  }
  render() {
    const { grid, extendMeal, onDrop } = this.props;
    return (
      <ul className="mealPlanSummaryGrid">
        {grid &&
          grid.map((item, i) => {
            return (
              <li className="mealPlanSummaryItem">
                <a href={`/mealplanner/${item.date.format("Y-M-D")}`}>
                  <h5>{item.date.format("D dddd")}</h5>
                </a>
                {item.meals &&
                  item.meals.map((mealItem, mealI) => {
                    return (
                      <Droppable
                        types={["food"]}
                        onDrop={data => {
                          let fromArray = data.food.split("-");
                          const foodId = fromArray[0];
                          const fromTime = fromArray[1];
                          const fromMeal = fromArray[2].toLowerCase();
                          const toMeal = mealItem.title.toLowerCase();

                          let flag = true;
                          if (mealItem.foods && mealItem.foods.length > 0) {
                            mealItem.foods.forEach(element => {
                              if (element._id == foodId) {
                                flag = false;
                              }
                            });
                          }
                          if (flag) {
                            onDrop(
                              data,
                              foodId,
                              fromTime,
                              fromMeal,
                              item.date.unix() * 1000,
                              toMeal
                            );
                          } else {
                            //somethings
                            alert("you select the same item");
                          }
                        }}
                      >
                        <h3
                          className={
                            mealItem.foods && mealItem.foods.length > 0
                              ? ""
                              : "empty"
                          }
                        >
                          {mealItem.title}
                        </h3>
                        <div className="foodsContainer">
                          {mealItem.foods && mealItem.foods.length > 0 && (
                            <i
                              class={
                                mealItem.unExtend
                                  ? "fas fa-chevron-up"
                                  : "fas fa-chevron-down"
                              }
                              onClick={() =>
                                extendMeal(item.date, mealItem.title)
                              }
                            />
                          )}
                          {mealItem.foods &&
                            !mealItem.unExtend &&
                            //mealI < 3 &&
                            mealItem.foods.map((foodItem, foodI) => {
                              let name =
                                foodItem.recipe.length > 16
                                  ? `${foodItem.recipe.substr(0, 16)}...`
                                  : foodItem.recipe;
                              return (
                                <Draggable
                                  type="food"
                                  data={`${foodItem._id}-${item.date.unix() *
                                    1000}-${mealItem.title}`}
                                >
                                  <label>{name}</label>
                                </Draggable>
                              );
                            })}
                        </div>
                      </Droppable>
                    );
                  })}
                <footer>
                  <ul>
                    {item.nutResult.map(nut => {
                      return (
                        <li>
                          {nut.name}:{nut.value}
                          {nut.unit}
                        </li>
                      );
                    })}
                  </ul>
                </footer>
              </li>
            );
          })}
      </ul>
    );
  }
}

class MealPlanSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    const numOfColumn = Math.round((window.innerWidth * 7) / 1440);
    this.numOfColumn = numOfColumn;
    window.addEventListener("resize", () => window.location.reload());
    this.props.initialization(numOfColumn, this.props.match.params.date);
  }
  render() {
    const {
      timeValue,
      onChangeTime,
      grid,
      extendMeal,
      onDrop,
      moveGrid,
      isLoading
    } = this.props;
    var gridTitle = "";
    if (grid && grid.length > 0) {
      var startMonth = parseInt(grid[0].date.format("M"));
      var endMonth = parseInt(grid[grid.length - 1].date.format("M"));
      if (startMonth != endMonth) {
        gridTitle = `${grid[0].date.format("MMM")}/${grid[
          grid.length - 1
        ].date.format("MMM")} ${grid[0].date.format("YYYY")}`;
      } else {
        gridTitle = `${grid[0].date.format("MMMM")}  ${grid[0].date.format(
          "YYYY"
        )}`;
      }
    }
    return (
      <div className="vPage wide flex">
        <Loading isLoading={isLoading} />
        <div className="mealPlanSummaryContainer">
          <Row>
            <Col xs="12" lg="2">
              <div className="d-block dateTimeContainer">
                {/* <label className="d-block popper-left">
                  <DateTimeField
                    name="time"
                    placeholder={this.props.t("meal_plan_summary.TIME_TITLE")}
                    timeFormat={false}
                    closeOnSelect={true}
                    // onChange={val => {
                    //   var result = { target: {} };
                    //   result.target.value = moment(val);
                    //   result.target.name = "time";
                    //   //onChangeMealPlanner(result);
                    // }}
                    meta={{
                      valid: undefined,
                      touched: undefined,
                      error: undefined
                    }}
                    input={{
                      name: "time",
                      onChange: val => {
                        var result = moment(val);
                        onChangeTime(result, this.numOfColumn);
                      },
                      value: timeValue
                    }}
                  />
                  <span>
                    <i className="fa fa-calendar-alt" />
                  </span>
                </label> */}
                <VdateTimePicker
                  name="time"
                  placeholder={this.props.t("meal_plan_summary.TIME_TITLE")}
                  value={timeValue}
                  onChange={event => {
                    onChangeTime(event, this.numOfColumn);
                  }}
                  dateFormat="DD MMM YYYY"
                  timeDisable={true}
                  //disabled={this.props.disabled.time}
                />
                {/* <span>
                  <i className="fa fa-calendar-alt" />
                </span> */}
              </div>
            </Col>
            <Col xs="12" lg="8">
              <h2>{gridTitle}</h2>
            </Col>
            <Col xs="2" />
          </Row>
          <i
            class="fas fa-angle-left"
            onClick={() =>
              moveGrid(
                "previous",
                moment(timeValue).add(-1, "days"),
                this.numOfColumn
              )
            }
          />
          <i
            class="fas fa-angle-right"
            onClick={() =>
              moveGrid(
                "next",
                moment(timeValue).add(1, "days"),
                this.numOfColumn
              )
            }
          />
          <List grid={grid} extendMeal={extendMeal} onDrop={onDrop} />
        </div>
      </div>
    );
  }
}

//#region exports
MealPlanSummary = translate("translations")(MealPlanSummary);

const mapStateToProps = state => ({
  ...state.mealPlanSummary
});

const matchDispatchToProps = dispatch =>
  bindActionCreators({ ...mealPlanSummaryActions }, dispatch);

export default connect(
  mapStateToProps,
  matchDispatchToProps
)(MealPlanSummary);
//#endregion
