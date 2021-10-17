import _ from "lodash";
import {
  getFailed,
  getStarted,
  getSucceeded,
  getEnded,
  FORUM_INITIALIZATION,
  FORUM_INSERT,
  ON_CHANGE_FORUM_FILTERS,
  RE_GET_FORUM_FILTERS,
  FORUM_RELEVANT,
  FORUM_ON_CHANGE_STATE,
  FORUM_DELETE_POST,
  FORUM_SELECT_FOR_EDIT_POST,
  FORUM_DO_ARCHIVE,
  FORUM_REMOVE_ARCHIVE,
  FORUM_SINGLE_INITIALIZATION
} from "../actions/constant";
import moment from "moment";
const initialState = {
  symptomsList: [],
  postsList: [],
  sortByList: [
    { value: "relevancy", label: "Relevancy" },
    { value: "Most Recent", label: "Most Recent" }
  ],
  isLoading: true,
  disabled: {
    shareButton: true
  },
  forumFiltersForm: { symptom: "", sortBy: "" },
  saveSuccess: false,
  counterState: 0,
  firstChange: false,
  relevantFailed: false,
  editMode: false
};
function reducer(state = initialState, action) {
  switch (action.type) {
    case getStarted(FORUM_SINGLE_INITIALIZATION):
      return { ...state, isLoading: true };
    case getSucceeded(FORUM_SINGLE_INITIALIZATION):
      console.log("injaRed : ", action.payload);
      return {
        ...state,
        singlePostItem: action.payload
        // symptomsList: action.payload.symptomsList,
        // postsList: action.payload.data,
        // forumFiltersForm: {
        //   ...state.forumFiltersForm,
        //   symptom: action.payload.symptomId
        // }
      };
    case getFailed(FORUM_SINGLE_INITIALIZATION):
      return { ...state, saveFailed: true, isLoading: false };
    case getEnded(FORUM_SINGLE_INITIALIZATION):
      return { ...state, isLoading: false };
    case getStarted(FORUM_INITIALIZATION):
      return { ...state, isLoading: true };
    case getSucceeded(FORUM_INITIALIZATION):
      return {
        ...state,
        symptomsList: action.payload.symptomsList,
        postsList: action.payload.data,
        forumFiltersForm: {
          ...state.forumFiltersForm,
          symptom: action.payload.symptomId
        }
      };
    case getFailed(FORUM_INITIALIZATION):
      return { ...state, saveFailed: true };
    case getEnded(FORUM_INITIALIZATION):
      return { ...state, isLoading: false };
    case getStarted(FORUM_RELEVANT):
      return { ...state, isLoading: true };
    case getSucceeded(FORUM_INSERT):
      state.editMode = false;
      state.forumFiltersForm.body = "";

      return { ...state, saveSuccess: true };
    case getFailed(FORUM_INSERT):
      return { ...state, saveFailed: true };
    case getEnded(FORUM_INSERT):
      return { ...state, isLoading: false, saveSuccess: false };
    case ON_CHANGE_FORUM_FILTERS:
      state.forumFiltersForm[action.name] = action.value;
      if (action.name != "search" && action.name != "body") {
        state.postsList = action.data;
      }
      if (action.name != "body") {
        state.forumFiltersForm._id = "";
        state.forumFiltersForm.body = "";
        state.editMode = false;
      }
      return {
        ...state,
        counterState: state.counterState + 1
      };
    case RE_GET_FORUM_FILTERS:
      state.postsList = action.data;
      return {
        ...state,
        counterState: state.counterState + 1
      };
    case FORUM_SELECT_FOR_EDIT_POST:
      state.postsList.data.forEach(function(item) {
        if (action.typeOfSelect || action.typeOfSelect == "multiple") {
          if (item._id == action.postId) {
            item.selected = !item.selected;
          }
        } else {
          if (item._id == action.postId) {
            //item.selected = !item.selected;

            if (item.selected) {
              state.forumFiltersForm._id = "";
              state.forumFiltersForm.body = "";
              state.forumFiltersForm.updateSymptom = "";
              item.selected = false;
              state.editMode = false;
            } else {
              state.forumFiltersForm._id = item._id;
              state.forumFiltersForm.body = item.body;
              state.forumFiltersForm.updateSymptom = item.symptom;
              item.selected = true;
              state.editMode = true;
            }
          } else {
            item.selected = false;
          }
        }
      });
      return {
        ...state,
        counterState: state.counterState + 1
      };
    case getStarted(FORUM_RELEVANT):
      return { ...state, isLoading: true };
    case getSucceeded(FORUM_RELEVANT):
      state.postsList.data.forEach(item => {
        if (item._id == action.payload[0]._id) {
          item.relevant.up = action.payload[0].relevant.up;
          item.relevant.down = action.payload[0].relevant.down;
        }
      });
      return { ...state, saveSuccess: true };
    case getFailed(FORUM_RELEVANT):
      return {
        ...state,
        relevantFailed: true,
        counterState: state.counterState + 1
      };
    case getEnded(FORUM_RELEVANT):
      return { ...state, isLoading: false };
    case FORUM_REMOVE_ARCHIVE:
      let removeIndex;
      state.postsList.forEach(item => {
        if (item._id == action.postId) {
          removeIndex = item;
        }
      });
      if (removeIndex) {
        state.postsList.splice(removeIndex, 1);
      }
      return { ...state, counterState: state.counterState + 1 };
    case FORUM_ON_CHANGE_STATE:
      state[action.name] = action.value;
      return {
        ...state,
        counterState: state.counterState + 1
      };
    case getStarted(FORUM_DELETE_POST):
      return { ...state, isLoading: true };
    case getSucceeded(FORUM_DELETE_POST):
      let deleteIndex = undefined;
      state.postsList.data.forEach((item, i) => {
        if (item._id == action.payload._id) {
          deleteIndex = i;
        }
      });
      if (deleteIndex != undefined) state.postsList.data.splice(deleteIndex, 1);
      return { ...state };
    case getFailed(FORUM_DELETE_POST):
      return {
        ...state
      };
    case getEnded(FORUM_DELETE_POST):
      return {
        ...state,
        isLoading: false,
        counterState: state.counterState + 1
      };
    case getStarted(FORUM_DO_ARCHIVE):
      return { ...state, isLoading: true };
    case getSucceeded(FORUM_DO_ARCHIVE):
      state.postsList.data.forEach((item, i) => {
        item.selected = false;
      });
      return { ...state, doArchiveValertStatus: true };
    case getFailed(FORUM_DO_ARCHIVE):
      return {
        ...state
      };
    case getEnded(FORUM_DO_ARCHIVE):
      return {
        ...state,
        isLoading: false,
        counterState: state.counterState + 1
      };
    default:
      return state;
  }
}

export default reducer;
