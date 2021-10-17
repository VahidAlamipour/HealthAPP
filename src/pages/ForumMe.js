//#region imports
import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { isLoggedIn, getLoggedInUser } from "../services/AuthenticationService";

import { connect } from "react-redux";
import { translate } from "react-i18next";
import { InputText, Dropdown, Loading, Valert, Vmodal } from "../components";

import { Row, Col } from "reactstrap";
import forumActions from "../actions/forumActions";
import moment from "moment";
//#endregion
const ForumItem = ({ data, pageMode, askDeleteCaller, selectForEdit }) => {
  return (
    <div className="forumItem">
      <Row>
        <Col xs="9" className="dateTime">
          {moment(data.updated_at).format("DD MMM YYYY, hh:mm A")}
        </Col>
        {pageMode == "user" && (
          <Col xs="2" className="relevant">
            {/* <Row>
              <Col>
                <i className="fa fa-envelope defIcon"></i>
              </Col>
              <Col>
                <i className="fa fa-undo-alt defIcon" />
              </Col>
            </Row> */}
          </Col>
        )}
        {pageMode == "mine" && (
          <Col xs="2" className="relevant">
            <Row>
              <Col onClick={() => selectForEdit(data._id)}>
                {data.selected && <i className="fa fa-edit defIcon"></i>}
                {!data.selected && <i className="fa fa-pencil-alt defIcon"></i>}
              </Col>
              <Col>
                <i
                  className="fa fa-trash-alt defIcon"
                  onClick={() => askDeleteCaller(data._id)}
                ></i>
              </Col>
            </Row>
          </Col>
        )}
        <Col xs="1" className="vote yesVote">
          <i className="fa fa-check-circle" />
          <span>
            {data.relevant.up}/{data.relevant.up + data.relevant.down}
          </span>
        </Col>
      </Row>
      <p>{data.body}</p>
    </div>
  );
};

class ForumMe extends Component {
  constructor(props) {
    super(props);
    this.state = { textAreaPlaceHolder: "Please select a symptom" };
    this.askDeleteCaller = this.askDeleteCaller.bind(this);
  }
  componentDidMount() {
    if (!isLoggedIn()) {
      this.props.history.push("/");
      return;
    }
    this.linksToNewPostItems = window.linksToNewPostItems;
    window.linksToNewPostItems = undefined;
    this.loggedInUser = getLoggedInUser();
    this.pageMode = "mine";
    if (this.props.match.params.userId) {
      if (this.loggedInUser._id != this.props.match.params.userId) {
        this.loggedInUser._id = this.props.match.params.userId;
        this.pageMode = "user";
      }
    }

    this.props.forumMeInitialization(this.loggedInUser._id);
    this.inputPlaceHolderMaker = this.inputPlaceHolderMaker.bind(this);
  }
  inputPlaceHolderMaker() {
    if (
      this.props.forumFiltersForm.symptom &&
      this.props.forumFiltersForm.symptom != "null"
    ) {
      let result = "";
      if (this.props.symptomsList) {
        this.props.symptomsList.forEach(element => {
          if (element.value == this.props.forumFiltersForm.symptom) {
            result = `Share my experience about ${element.label}`;
          }
        });
      }
      return result;
    } else {
      return "Please select a symptom";
    }
  }
  askDeleteCaller(id) {
    this.deleteId = id;
    this.deleteValert.changeStatus();
  }
  render() {
    const {
      postsList,
      symptomsList,
      onChangeFilters,
      forumFiltersForm,
      saveSuccess,
      reGetPosts,
      isLoading,
      selectForEdit,
      editMode,
      EditForum
    } = this.props;
    if (saveSuccess) {
      reGetPosts(forumFiltersForm, this.loggedInUser._id);
    }
    var inputPlaceHolderMaker = this.inputPlaceHolderMaker();
    let userId = this.loggedInUser ? this.loggedInUser._id : "";
    let title = `My Posts (ID# ${userId})`;
    if (this.pageMode == "user") {
      title = `(ID# ${userId})'s posts`;
    }
    var inputDisabled = true;
    if (editMode) {
      inputDisabled = false;
    } else {
      inputDisabled =
        !forumFiltersForm.symptom ||
        this.props.forumFiltersForm.symptom == "null";
    }
    return (
      <div className="vPage mealPlannerPage flex">
        <Loading isLoading={isLoading} />
        <Valert
          display={false}
          title="Delete Confirmation"
          question="Are you sure you want to deletethis post?"
          onRef={ref => (this.deleteValert = ref)}
          positiveAction={() => {
            this.props.deleteItem(this.deleteId);
          }}
          positiveText="Yes"
          negativeText="Cancel"
        />
        <Row>
          <Col className="myForumTitle" sm="8">
            <h3>{title}</h3>
          </Col>
          <Col sm="4">
            <Dropdown
              name="symptpm"
              placeholder="All"
              options={symptomsList}
              meta={{}}
              input={{
                onChange: e =>
                  onChangeFilters(e, forumFiltersForm, this.loggedInUser._id),
                name: "symptom",
                value: forumFiltersForm.symptom
              }}
            />
          </Col>
        </Row>
        <div className="grayList forumGrid" style={{ flex: 1 }}>
          {postsList.data &&
            postsList.data.map((item, index) => {
              return (
                <ForumItem
                  data={item}
                  pageMode={this.pageMode}
                  askDeleteCaller={this.askDeleteCaller}
                  selectForEdit={selectForEdit}
                />
              );
            })}
        </div>
        {this.pageMode == "mine" && (
          <Row className="form-group">
            <Col>
              <InputText
                type="textarea"
                placeholder={inputPlaceHolderMaker}
                disabled={inputDisabled}
                input={{
                  onChange: e => onChangeFilters(e),
                  name: "body",
                  value: forumFiltersForm.body
                }}
                meta={{}}
              />
            </Col>
          </Row>
        )}
        <Row>
          <Col>
            <button
              className="btn btn-primary btnWide"
              onClick={() => this.props.history.push("/forum")}
            >
              {/* {this.props.t("forum.MY_POSTS_TITLE")} */}
              View Main
            </button>
          </Col>
          {this.pageMode == "mine" && (
            <Col>
              {!editMode && (
                <button
                  className="btn btn-primary btnWide"
                  disabled={
                    !forumFiltersForm.symptom ||
                    this.props.forumFiltersForm.symptom == "null" ||
                    !forumFiltersForm.body
                      ? "disabled"
                      : ""
                  }
                  onClick={() =>
                    this.props.insertForum(
                      forumFiltersForm,
                      this.linksToNewPostItems
                    )
                  }
                >
                  {/* {this.props.t("forum.ARCHIVE_TITLE")} */}
                  <span>Share</span>
                </button>
              )}
              {editMode && (
                <button
                  className="btn btn-primary btnWide"
                  disabled={!forumFiltersForm.body ? "disabled" : ""}
                  onClick={() => this.props.EditForum(forumFiltersForm)}
                >
                  {/* {this.props.t("forum.ARCHIVE_TITLE")} */}
                  {editMode && <span>Save</span>}
                </button>
              )}
            </Col>
          )}
        </Row>
      </div>
    );
  }
}
//#region exports

const mapStateToProps = state => ({
  ...state.forumReducer
});
ForumMe = translate("translations")(ForumMe);

const matchDispatchToProps = dispatch =>
  bindActionCreators({ ...forumActions }, dispatch);

export default connect(mapStateToProps, matchDispatchToProps)(ForumMe);
