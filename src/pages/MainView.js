import React, { Component } from "react";
import { isLoggedIn } from "../services/AuthenticationService";
import { translate } from "react-i18next";
import "./styles/dashboard.css";
import { bindActionCreators } from "redux";
import mainViewActions from "../actions/mainViewActions";
import connect from "react-redux/es/connect/connect";
import Carousel from "re-carousel";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import moment from "moment";
import { Bubble } from "react-chartjs-2";
import Loading from "../components/Loading";
import { SUB_USER_CREATE_SUBMIT } from "../actions/constant";

function Dot(props) {
  return (
    <span
      style={{
        display: "inline-block",
        height: "8px",
        width: "8px",
        borderRadius: "4px",
        backgroundColor: "white",
        margin: "7px 5px",
        opacity: props.selected ? "1" : "0.3",
        transitionDuration: "300ms"
      }}
      onClick={props.select}
    />
  );
}

function IndicatorDots(props) {
  const wrapperStyle = {
    position: "absolute",
    width: "100%",
    zIndex: "100",
    bottom: "-10px",
    textAlign: "center"
  };
  const select = (index, e) => {
    for (let i = 0; i < Math.abs(props.index - index); i++) {
      if (props.index > index) {
        setTimeout(function() {
          props.prevHandler();
        }, i * 50);
      } else {
        setTimeout(function() {
          props.nextHandler();
        }, i * 50);
      }
    }
  };
  if (props.total < 2) {
    // Hide dots when there is only one dot.
    return <div style={wrapperStyle} />;
  } else {
    return (
      <div style={wrapperStyle}>
        {Array.apply(null, Array(props.total)).map((x, i) => {
          return (
            <Dot
              key={i}
              selected={props.index === i}
              select={select.bind(this, i)}
            />
          );
        })}
        <Link to="/main" className="indicator-bar">
          <i className="fa fa-cog" />
        </Link>
      </div>
    );
  }
}

IndicatorDots.propTypes = {
  index: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired
};

class Chartview extends React.Component {
  componentDidMount() {}
  render() {
    const data = {
      chartData: {
        labels: this.props.chartPeriod,
        datasets: [
          {
            //label: "",
            //fill: false,
            //lineTension: 0.3,
            // backgroundColor: "#B2B2B2",
            borderColor: "#B2B2B2",
            borderWidth: 2,
            // borderCapStyle: "butt",
            // borderDash: [],
            // borderDashOffset: 0.0,
            // borderJoinStyle: "miter",
            // pointBorderColor: "#B2B2B2",
            // pointBackgroundColor: "#B2B2B2",
            // pointBorderWidth: 0.1,
            // pointHoverRadius: 5,
            // pointHoverBackgroundColor: "#B2B2B2",
            // pointHoverBorderColor: "#B2B2B2",
            // pointHoverBorderWidth: 0.2,
            //pointRadius: 1,
            // yAxisID: "y1",
            // xAxisID: "x1",
            //pointHitRadius: 10,
            data: this.props.data
          }
        ]
      },
      chartOptions: {
        scales: {
          yAxes: [
            {
              type: "linear",
              ticks: {
                //beginAtZero: true,
                min: 0,
                max: 10
              },
              labels: [10, 8, 6, 4, 2, 0]
              //id: "y1"
            }
          ],
          xAxes: [
            {
              type: "time",
              bounds: "ticks",
              ticks: { source: "labels" }
              // time: {
              //   min: moment(),
              //   max: moment().add(-1, "years")
              // }
            }
          ]
        }
      }
      //maintainAspectRatio: false
    };
    const legendOpts = {
      display: false
    };
    return (
      <div className="chart">
        <Bubble
          data={data.chartData}
          options={data.chartOptions}
          legend={legendOpts}
        />
      </div>
    );
  }
}
class Subview extends React.Component {
  /*componentWillReceiveProps()
   {
   }*/
  componentDidMount() {}
  render() {
    //const timeSelections = ['1D', '1W', '1M', '3M', '6M', '1Y', '2Y'];
    const timeSelections = ["1M", "3M", "6M", "1Y", "2Y"];

    //_chartView = <div></div>;
    var _chartView = (
      <Chartview
        data={this.props.item.graph}
        chartPeriod={this.props.chartPeriod}
      />
    );
    try {
      <Chartview data={this.props.item.graph} />;
    } catch (err) {}

    var _newsList = <li />;
    if (this.props.item !== undefined) {
      if (this.props.item.news !== undefined) {
        _newsList = this.props.item.news.map((news, key) => {
          return (
            <li className="list-group-item" key={key}>
              <a href={news.url}>{news.title}</a>
              <br />
              {news.author}
              {typeof news.author != "undefined" &&
                news.author != null &&
                news.author != "" && <br />}
              {moment(news.publishedAt).format("DD MMM YYYY")}
            </li>
          );
        });
      }
    }

    return (
      <Carousel widgets={[IndicatorDots]}>
        <div className="subview-item">
          <div className="time-selection">
            {timeSelections.map((time, key) => {
              const k =
                time == this.props.timeSelection
                  ? "time-item active"
                  : "time-item";
              return (
                <a
                  className={k}
                  key={key}
                  onClick={this.props.selectTime.bind(
                    this,
                    this.props.selectedSymptom,
                    time
                  )}
                >
                  {time}
                </a>
              );
            })}
          </div>
          {_chartView}
        </div>
        <div className="subview-item">
          <ul className="list-group group-small">{_newsList}</ul>
        </div>
        <div className="subview-item" />
      </Carousel>
    );
  }
}
class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chooseUser: ""
    };
    this.toggleSeverity = this.toggleSeverity.bind(this);
  }
  componentDidMount() {}
  getClass = val => {
    let name = "btn btn-sm ";
    //   if(val==0)name +='normal';
    //   else if(val>=1 && val<=3)name +='mild';
    //   else if(val>=4 && val<=6)name +='moderate';
    //   else if(val>=7 && val<=10)name+='severe';
    return `${name}severity${val}`;
  };
  toggleSeverity = e => {
    this.props.toggleSeverity();
    e.stopPropagation();
  };
  selectChange(e) {
    var resutl = {};
    this.props.users.map(element => {
      if (element._id == e.currentTarget.value) {
        resutl = element;
      }
    });
    if (resutl._id == this.props.baseUser._id) {
      localStorage.removeItem("Dashboard_User_Selected");
    } else {
      localStorage.setItem("Dashboard_User_Selected", JSON.stringify(resutl));
    }
    //this.props.selectUser(resutl);
    this.props.changeSelectStatus();
    this.props.changeUserStocks(resutl);
  }
  render() {
    let { items, users, selectedUser, t, DateMode } = this.props;
    var selectedId = "";
    if (selectedUser) {
      selectedId = selectedUser._id;
    }
    return (
      <div className="listSection">
        <div className="dropDownDashboard">
          <select
            className="form-control chooseUser"
            onChange={this.selectChange.bind(this)}
            value={selectedId}
          >
            {users &&
              users.map(element => {
                return (
                  <option value={element._id}>
                    {element.first_name} {element.last_name}
                  </option>
                );
              })}
          </select>
        </div>
        <ul class="list-group small-part">
          {items &&
            items.map((value, index) => {
              let className = "list-group-item";
              if (
                typeof value.isSelected != "undefined" &&
                value.isSelected == 1
              )
                className += " selected";
              return (
                <li
                  className={className}
                  key={index}
                  onClick={() =>
                    this.props.selectItem(
                      value,
                      this.props.timeSelection,
                      t("stocks.symptom")
                    )
                  }
                >
                  {value.symptom}
                  {!DateMode && (
                    <span className="info" onClick={this.toggleSeverity}>
                      <span className="state">
                        {value.arrow == "up" && (
                          <i className="fa fa-arrow-up" />
                        )}
                        {value.arrow == "down" && (
                          <i className="fa fa-arrow-down" />
                        )}
                      </span>
                      <button className={this.getClass(value.severity)}>
                        {value.severity}
                      </button>
                    </span>
                  )}
                  {DateMode && (
                    <span className="info" onClick={this.toggleSeverity}>
                      <span className="state">
                        {moment(parseInt(value.date)).format("MMM DD")}
                      </span>
                      <button className={this.getClass(value.severity)}>
                        {moment(parseInt(value.date)).format("HH:mm")}
                      </button>
                    </span>
                  )}
                </li>
              );
            })}
        </ul>
      </div>
    );
  }
}

