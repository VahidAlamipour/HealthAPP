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
        <Col xs="11" className="dateTime">
          {moment(data.updated_at).format("DD MMM YYYY, hh:mm A")}
        </Col>
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

class ForumSingle extends Component {
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
    if (this.props.match.params.postId) {
      this.props.forumSinglInitialization(this.props.match.params.postId);
    }
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
    const { isLoading, singlePostItem } = this.props;
    let title = "";
    if (singlePostItem) {
      title = `Post (ID# ${singlePostItem._id})`;
    }
    return (
      <div className="vPage mealPlannerPage flex">
        <Loading isLoading={isLoading} />
        <Row>
          <Col className="myForumTitle">
            <h3>{title}</h3>
          </Col>
        </Row>
        <div className="grayList forumGrid" style={{ flex: 1 }}>
          {singlePostItem && <ForumItem data={singlePostItem} />}
        </div>
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
        </Row>
      </div>
    );
  }
}
//#region exports

const mapStateToProps = state => ({
  ...state.forumReducer
});
ForumSingle = translate("translations")(ForumSingle);

const matchDispatchToProps = dispatch =>
  bindActionCreators({ ...forumActions }, dispatch);

export default connect(mapStateToProps, matchDispatchToProps)(ForumSingle);
