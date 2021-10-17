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
  DateTimeField,
  VautoComplete
} from "../components";
import forumActions from "../actions/forumActions";
import { isLoggedIn } from "../services/AuthenticationService";

import { Prompt } from "react-router";

import { Row, Col, Form, FormGroup } from "reactstrap";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { AutoComplete } from "redux-form-material-ui";
import mealPlannerActions from "../actions/mealPlannerActions";
import "./styles/mealPlanner.css";
import moment from "moment";
//#endregion
const ForumItem = ({ data, removeSave }) => {
  return (
    <div className="forumItem">
      <Row>
        <Col xs="4" className="idLink">
          <a href={`/forum/${data.user_id}`}>{data.user_id}</a>
        </Col>
        <Col xs="6" className="dateTime">
          {moment(data.updated_at).format("DD MMM YYYY, hh:mm A")}
        </Col>
        <Col
          xs="1"
          className="vote saveVote"
          onClick={e => removeSave(data._id, true)}
        >
          <i className="fa fa-undo-alt" />
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

class ForumArchive extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    if (!isLoggedIn()) {
      this.props.history.push("/");
      return;
    }
    this.props.forumArchiveInitialization();
  }

  render() {
    const { postsList, removeSave } = this.props;
    return (
      <div className="vPage mealPlannerPage flex">
        <Loading isLoading={false} />
        <Row>
          <Col className="myForumTitle" sm="4">
            <h3>Archive</h3>
          </Col>
          {/* <Col>
            <Dropdown
              name="meals"
              placeholder={this.props.t("meal_planner.SELECT_MEAL_TEXT")}
              options={testD}
              meta={{}}
              input={{ onChange: () => {} }}
              onChange={() => {}}
            />
          </Col>
          <Col>
            <InputText
              name="comment"
              component={InputText}
              type="text"
              meta={{}}
              placeholder={this.props.t("products.COMMENT_DEFAULT_TEXT")}
              disabled={this.props.disabled.comment}
              input={{ onChange: e => this.props.onChangeForm(e) }}
            />
          </Col> */}
        </Row>
        <div className="grayList forumGrid" style={{ flex: 1 }}>
          {postsList &&
            Array.isArray(postsList) &&
            postsList.map((item, index) => {
              return <ForumItem data={item} removeSave={removeSave} />;
            })}
        </div>
        <Row>
          <Col>
            <button
              className="btn btn-primary btnWide"
              onClick={() => this.props.history.push("/forum")}
            >
              {this.props.t("forum.COMMUNITY_PAGE")}
            </button>
          </Col>
          <Col>
            <button
              className="btn btn-primary btnWide"
              onClick={() => this.props.history.push("/forum/me")}
            >
              {this.props.t("forum.MY_POSTS_TITLE")}
            </button>
          </Col>
        </Row>
      </div>
    );
  }
}
//#region exports
ForumArchive = translate("translations")(ForumArchive);

const mapStateToProps = state => ({
  ...state.forumReducer
});

const matchDispatchToProps = dispatch =>
  bindActionCreators({ ...forumActions }, dispatch);

export default connect(mapStateToProps, matchDispatchToProps)(ForumArchive);
