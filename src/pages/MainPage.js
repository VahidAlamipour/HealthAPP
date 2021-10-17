import React, { Component } from "react";
import { Route, Switch, Link } from "react-router-dom";
import { translate } from "react-i18next";
import { Container } from "reactstrap";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  Dropdown,
  DropdownToggle,
  NavDropdown,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import { Valert } from "../components";
import { isLoggedIn, logout } from "../services/AuthenticationService";
import HomePage from "./HomePage";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import SignUp from "./SignUp";
import Dashboard from "./Dashboard";
import MainView from "./MainView";
import Symptom from "./Symptom";
import EditSymptom from "./EditSymptom";
import Graph from "./Graph";
import Profile from "./Profile";
import ProfileUpdate from "./ProfileUpdate";
import ChangePassword from "./ChangePassword";
import SubUserCreate from "./SubUserCreate";
import ForgotPasswordReset from "./ForgotPasswordReset";
import RecipeManagement from "./RecipeManagement";
import Recipe from "./Recipe";
import MealPlanSummary from "./MealPlanSummary";
import MealPlanner from "./MealPlanner";
import Forum from "./Forum";
import ForumMe from "./ForumMe";
import ForumSingle from "./ForumSingle";
import ForumArchive from "./ForumArchive";

import Product from "./Product";
import BodyMap from "./BodyMap";
import {
  isLoadedFromMobile,
  getCurrentOrientation
} from "../services/MobileService";
import { Orientations } from "./PageConstants";

