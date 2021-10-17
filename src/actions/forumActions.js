//import { getMeasurements, getCuisines } from "../services/LookupService";
import {
  shareForum,
  getList,
  likedActService,
  deletePostService,
  editForum,
  doArchiveService,
  getArchiveList,
  removeSaveService,
  singlePostGet
} from "../services/ForumService";
import { createActionThunk } from "redux-thunk-actions";
import {
  getFailed,
  getStarted,
  getSucceeded,
  getEnded,
  MEAL_PLANNER_INITIALIZATION,
  FORUM_INSERT,
  FORUM_INITIALIZATION,
  FORUM_SINGLE_INITIALIZATION,
  ON_CHANGE_FORUM_FILTERS,
  RE_GET_FORUM_FILTERS,
  FORUM_RELEVANT,
  FORUM_ON_CHANGE_STATE,
  FORUM_DELETE_POST,
  FORUM_SELECT_FOR_EDIT_POST,
  FORUM_DO_ARCHIVE,
  FORUM_REMOVE_ARCHIVE
} from "./constant";
import moment from "moment";
import { getdetailStocks } from "../services/StockService";
const forumInitialization = createActionThunk(
  FORUM_INITIALIZATION,
  async () => {
    let stocks = await getdetailStocks();
    let symptomsList = stocks.usersymptomforum.map((item, index) => {
      return { value: item._id, label: item.name };
    });
    let data = await getList(symptomsList[0].value);
    return { symptomsList, data, symptomId: symptomsList[0].value };
  }
);
const forumMeInitialization = createActionThunk(
  FORUM_INITIALIZATION,
  async userId => {
    let stocks = await getdetailStocks();
    let symptomsList = stocks.usersymptomforum.map((item, index) => {
      return { value: item._id, label: item.name };
    });
    let data = await getList("", "", "", userId);
    return { symptomsList, data, symptomId: "" };
  }
);
const forumArchiveInitialization = createActionThunk(
  FORUM_INITIALIZATION,
  async userId => {
    let data = await getArchiveList();
    return { data };
  }
);

const insertForum = createActionThunk(
  FORUM_INSERT,
  (inputs, linksToNewPostItems) => shareForum(inputs, linksToNewPostItems)
);

const onChangeFilters = (eventIn, filters, userId = undefined) => {
  return async dispatch => {
    var name = eventIn.target.name;
    var value = eventIn.target.value;
    let data = null;
    if (name != "search" && name != "body") {
      filters[name] = value;
      data = await getList(
        filters.symptom,
        filters.sortBy,
        filters.search,
        userId
      );
    }
    dispatch({
      type: ON_CHANGE_FORUM_FILTERS,
      name,
      value,
      data
    });
  };
};
const reGetPosts = (filters, userId) => {
  return async dispatch => {
    let data = null;
    data = await getList(filters.symptom, filters.sortBy, undefined, userId);
    dispatch({
      type: RE_GET_FORUM_FILTERS,
      data
    });
  };
};
const likedAct = createActionThunk(FORUM_RELEVANT, (postId, flag) =>
  likedActService(postId, flag)
);
const removeSave = postId => {
  return async dispatch => {
    await removeSaveService(postId);
    dispatch({
      type: FORUM_REMOVE_ARCHIVE,
      postId
    });
  };
};
const changeReduxState = (name, value) => {
  return dispatch => {
    dispatch({
      type: FORUM_ON_CHANGE_STATE,
      name,
      value
    });
  };
};
const deleteItem = createActionThunk(FORUM_DELETE_POST, postId =>
  deletePostService(postId)
);
const selectForEdit = (postId, typeOfSelect) => {
  return async dispatch => {
    dispatch({
      type: FORUM_SELECT_FOR_EDIT_POST,
      postId,
      typeOfSelect
    });
  };
};
const doArchive = createActionThunk(FORUM_DO_ARCHIVE, data =>
  doArchiveService(data)
);
const EditForum = createActionThunk(FORUM_INSERT, inputs => editForum(inputs));
const forumSinglInitialization = createActionThunk(
  FORUM_SINGLE_INITIALIZATION,
  postId => singlePostGet(postId)
);
export default {
  forumSinglInitialization,
  removeSave,
  forumInitialization,
  forumMeInitialization,
  forumArchiveInitialization,
  insertForum,
  onChangeFilters,
  likedAct,
  changeReduxState,
  deleteItem,
  reGetPosts,
  selectForEdit,
  EditForum,
  doArchive
};
