import _ from "lodash";
import {
  getFailed,
  getStarted,
  getSucceeded,
  getEnded,
  MEAL_PLAN_SUMMARY_INITIALIZATION,
  MEAL_PLAN_SUMMARY_CHANGE_DATE,
  EXTEND_MEAL_PLAN_SUMMARY,
  ON_DROP_PLAN_SUMMARY,
  MOVE_GRID_PLAN_SUMMARY,
  isLoading
} from "../actions/constant";
import moment from "moment";

const initialState = {
  isLoading: true,
  timeValue: moment(),
  grid: [],
  numOfColumn: 7,
  counterState: 0
};

function gridMaker(userPlan, time, num) {
  var grid = [];
  for (var i = 0; i < num; i++) {
    const thisTime = moment(time).add(i, "days");
    let thisData = [];
    if (userPlan && userPlan.length > 0) {
      thisData = userPlan.filter(filItem => {
        return (
          parseInt(moment(filItem.date).format("D")) ==
          parseInt(thisTime.format("D"))
        );
      });
    }
    if (thisData && thisData.length > 0) {
      thisData = thisData[0];
    } else {
      thisData = undefined;
    }

    grid.push({
      date: thisTime,
      nutrients: [],
      nutResult: [
        { name: "Calories", value: 0, unit: "Cal" },
        { name: "Cholesterol", value: 0, unit: "mg" },
        { name: "Protein", value: 0, unit: "g" },
        { name: "Sodium", value: 0, unit: "mg" }
      ],
      meals: [
        {
          title: "Breakfast",
          foods: thisData ? thisData.breakfast : []
        },
        {
          title: "Lunch",
          foods: thisData ? thisData.lunch : []
        },
        {
          title: "Dinner",
          foods: thisData ? thisData.dinner : []
        },
        {
          title: "Supper",
          foods: thisData ? thisData.supper : []
        },
        {
          title: "snack1",
          foods: thisData ? thisData.snack1 : []
        },
        {
          title: "snack2",
          foods: thisData ? thisData.snack2 : []
        },
        {
          title: "snack3",
          foods: thisData ? thisData.snack3 : []
        }
      ]
    });
  }

  //#region nutrient calculator
  grid.forEach(gridItem => {
    gridItem.meals.forEach(meal => {
      if (meal.foods && meal.foods.length > 0) {
        meal.foods.forEach(food => {
          if (food.nutrients) {
            gridItem.nutrients = [...gridItem.nutrients, ...food.nutrients];
          }
        });
      }
    });

    gridItem.nutResult.forEach(item => {
      gridItem.nutrients.forEach(nut => {
        if (item.name == nut.name) {
          item.value = item.value + nut.size;
        }
      });
    });
  });

  //endregion nutrient calculator
  return grid;
}