import "./styles/mainpage.css";

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.closeNavbar = this.closeNavbar.bind(this);
    this.doLogout = this.doLogout.bind(this);
    this.state = {
      collapsed: true,
      saveDataValert: false
    };
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  closeNavbar() {
    if (!this.state.collapsed) {
      this.setState({
        collapsed: true
      });
    }
  }

  doLogout() {
    logout();
    this.props.history.push("/");
  }

  gotoPath(p_urlName) {
    if (!window.changeData) {
      window.location = p_urlName;
    } else {
      this.p_urlName = p_urlName;
      this.setState({ saveDataValert: true });
    }
    //this.props.history.push(p_urlName);
  }

  render() {
    const pathname = this.props.location.pathname;
    const t = this.props.t;
    var _pageHeader;
    if (pathname === "/recipe") {
      _pageHeader = t("recipe.PAGE_TITLE");
      var recipePageTitle = localStorage.getItem("recipePageTitle");
      if (recipePageTitle) {
        _pageHeader = recipePageTitle;
      }
    } else if (pathname === "/mealplanner") {
      _pageHeader = t("meal_planner.PAGE_TITLE");
    } else if (pathname === "/mealplansummary") {
      _pageHeader = t("meal_plan_summary.PAGE_TITLE");
    } else if (pathname === "/forum") {
      _pageHeader = t("forum.PAGE_TITLE");
    } else if (pathname === "/forum/me") {
      _pageHeader = t("forum.PAGE_TITLE_ME");
    } else if (pathname === "/forum/archive") {
      _pageHeader = t("forum.PAGE_TITLE_ARCHIVE");
    } else if (pathname.includes("/forum/")) {
      _pageHeader = t("forum.PAGE_TITLE_USER");
    } else if (pathname === "/dashboard") {
      _pageHeader = t("stocks.PAGE_TITLE");
    } else if (pathname === "/profile") {
      _pageHeader = t("profile.PAGE_TITLE");
    } else if (pathname === "/changepassword") {
      _pageHeader = "User Profile";
    } else if (pathname === "/subusercreate") {
      _pageHeader = "Add Sub User";
    } else if (pathname === "/recipemanagement") {
      _pageHeader = t("recipe_management.PAGE_TITLE");
    } else if (pathname === "/symptom") {
      _pageHeader = t("symptoms.PAGE_TITLE");
    } else if (pathname === "/editsymptoms") {
      _pageHeader = t("editsymptoms.PAGE_TITLE");
    } else if (pathname === "/graph") {
      _pageHeader = t("graph.PAGE_TITLE");
    } else if (pathname === "/products") {
      _pageHeader = t("products.PAGE_TITLE");
    } else if (pathname === "/bodymap") {
      _pageHeader = "Body Map";
    } else if (pathname === "/") {
      _pageHeader = t("home.welcome");
    } else if (pathname === "/signup") {
      _pageHeader = t("signUp.title");
    }

    var _navbarTitle, _homeLinkSize;
    if (
      isLoadedFromMobile() ||
      getCurrentOrientation() === Orientations.PORTRAIT
    ) {
      _navbarTitle = "navbartitle-mobile";
      _homeLinkSize = "1rem";
    } else {
      _navbarTitle = "navbartitle";
      _homeLinkSize = "1.25rem";
    }
    return (
      <Container fluid={true} className="container-fluid">
        <Valert
          display={this.state.saveDataValert}
          //onRef={ref => (this.removeItemValert = ref)}
          title={"Warning!"}
          question={"Unsaved info will be lost. Are you sure to leave?"}
          positiveAction={() => {
            window.changeData = false;
            this.gotoPath(this.p_urlName);
          }}
          negativeAction={() => {
            setTimeout(() => {
              this.setState({ saveDataValert: false });
            }, 200);
          }}
          positiveText="Yes"
          negativeText="Cancel"
        />
        <Navbar color="primary" dark fixed="top">
          <Link
            to="/dashboard"
            style={{ fontSize: _homeLinkSize }}
            className="navbar-brand"
          >
            <img className="mainLogo" src={require("../images/logo.png")} />
            {/* {t("menu.company_name")} */}
          </Link>
          {/*<Link to={pathname} className="navbar-brand">{_pageHeader}</Link>*/}
          <div
            /*className="navbar-brand"*/ className={_navbarTitle}
            /*style={{fontFamily:"Arial",color:"White",fontSize:"1.8rem"}}*/
          >
            <b>{_pageHeader}</b>
          </div>
          {isLoggedIn() &&
            pathname !== "/" &&
            pathname !== "/signup" &&
            pathname !== "/resetpassword" &&
            pathname !== "/forgotpassword" && (
              <Dropdown
                direction="left"
                isOpen={!this.state.collapsed}
                toggle={this.toggleNavbar}
              >
                <DropdownToggle color="primary">
                  <i className="fa fa-bars" />
                </DropdownToggle>
                <DropdownMenu
                  modifiers={{
                    setMaxHeight: {
                      enabled: true,
                      order: 890,
                      fn: data => {
                        return {
                          ...data,
                          styles: {
                            ...data.styles,
                            overflow: "auto",
                            maxHeight: "90vh"
                          }
                        };
                      }
                    }
                  }}
                >
                  <p className="menu-section-separator">
                    {t("menu.section_my_data")}
                  </p>
                  <DropdownItem onClick={this.gotoPath.bind(this, "/symptom")}>
                    <a className="nav-link" href="javascript:;">
                      {t("menu.input")}
                    </a>
                  </DropdownItem>
                  <DropdownItem
                    onClick={this.gotoPath.bind(this, "/editsymptoms")}
                  >
                    <a className="nav-link" href="javascript:;">
                      {t("menu.edit")}
                    </a>
                  </DropdownItem>
                  <DropdownItem
                    onClick={this.gotoPath.bind(this, "/dashboard")}
                  >
                    <a className="nav-link" href="javascript:;">
                      {t("menu.view_summary")}
                    </a>
                  </DropdownItem>
                  <DropdownItem onClick={this.gotoPath.bind(this, "/graph")}>
                    <a className="nav-link" href="javascript:;">
                      {t("menu.analyze")}
                    </a>
                  </DropdownItem>
                  {/*<DropdownItem>{t('menu.separator')}</DropdownItem>*/}

                  {/* My Recipes */}
                  <p className="menu-section-separator">
                    {t("menu.section_my_recipes")}
                  </p>
                  <DropdownItem onClick={this.gotoPath.bind(this, "/recipe")}>
                    <a className="nav-link" href="javascript:;">
                      {t("menu.create")}
                    </a>
                  </DropdownItem>
                  <DropdownItem
                    onClick={this.gotoPath.bind(this, "/recipemanagement")}
                  >
                    <a className="nav-link" href="javascript:;">
                      {t("menu.manage_and_edit")}
                    </a>
                  </DropdownItem>
                  <p className="menu-section-separator">
                    {t("menu.meal_plan_title")}
                  </p>
                  <DropdownItem
                    onClick={this.gotoPath.bind(this, "/mealplanner")}
                  >
                    <a className="nav-link" href="javascript:;">
                      {t("menu.meal_planner")}
                    </a>
                  </DropdownItem>
                  <DropdownItem
                    onClick={this.gotoPath.bind(this, "/mealplansummary")}
                  >
                    <a className="nav-link" href="javascript:;">
                      {t("menu.meal_plan_summary")}
                    </a>
                  </DropdownItem>
                  <p className="menu-section-separator">{t("menu.forum")}</p>
                  <DropdownItem onClick={this.gotoPath.bind(this, "/forum")}>
                    <a className="nav-link" href="javascript:;">
                      {t("menu.forum")}
                    </a>
                  </DropdownItem>
                  <DropdownItem
                    onClick={this.gotoPath.bind(this, "/forum/archive")}
                  >
                    <a className="nav-link" href="javascript:;">
                      Archive
                    </a>
                  </DropdownItem>
                  {/*<DropdownItem>{t('menu.separator')}</DropdownItem>*/}

                  {/* tools & settings */}
                  <p className="menu-section-separator">
                    {t("menu.section_tools_settings")}
                  </p>
                  <DropdownItem onClick={this.gotoPath.bind(this, "/profile")}>
                    <a className="nav-link" href="javascript:;">
                      {t("menu.account")}
                    </a>
                  </DropdownItem>
                  <DropdownItem onClick={this.gotoPath.bind(this, "/bodymap")}>
                    <a className="nav-link" href="javascript:;">
                      {t("menu.body_map")}
                    </a>
                  </DropdownItem>
                  <DropdownItem onClick={this.gotoPath.bind(this, "/products")}>
                    <a className="nav-link" href="javascript:;">
                      {t("menu.contribute_data")}
                    </a>
                  </DropdownItem>
                  {/* <DropdownItem className="menu-nav-left-aligned" onClick={this.gotoPath.bind(this,'/profile')}>
                     <a className="nav-link" href="javascript:;">{t('profile.PAGE_TITLE')}</a>
                  </DropdownItem>
                  <DropdownItem className="menu-nav-left-aligned" onClick={this.gotoPath.bind(this,'/subusercreate')}>
                     <a className="nav-link" href="javascript:;">{t('menu.add_sub_user')}</a>
                  </DropdownItem> 
                  <DropdownItem className="menu-nav-left-aligned" onClick={this.gotoPath.bind(this,'/changepassword')}>
                     <a className="nav-link" href="javascript:;">{t('menu.change_password')}</a>
                  </DropdownItem>*/}

                  <DropdownItem onClick={this.doLogout}>
                    <a href="javascript:;" className="nav-link">
                      {t("menu.logout")}
                    </a>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            )}
        </Navbar>
        <Switch>
          <Route path="/forgotpasswordreset" component={ForgotPasswordReset} />
          <Route path="/forgotpassword" component={ForgotPassword} />
          <Route path="/resetpassword" component={ResetPassword} />
          <Route path="/signup" component={SignUp} />
          <Route path="/dashboard" component={MainView} />
          <Route path="/profile/update/:id" component={ProfileUpdate} />
          <Route path="/profile" component={Profile} />
          <Route path="/changepassword" component={ChangePassword} />
          <Route path="/subusercreate" component={SubUserCreate} />
          <Route path="/recipemanagement" component={RecipeManagement} />
          <Route path="/recipe" component={Recipe} />
          <Route path="/mealplansummary/:date?" component={MealPlanSummary} />
          <Route path="/mealplanner/:date?" component={MealPlanner} />
          <Route path="/forum/me" component={ForumMe} />
          <Route path="/forum/archive" component={ForumArchive} />
          <Route path="/forum/post/:postId" component={ForumSingle} />
          <Route path="/forum/:userId" component={ForumMe} />
          <Route path="/forum/" component={Forum} />
          <Route path="/main" component={Dashboard} />
          <Route path="/symptom" component={Symptom} />
          <Route path="/graph" component={Graph} />
          {/*<Route path="/symptoms" component={Symptom}/>*/}
          <Route path="/editsymptoms" component={EditSymptom} />
          <Route path="/products" component={Product} />
          <Route path="/bodymap" component={BodyMap} />
          <Route path="/" component={HomePage} />
        </Switch>
      </Container>
    );
  }
}

MainPage = translate("translations")(MainPage);

export default MainPage;
