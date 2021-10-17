//#region imports
import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { isLoggedIn } from "../services/AuthenticationService";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import { Input } from "reactstrap";

import {
  InputText,
  Dropdown,
  Loading,
  Valert,
  Vmodal,
  DateTimeField,
  VautoComplete
} from "../components";
import { Prompt } from "react-router";
import moment from "moment";

import { Row, Col, Form, FormGroup } from "reactstrap";
import forumActions from "../actions/forumActions";
//#endregion
const ForumItem = ({ data, likedAct, selectForEdit }) => {
  return (
    <div className="forumItem">
      <Row>
        <Col xs="1">
          <div
            className="checkmarkContainer"
            onClick={() => selectForEdit(data._id, "multiple")}
          >
            <input type="checkbox" checked={data.selected ? "checked" : ""} />
            <span class="checkmark" />
          </div>
        </Col>
        <Col xs="3" className="idLink">
          <a href={`/forum/${data.user_id}`}>{data.user_id}</a>
        </Col>
        <Col xs="4" className="dateTime">
          {moment(data.updated_at).format("DD MMM YYYY, hh:mm A")}
        </Col>
        <Col xs="2" className="relevant">
          Relevant?
        </Col>
        <Col
          xs="1"
          className="vote yesVote"
          onClick={e => likedAct(data._id, true)}
        >
          <i className="fa fa-check-circle" />
          <span>{data.relevant.up}</span>
        </Col>
        <Col
          xs="1"
          className="vote noVote"
          onClick={e => likedAct(data._id, false)}
        >
          <i className="fa fa-times-circle" />
          <span>{data.relevant.down}</span>
        </Col>
      </Row>
      <p>{data.body}</p>
      <div>
        {data.related &&
          data.related.map(item => {
            return (
              <a className="relatedPosts" href={`/forum/post/${item}`}>
                {item}
              </a>
            );
          })}
      </div>
    </div>
  );
};

class Forum extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    if (!isLoggedIn()) {
      this.props.history.push("/");
      return;
    }
    this.props.forumInitialization();
  }
  render() {
    var {
      symptomsList,
      sortByList,
      postsList,
      onChangeFilters,
      forumFiltersForm,
      likedAct,
      relevantFailed,
      changeReduxState,
      isLoading,
      selectForEdit,
      doArchive,
      t
    } = this.props;
    let selectedItems = [];
    if (postsList.data) {
      selectedItems = postsList.data.filter(item => {
        return item.selected;
      });
      selectedItems = selectedItems.map(item => item._id);
    }
    return (
      <div className="vPage mealPlannerPage flex">
        <Loading isLoading={isLoading} />
        <Valert
          display={relevantFailed}
          title={t("forum.RELEVANT_FAILED_TITLE")}
          question={t("forum.RELEVANT_FAILED_MESSAGE")}
          positiveAction={() => {
            setTimeout(() => {
              changeReduxState("relevantFailed", false);
            }, 200);
          }}
          positiveText="Ok"
          readonly={true}
        />
        <Valert
          display={this.props.doArchiveValertStatus}
          title={"Successful"}
          question={""}
          positiveAction={() => {
            setTimeout(() => {
              changeReduxState("doArchiveValertStatus", false);
            }, 200);
          }}
          positiveText="Ok"
          readonly={true}
        />
        <Row>
          <Col>
            <Dropdown
              name="symptom"
              placeholder={this.props.t("forum.SYMPTOMS_LIST_LABEL")}
              options={symptomsList}
              meta={{}}
              input={{
                onChange: e => onChangeFilters(e, forumFiltersForm),
                name: "symptom",
                value: forumFiltersForm.symptom
              }}
            />
          </Col>
          <Col>
            <Dropdown
              placeholder={this.props.t("forum.SORTBY_LABEL")}
              options={sortByList}
              meta={{}}
              input={{
                onChange: e => onChangeFilters(e, forumFiltersForm),
                name: "sortBy",
                value: forumFiltersForm.sortBy
              }}
            />
          </Col>
          <Col>
            <div className="inputWithIcon">
              <Input
                type="search"
                placeholder={this.props.t("forum.SEARCH_KEYWORD_LABEL")}
                onChange={e => onChangeFilters(e)}
                name="search"
                input={{
                  value: forumFiltersForm.search,
                  name: "search"
                }}
              />
              <i
                onClick={() =>
                  onChangeFilters(
                    { target: { name: "act", value: 1 } },
                    forumFiltersForm
                  )
                }
                className="fa fa-search"
              ></i>
            </div>

            {/* <InputText
              name="search"
              component={InputText}
              type="text"
              meta={{}}
              placeholder={this.props.t("forum.SEARCH_KEYWORD_LABEL")}
              disabled={this.props.disabled.comment}
              input={{
                onChange: e => onChangeFilters(e),
                name: "search",
                value: forumFiltersForm.search
              }}
            /> */}
          </Col>
        </Row>
        <div className="grayList forumGrid" style={{ flex: 1 }}>
          {postsList.data &&
            postsList.data.map((item, index) => {
              return (
                <ForumItem
                  data={item}
                  likedAct={likedAct}
                  selectForEdit={selectForEdit}
                />
              );
            })}
        </div>
        <Row>
          <Col>
            <button
              className="btn btn-primary btnWide"
              onClick={() => {
                window.linksToNewPostItems = selectedItems;
                this.props.history.push("/forum/me");
              }}
            >
              Create Post
              {selectedItems.length > 0 && <span> with Link</span>}
            </button>
          </Col>
          <Col>
            <button
              disabled={selectedItems.length <= 0}
              className="btn btn-primary btnWide"
              onClick={() => {
                doArchive(selectedItems);
              }}
            >
              {this.props.t("forum.ARCHIVE_TITLE")}
            </button>
          </Col>
        </Row>
      </div>
    );
  }
}
//#region exports

const mapStateToProps = state => ({
  ...state.forumReducer
});
Forum = translate("translations")(Forum);

const matchDispatchToProps = dispatch =>
  bindActionCreators({ ...forumActions }, dispatch);

export default connect(mapStateToProps, matchDispatchToProps)(Forum);
