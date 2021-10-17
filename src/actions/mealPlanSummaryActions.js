import { getMeasurements, getCuisines } from "../services/LookupService";
import {
  getPlanByDate,
  dragAndDropService
} from "../services/MealPlannerService";
import { createActionThunk } from "redux-thunk-actions";
import {
  getFailed,
  getStarted,
  getSucceeded,
  getEnded,
  MEAL_PLAN_SUMMARY_INITIALIZATION,
  MEAL_PLAN_SUMMARY_CHANGE_DATE,
  EXTEND_MEAL_PLAN_SUMMARY,
  ON_DROP_PLAN_SUMMARY,
  MOVE_GRID_PLAN_SUMMARY
} from "./constant";
import { submit, reset } from "redux-form";
import moment from "moment";
import { rejects } from "assert";

const initialization = createActionThunk(
  MEAL_PLAN_SUMMARY_INITIALIZATION,
  async (num, startData) => {
    var now = moment(startData);
    now.set({
      hour: "00",
      minute: "00",
      second: "00"
    });
    let data = [];
    try {
      data = await getPlanByDate(now.unix() * 1000, num);
    } catch (e) {
    } finally {
      return { now, data, num };
    }
  }
);
const onChangeTime = createActionThunk(
  MOVE_GRID_PLAN_SUMMARY,
  async (time, num) => {
    let data = [];
    try {
      time.set({
        hour: "00",
        minute: "00",
        second: "00"
      });
      data = await getPlanByDate(time.unix() * 1000, num);
    } catch (e) {
      data = undefined;
    } finally {
      return { time, data };
    }
  }
);
const extendMeal = createActionThunk(
  EXTEND_MEAL_PLAN_SUMMARY,
  (date, meal) => ({ date, meal })
);
const onDrop = createActionThunk(
  ON_DROP_PLAN_SUMMARY,
  async (from, foodId, fromTime, fromMeal, toTime, toMeal) => {
    // let fromArray = from.food.split("-");
    // const foodId = fromArray[0];
    // const fromTime = fromArray[1];
    // const fromMeal = fromArray[2].toLowerCase();
    // toMeal = toMeal.toLowerCase();

    var result = await dragAndDropService(
      fromTime,
      fromMeal,
      foodId,
      toTime,
      toMeal
    );
    return { from, fromTime, fromMeal, foodId, toTime, toMeal };
  }
);
const moveGrid = createActionThunk(
  MOVE_GRID_PLAN_SUMMARY,
  async (status, time, num) => {
    let data = [];
    try {
      time.set({
        hour: "00",
        minute: "00",
        second: "00"
      });
      data = await getPlanByDate(time.unix() * 1000, num);
    } catch (e) {
      data = undefined;
    } finally {
      return { status, time, data };
    }
  }
);
export default {
  initialization,
  onChangeTime,
  extendMeal,
  onDrop,
  moveGrid
};
