/**
 * This is the Page for the Symptoms Managament
 * where user can view their current shown symptoms
 */
import React, { Component } from "react";
import { isLoggedIn } from "../services/AuthenticationService";
import { Row, Col } from "reactstrap";
import { translate } from "react-i18next";
import Loading from "../components/Loading";
import "./styles/dashboard.css";
import {
  SortableContainer,
  SortableElement,
  SortableHandle
} from "react-sortable-hoc";
import { bindActionCreators } from "redux";
import stockManagementActions from "../actions/stockManagementActions";
import connect from "react-redux/es/connect/connect";
import { Link } from "react-router-dom";
import { darkBaseTheme } from "material-ui/styles";

const DragHandle = SortableHandle(e => {
  return (
    <span className="handler">
      <i className="fa fa-hand-rock" />
    </span>
  );
}); // This can be any component you want

//#region Deletable Items
const SortableItem = SortableElement(props => {
  let value = props.value;
  return (
    <li class="list-group-item">
      <span className="list-group-item_counter">
        {props.visibility ? props.sortIndex + "." : ""}
      </span>

      {value.symptom}
      <DragHandle {...props} />
    </li>
  );
});
const SortableSeprator = SortableElement(props => {
  let value = props.value;
  return (
    <li class="list-group-title">
      <h5>{value.title}</h5>
    </li>
  );
});
const SortableList = SortableContainer(props => {
  let items = props.items;
  // const visibleList = items.filter(item => {
  //   return item.visibility;
  // });
  // const invisibleList = items.filter(item => {
  //   return !item.visibility;
  // });
  var visibility = true;
  return (
    <ul className="list-group">
      {items.map((value, index) => {
        if (value.type && value.type == "seprator") {
          visibility = false;
          return (
            <SortableSeprator
              key={`item-${value.order}`}
              index={value.order}
              sortIndex={index}
              value={value}
            />
          );
        } else {
          return (
            <SortableItem
              key={`item-${value.order}`}
              index={value.order}
              sortIndex={index + 1}
              value={value}
              deleteStock={props.deleteStock}
              visibility={visibility}
            />
          );
        }
      })}
    </ul>
  );
});
//#endregion Deletable Items

//#region Addable Item
const UnsortableItem = SortableElement(props => {
  let value = props.value;
  this.add = e => {
    props.addStock(value._id);
  };
  return (
    <li class="list-group-item" onClick={this.add}>
      {value.name}
    </li>
  );
});
const UnsortableList = SortableContainer(props => {
  let items = props.items;

  return (
    <ul class="list-group">
      {items.map(
        (value, index) =>
          !value.visibility && (
            <UnsortableItem
              key={`item-${index}`}
              index={index}
              value={value}
              addStock={props.addStock}
            />
          )
      )}
    </ul>
  );
});
//#endregion Addable Item
class StockManagement extends Component {
  constructor(props) {
    super(props);
    this.state = { isInitialView: true };
    this.deleteStock = this.deleteStock.bind(this);
    this.addStock = this.addStock.bind(this);
    this.onToggleView = this.onToggleView.bind(this);
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.props.swipeStocks(oldIndex, newIndex);
  };

  componentDidMount() {
    if (!isLoggedIn()) {
      this.props.history.push("/");
      return;
    }
    window.scroll(0, 0);
    var data = localStorage.getItem("Dashboard_User_Selected");
    data = JSON.parse(data);
    // var baseUser = localStorage.getItem('user');
    // let user = JSON.parse(baseUser);
    this.props.getStocks(data);
  }
  componentWillUpdate(newProps, newState) {
    if (newProps.redirectStatus) {
      this.props.history.push("/dashboard");
    }
  }
  componentWillUnmount() {
    this.props.resetPage();
  }

  deleteStock = _id => {
    if (!window.confirm("Are you sure you want to delete symptom?"))
      return false;
    this.props.deleteStock(_id);
  };

  addStock = _id => {
    if (!window.confirm("Are you sure you want to add symptom?")) return false;
    this.props.addStock(_id);
    this.props.getStocks();
  };

  onToggleView() {
    try {
      console.log(
        "Dashboard::onToggleView(), this.state.isInitialView:" +
          this.state.isInitialView
      );
      this.props.getStocks();
      this.setState({ isInitialView: !this.state.isInitialView });
    } catch (err) {
      console.log("Dashboard::onToggleView(), ERROR:" + err);
    }
  }

  render() {
    const { t, currentUser } = this.props;
    const first_name = currentUser
      ? currentUser.first_name + " " + currentUser.last_name
      : "";
    var _initialViewComponent = (
      <div className="black-container">
        <Loading isLoading={this.props.isLoading} />
        <div className="stock">
          <div className="topbar">
            {/* <i className="fa fa-plus" onClick={this.onToggleView} /> */}
            <span style={{ paddingLeft: "8px", fontWeight: "bold" }}>
              {/* {t("stocks.symptoms")}  */}
              {first_name}
            </span>
            <div>
              <Link
                className="btn btn-primary"
                style={{ marginRight: "5px" }}
                to="/dashboard"
              >
                {t("stocks.cancel")}
              </Link>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() =>
                  this.props.pressDone(
                    this.props.stocks,
                    this.props.currentUser
                  )
                }
                disabled={this.props.btnDoneDisabled}
              >
                {t("stocks.done")}
              </button>
            </div>
          </div>
          <div class="list-group-title">
            <h5>Symptom Displayed in Symptom Watchlist</h5>
          </div>
          <SortableList
            items={this.props.stocks}
            redLine={this.props.redLine}
            onSortEnd={this.onSortEnd}
            useDragHandle={true}
            deleteStock={this.deleteStock}
          />
        </div>
      </div>
    );

    var _otherViewComponent = (
      <div className="black-container">
        <div className="stock">
          <div className="topbar">
            <span />
            <span />
            <span style={{ color: "blue" }} onClick={this.onToggleView}>
              {t("stocks.cancel")}
            </span>
          </div>
          <UnsortableList
            items={this.props.stocks}
            onSortEnd={this.onSortEnd}
            useDragHandle={true}
            addStock={this.addStock}
          />
        </div>
      </div>
    );

    if (this.state.isInitialView) {
      return _initialViewComponent;
    } else {
      return _otherViewComponent;
    }
  }
}

StockManagement = translate("translations")(StockManagement);

const mapStateToProps = state => ({ ...state.stockManagement });

const matchDispatchToProps = dispatch =>
  bindActionCreators({ ...stockManagementActions }, dispatch);

export default connect(mapStateToProps, matchDispatchToProps)(StockManagement);