function reducer(state = initialState, action) {
  switch (action.type) {
    case getStarted(MEAL_PLAN_SUMMARY_INITIALIZATION):
    case getSucceeded(MEAL_PLAN_SUMMARY_INITIALIZATION):
      let userPlan = action.payload.data || [];
      let time = action.payload.now;
      return {
        ...state,
        grid: gridMaker(userPlan, time, action.payload.num),
        timeValue: time,
        numOfColumn: action.payload.num
      };
    case getFailed(MEAL_PLAN_SUMMARY_INITIALIZATION):
    case getEnded(MEAL_PLAN_SUMMARY_INITIALIZATION):
      return {
        ...state,
        isLoading: false
      };
    case getStarted(MEAL_PLAN_SUMMARY_CHANGE_DATE):
      return {
        ...state,
        isLoading: true
      };
    case getSucceeded(MEAL_PLAN_SUMMARY_CHANGE_DATE):
      state.timeValue = action.payload;
      return {
        ...state
      };
    case getFailed(MEAL_PLAN_SUMMARY_CHANGE_DATE):
    case getEnded(MEAL_PLAN_SUMMARY_CHANGE_DATE):
      return {
        ...state,
        isLoading: false
      };
    case getSucceeded(EXTEND_MEAL_PLAN_SUMMARY):
      const { date, meal } = action.payload;
      state.grid.forEach((item, i) => {
        if (item.date == date) {
          if (item.meals && item.meals.length > 0) {
            item.meals.forEach(mealItem => {
              if (mealItem.title == meal) {
                mealItem.unExtend = !mealItem.unExtend;
              }
            });
          }
        }
      });
      return { ...state, counterState: state.counterState + 1 };
    case getStarted(ON_DROP_PLAN_SUMMARY):
      return { ...state, isLoading: true };
    case getSucceeded(ON_DROP_PLAN_SUMMARY):
      var fromArray = action.payload.from.food.split("-");
      var dragedItem = {};
      state.grid.forEach((item, i) => {
        if (item.date.unix() * 1000 == fromArray[1]) {
          item.meals.forEach(mealItem => {
            if (mealItem.title == fromArray[2]) {
              var foodIndex = mealItem.foods.length;
              while (foodIndex--) {
                if (mealItem.foods[foodIndex]._id == fromArray[0]) {
                  dragedItem = mealItem.foods[foodIndex];
                  mealItem.foods.splice(foodIndex, 1);
                }
              }
            }
          });
        }
      });
      state.grid.forEach((item, i) => {
        if (item.date.unix() * 1000 == action.payload.toTime) {
          item.meals.forEach(mealItem => {
            console.log(mealItem.title == action.payload.toMeal);

            if (
              mealItem.title.toLowerCase() ==
              action.payload.toMeal.toLowerCase()
            ) {
              if (mealItem.foods) {
                mealItem.foods.push(dragedItem);
              } else {
                mealItem.foods = [dragedItem];
              }
            }
          });
        }
      });

      //#region nutrient calculator

      state.grid.forEach(gridItem => {
        //reset nutCalculate
        gridItem.nutrients = [];
        gridItem.nutResult = [
          { name: "Calories", value: 0, unit: "Cal" },
          { name: "Cholesterol", value: 0, unit: "mg" },
          { name: "Protein", value: 0, unit: "g" },
          { name: "Sodium", value: 0, unit: "mg" }
        ];
        //end
        gridItem.meals.forEach(meal => {
          if (meal.foods && meal.foods.length > 0) {
            meal.foods.forEach(food => {
              if (food.nutrients) {
                gridItem.nutrients = [...gridItem.nutrients, ...food.nutrients];
              }
            });
          }
        });

        gridItem.nutResult.forEach(item => {
          gridItem.nutrients.forEach(nut => {
            if (item.name == nut.name) {
              item.value = item.value + nut.size;
            }
          });
        });
      });

      //endregion nutrient calculator

      return { ...state };
    case getFailed(ON_DROP_PLAN_SUMMARY):
      alert("faild");
      return { ...state };
    case getEnded(ON_DROP_PLAN_SUMMARY):
      return { ...state, isLoading: false };
    case getStarted(MOVE_GRID_PLAN_SUMMARY):
      return { ...state, isLoading: true };
    case getSucceeded(MOVE_GRID_PLAN_SUMMARY):
      userPlan = action.payload.data;
      time = action.payload.time;
      // if (action.payload.type == "next") {
      //   state.grid.push(action.payload.plan);
      //   state.grid.shift();
      // } else {
      //   state.grid.unshift(action.payload.plan);
      //   state.grid.pop();
      // }
      return {
        ...state,
        grid: gridMaker(userPlan, time, state.numOfColumn),
        timeValue: time
      };
    case getFailed(MOVE_GRID_PLAN_SUMMARY):
      userPlan = undefined;
      time = action.payload.time;
      return {
        ...state,
        grid: gridMaker(userPlan, time, state.numOfColumn),
        timeValue: time
      };

      return { ...state, isLoading: true };
    case getEnded(MOVE_GRID_PLAN_SUMMARY):
      return { ...state, isLoading: false };
    default:
      return state;
  }
}

export default reducer;