class MainView extends Component {
  constructor(props) {
    super(props);
    this.fistChangeStoks = true;
    this.changeSelectStatus = this.changeSelectStatus.bind(this);
  }
  async componentDidMount() {
    if (!isLoggedIn()) {
      this.props.history.push("/");
      return;
    }
    var baseUser = localStorage.getItem("user");
    let user = JSON.parse(baseUser);
    await this.props.getSymptomUsers(user._id);

    var selectedUser = localStorage.getItem("Dashboard_User_Selected");
    selectedUser = JSON.parse(selectedUser);
    if (selectedUser) {
      this.props.getdetailStocks(selectedUser);
    } else {
      this.props.getdetailStocks(user);
    }
    window.selected_id = 0;

    // if (user.sub_users) {
    //   this.users = [user, ...user.sub_users];
    // } else {
    //   this.users = [user];
    // }
    // this.users = JSON.parse(localStorage.getItem("AllUsers"));
    this.baseUser = user;
  }
  componentDidUpdate() {
    if (
      this.fistChangeStoks &&
      this.props.stocks &&
      this.props.stocks.length > 0
    ) {
      this.fistChangeStoks = false;
      this.props.selectItem(
        this.props.stocks[0],
        this.props.timeSelection,
        this.props.t("stocks.symptom")
      );
    }
  }
  componentWillUnmount() {
    this.props.resetPage();
  }
  changeSelectStatus() {
    this.fistChangeStoks = true;
  }
  render() {
    const {
      t,
      isLoading,
      DateMode,
      selectedUser,
      changeUserStocks,
      allUser,
      timeSelection,
      selectedSymptom
    } = this.props;
    return (
      <div className="black-container">
        <Loading isLoading={isLoading} />
        <div className="stock">
          <List
            items={this.props.stocks}
            selectItem={this.props.selectItem}
            getdetailStocks={this.props.getdetailStocks}
            toggleSeverity={this.props.toggleSeverity}
            users={allUser}
            baseUser={this.baseUser}
            selectedUser={selectedUser}
            changeUserStocks={changeUserStocks}
            t={t}
            DateMode={DateMode}
            timeSelection={timeSelection}
            selectedSymptom={selectedSymptom}
            changeSelectStatus={this.changeSelectStatus}
          />
          <div className="subview">
            <Subview
              item={this.props.selected}
              timeSelection={this.props.timeSelection}
              selectTime={this.props.selectTime}
              selectedSymptom={selectedSymptom}
              chartPeriod={this.props.chartPeriod}
            />
          </div>
        </div>
      </div>
    );
  }
}

MainView = translate("translations")(MainView);

const mapStateToProps = state => ({ ...state.mainView });

const matchDispatchToProps = dispatch =>
  bindActionCreators({ ...mainViewActions }, dispatch);

export default connect(
  mapStateToProps,
  matchDispatchToProps
)(MainView);
