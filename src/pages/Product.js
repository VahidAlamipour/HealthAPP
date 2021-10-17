import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import { Field, reduxForm, submit } from "redux-form";
import {
  InputText,
  Dropdown,
  Loading,
  ReactSelectAsync,
  Valert,
  InputBarcode,
  InputAmount
} from "../components";
import { Row, Col, Button, Form, FormGroup, Alert } from "reactstrap";
import _ from "lodash";

import productActions from "../actions/productActions";
import { searchProduct } from "../services/LookupService";
import Validations from "../components/Validations";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { AutoComplete } from "redux-form-material-ui";
import { withRouter, Prompt } from "react-router";
import PropTypes from "prop-types";

import {
  isLoadedFromMobile,
  getCurrentOrientation
} from "../services/MobileService";
import { Orientations } from "./PageConstants";

import {
  REACT_STYLE_BUTTON_SIZE_DESKTOP,
  REACT_STYLE_BUTTON_SIZE_MOBILE
} from "./Constants";
import "./styles/product.css";

class IngredientForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      autoIngredientValidator: "",
      m_unitValue: "",
      m_unitValidator: "",
      sizeValue: "",
      sizeValidator: ""
    };
    this.searchIngredientOptions = this.searchIngredientOptions.bind(this);
    this.selectIngredientOptions = this.selectIngredientOptions.bind(this);
    this.stateChanger = this.stateChanger.bind(this);
    // this.m_unitOnChange = this.m_unitOnChange.bind(this);
    // this.sizeOnChange = this.sizeOnChange.bind(this);
    //this.m_unitOnClick = this.m_unitOnClick.bind(this);
  }
  stateChanger(key, value) {
    var data = {};
    data[key] = value;
    this.setState(data, function() {
      console.log(this.state);
    });
  }
  // m_unitOnChange(e) {
  //   var val = e.target.value == "null" ? "" : e.target.value;
  //   this.setState({ m_unitValue: val });
  //   if (val) {
  //     this.setState({ m_unitValidator: '' });
  //   }
  //   return true;
  // }
  // sizeOnChange(e) {
  //   var val = e.target.value == "null" ? "" : e.target.value;
  //   if (val) {
  //     this.setState({ sizeValidator: '' });
  //   }
  //   return true;
  // }

  componentDidMount() {
    this.props.onRef(this);
  }

  searchIngredientOptions(e) {
    let val = e.target.value;
    if (val) {
      this.setState({ autoIngredientValidator: "" });
    }
    this.props.searchIngredientOptions(val, this.props.category);
    return true;
  }

  selectIngredientOptions(e) {
    var id = 0;
    for (let i = 0; i < this.props.ingredientTotalOptions.length; i++) {
      const ele = this.props.ingredientTotalOptions[i];
      if (ele.value === e) {
        id = ele.id;
        break;
      }
    }

    this.props.selectIngredientName(e, id);
  }
  sizeReset() {
    this.sizeRef.valueChenger("");
  }
  // m_unitOnClick() {
  //   var val = this.sizeRef.getValue();
  //   if (!val) {
  //     this.setState({ 'sizeValidator': 'Required' });
  //   }
  // }

  render() {
    let props = this.props;
    let errorName = "";
    if (
      props.formProductIngredient &&
      props.formProductIngredient.values &&
      Validations.required(props.formProductIngredient.values.name) &&
      props.anyTouched
    ) {
      errorName = "invalid";
    }
    const positive = value => {
      if (value < 0) {
        return 0;
      } else {
        return value;
      }
    };
    return (
      <Form onSubmit={props.handleSubmit}>
        <FormGroup row>
          <Col className={"border-col " + errorName}>
            <Field
              name="name"
              component={AutoComplete}
              className={`item-input-text ${this.state
                .autoIngredientValidator && "is-invalid"}  ${
                this.props.disabled.ingredientName ? "disabled" : ""
              }`}
              //floatingLabelText="Enter Ingredient"
              hintText={this.props.t("products.INGREDIENT_DEFAULT_TEXT")}
              openOnFocus
              autocomplete="off"
              fullWidth={true}
              listStyle={{ maxHeight: 200, overflow: "auto" }}
              onKeyUp={this.searchIngredientOptions}
              dataSource={props.ingredientOptions}
              disabled={this.props.disabled.ingredientName}
              underlineStyle={{ display: "none" }}
              filter={(searchText, key) => true}
              onNewRequest={this.selectIngredientOptions}
              maxlength="63"
            />
            {this.state.autoIngredientValidator && (
              <div className="invalid-feedback">
                {this.state.autoIngredientValidator}
              </div>
            )}
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col>
            <Field
              component={InputAmount}
              normalize={positive}
              name="size"
              placeholder={this.props.t("products.AMOUNT_DEFAULT_TEXT")}
              className={`${this.state.sizeValidator && "is-invalid"}`}
              onRef={ref => (this.sizeRef = ref)}
              //onChange={this.props.onChangeIngredientForm}
              onKeyUp={e => this.props.onChangeIngredientForm(e)}
              disabled={this.props.disabled.size}
              pattern="[0-9./ ]*"
              reseter={this.props.amountReseter}
              amounNewValue={this.props.amounNewValue}
            />
          </Col>
          <Col>
            <Field
              name="m_unit"
              component={Dropdown}
              options={props.measurementOptions}
              placeholder={this.props.t("products.UNIT_DEFAULT_TEXT")}
              className={`${this.state.m_unitValidator && "is-invalid"}`}
              onChange={this.props.onChangeIngredientForm}
              //onClick={this.m_unitOnClick}
              disabled={this.props.disabled.m_unit}
            />
            {this.state.m_unitValidator && (
              <div className="invalid-feedback">
                {this.state.m_unitValidator}
              </div>
            )}
          </Col>
        </FormGroup>
        <Field
          component={InputText}
          type="hidden"
          name="_id"
          placeholder="Id"
        />
      </Form>
    );
  }
}

IngredientForm = reduxForm({
  form: "formProductIngredient",
  enableReinitialize: true
})(IngredientForm);

IngredientForm = connect(state => ({
  initialValues: state.product.ingredientForm
}))(IngredientForm);

class ProductForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      autoBrandValidator: "",
      categoryValidator: "",
      UPCValidator: "",
      nameValidator: ""
    };
    this.productOnChange = this.productOnChange.bind(this);
    this.brandOnChange = this.brandOnChange.bind(this);
    //this.validateUpc = this.validateUpc.bind(this);
    this.categoryOnChange = this.categoryOnChange.bind(this);
    //this.nameOnChange = this.nameOnChange.bind(this);
    this.upcOnChange = this.upcOnChange.bind(this);
    this.stateChanger = this.stateChanger.bind(this);
    this.onClickBrand = this.onClickBrand.bind(this);
  }
  componentDidMount() {
    this.props.onRef(this);
  }
  categoryOnChange(e) {
    this.props.onChangeForm(e);
    var val = e.target.value == "null" ? "" : e.target.value;
    if (val) {
      this.setState({ categoryValidator: "" });
    }
    return true;
  }
  upcOnChange(e) {
    this.sendFlag = false;
    this.props.onChangeForm(e);
    var val = e.target.value;
    var validate = Validations.upc_required(val);
    if (validate) {
      this.setState({ UPCValidator: validate });
    } else {
      this.setState({ UPCValidator: "" });
    }

    //check UPC in database
    if (!validate) {
      const category = this.props.category;
      const upc = e.target.value;
      this.sendFlag = true;
      setTimeout(() => {
        if (this.sendFlag) {
          this.props.validateUpc(category, upc, result => {
            this.props.thereIsNotUPC(result);
            if (result) {
              this.props.changeStatusUPCalert.changeStatus();
              //this.props.change("UPC", '');
            }
          });
        }
      }, 3000);
    }
    // if (category && category !== 'null' && category !== null && !Validations.upc_required(upc)) {
    //   this.props.validateUpc(category, upc);
    // }
    return true;
  }
  // nameOnChange(e) {
  //   var val = e.target.value == "null" ? "" : e.target.value;
  //   if (val) {
  //     this.setState({ nameValidator: '' })
  //   }
  //   return true;
  // }

  productOnChange = e => {
    let val = e.target.value;
    if (window.id == "") {
      this.props.change("_id", "");
      this.props.change("user", "");
    }
    // this.props.change('size', '');
    // this.props.change('cuisine', '');
    const type = this.props.category;
    this.props.searchProductOptions(val, type);
    return true;
  };
  stateChanger(key, value) {
    var data = {};
    data[key] = value;
    this.setState(data, function() {
      console.log(this.state);
    });
  }

  brandOnChange = e => {
    let val = e.target.value;
    if (val) {
      this.setState({ autoBrandValidator: "" });
    }
    const type = this.props.category;
    this.props.searchBrandOptions(val, type);
    return true;
  };
  // validateUpc = (e) => {
  //   const category = this.props.category;
  //   const upc = e.target.value;
  //   if (category && category !== 'null' && category !== null && !Validations.upc_required(upc)) {
  //     this.props.validateUpc(category, upc);
  //   }
  // };
  // upcReset() {
  //   this.UPCRef.valueChenger('');
  // }
  onClickBrand() {}
  render() {
    let props = this.props;
    let errorName = "";
    let errorBrand = "";
    if (
      props.formProduct &&
      props.formProduct.values &&
      Validations.required(props.formProduct.values.name) &&
      props.anyTouched
    ) {
      errorName = "invalid";
    }
    if (
      props.formProduct &&
      props.formProduct.values &&
      Validations.required(props.formProduct.values.brand) &&
      props.anyTouched
    )
      errorBrand = "invalid";

    const categories = [
      { value: "food", label: "Food" },
      { value: "product", label: "Personal Care Product" }
    ];
    return (
      <Form onSubmit={props.handleSubmit}>
        <FormGroup row>
          <Col>
            <Field
              name="category"
              component={Dropdown}
              options={categories}
              placeholder={this.props.t("products.CATEGORY_DEFAULT_TEXT")}
              //validate={Validations.select_Required}
              className={`${this.state.categoryValidator && "is-invalid"}  ${
                this.props.classNames.category
              }`}
              onChange={this.categoryOnChange}
            />
            {this.state.categoryValidator && (
              <div className="invalid-feedback">
                {this.state.categoryValidator}
              </div>
            )}
          </Col>
          <Col>
            <Field
              name="UPC"
              component={InputText}
              placeholder={this.props.t("products.UPC_DEFAULT_TEXT")}
              //validate={Validations.upc_required}
              //onBlur={this.validateUpc}
              onChange={this.upcOnChange}
              className={`${this.state.UPCValidator && "is-invalid"}`}
              onRef={ref => (this.UPCRef = ref)}
              disabled={this.props.disabled.UPC}
              //onKeyPress={this.keyDownUpc}
            />
            {this.state.UPCValidator && (
              <div className="invalid-feedback">{this.state.UPCValidator}</div>
            )}
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col className={"border-col " + errorName}>
            {/*<Field*/}
            {/*name=""*/}
            {/*component={AutoComplete}*/}
            {/*hintText={this.props.t('products.PRODUCT_DEFAULT_TEXT')}*/}
            {/*listStyle={{maxHeight: 200, overflow: 'auto'}}*/}
            {/*openOnFocus*/}
            {/*fullWidth={true}*/}
            {/*validate={Validations.required}*/}
            {/*underlineStyle={{display: 'none'}}*/}
            {/*onKeyUp={this.productOnChange}*/}
            {/*dataSource={props.productOptions}*/}
            {/*filter={(searchText, key) => true}*/}
            {/*// onNewRequest={props.getIngredients}*/}
            {/*/>*/}
            <Field
              name="name"
              component={InputText}
              placeholder={this.props.t("products.PRODUCT_DEFAULT_TEXT")}
              //validate={Validations.required}
              onChange={this.props.onChangeForm}
              className={`${this.state.nameValidator && "is-invalid"}`}
              disabled={this.props.disabled.productName}
            />
            {this.state.nameValidator && (
              <div className="invalid-feedback">{this.state.nameValidator}</div>
            )}
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col className={"border-col " + errorBrand}>
            <Field
              name="brand"
              className={`item-input-text ${this.state.autoBrandValidator &&
                "is-invalid"} ${this.props.disabled.brand ? "disabled" : ""}`}
              component={AutoComplete}
              hintText={this.props.t("products.BRAND_DEFAULT_TEXT")}
              listStyle={{ maxHeight: 200, overflow: "auto" }}
              openOnFocus
              fullWidth={true}
              onKeyUp={this.brandOnChange}
              dataSource={props.brandOptions}
              //validate={Validations.required}
              filter={(searchText, key) => true}
              underlineStyle={{ display: "none" }}
              onClick={this.onClickBrand}
              ref="autoName"
              disabled={this.props.disabled.brand}
              onNewRequest={props.getIngredients}
            />
            {this.state.autoBrandValidator && (
              <div className="invalid-feedback">
                {this.state.autoBrandValidator}
              </div>
            )}
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col>
            <Field
              name="comment"
              component={InputText}
              type="textarea"
              onChange={this.props.onChangeForm}
              disabled={this.props.disabled.comment}
              placeholder={this.props.t("products.COMMENT_DEFAULT_TEXT")}
            />
          </Col>
        </FormGroup>
      </Form>
    );
  }
}

ProductForm = reduxForm({
  form: "formProduct",
  enableReinitialize: true
})(ProductForm);

ProductForm = withRouter(
  connect(state => ({
    initialValues: state.product.productForm
  }))(ProductForm)
);

class Product extends React.Component {
  // cuisineOptions = [];
  // measurementOptions = [];
  constructor(props) {
    super(props);
    this.addClicked = this.addClicked.bind(this);
    this.ingredientSubmit = this.ingredientSubmit.bind(this);
    this.saveClicked = this.saveClicked.bind(this);
    //this.deleteClicked = this.deleteClicked.bind(this);
    this.saveProduct = this.saveProduct.bind(this);
    this.saveClickedProduct = this.saveClickedProduct.bind(this);
    this.clearProduct = this.clearProduct.bind(this);
    this.otherCuisineModal = this.otherCuisineModal.bind(this);
    this.productSubmit = this.productSubmit.bind(this);
    this.getIngredients = this.getIngredients.bind(this);
    this.ingredientUpdatedFunction = this.ingredientUpdatedFunction.bind(this);
    this.submitAfterAsk = this.submitAfterAsk.bind(this);
    this.savedAddItem = this.savedAddItem.bind(this);
    this.state = {
      changedCnt: 1,
      is_saved: 0,
      ingredientValidator: ""
    };
  }

  componentDidMount() {
    this.props.formInitialization();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.ingredientList && nextProps.ingredientList.length > 0) {
      this.setState({ ingredientValidator: "" });
    }
  }
  componentDidUpdate() {
    let myDomNode = this.scroll;
    myDomNode.scrollTop = myDomNode.scrollHeight;
  }
  addClicked() {
    if (this.ingredient.props.invalid) {
      alert("Please complete Ingredient Information");
    }
    this.props.addClicked();
  }
  savedAddItem() {
    if (!this.props.isEditing) {
      this.props.addIngredientItem(this.savedValues);
      this.ingredient.sizeReset();
    } else {
      this.props.saveIngredientItem(this.savedValues);
    }
  }
  ingredientSubmit(values) {
    var validationFlag = true;
    values = this.props.ingredientForm;
    var { name, m_unit, size } = values;
    // if (name == undefined || name == null || name == "") {
    //   this.ingredient.stateChanger("autoIngredientValidator", "Required");
    //   validationFlag = false;
    // } else {
    //   this.ingredient.stateChanger("autoIngredientValidator", "");
    // }
    if (
      m_unit &&
      m_unit != null &&
      (size == undefined || size == null || size == "" || size == 0)
    ) {
      this.ingredient.stateChanger("sizeValidator", "Required");
      validationFlag = false;
    } else {
      this.ingredient.stateChanger("m_unitValidator", "");
    }

    //check in list
    var newValue = values.name;
    this.props.ingredientOptions.forEach(item => {
      if (item.toLowerCase().trim() == values.name.toLowerCase().trim()) {
        values._id = "1";
        newValue = item;
      }
    });
    values.name = newValue;

    // check for similar
    if (!this.props.ingredientList <= 0) {
      this.props.ingredientList.forEach(item => {
        if (
          item.name.toLocaleLowerCase().trim() ==
          values.name.toLocaleLowerCase().trim()
        ) {
          validationFlag = false;
          this.updateIngredientValert.changeStatus();
          this.ingredientUpdatedValues = values;
          this.updateIngradientMessage = `This ingredient is already on the list, If you want to replace, click Ok. Otherwise click Cancel.`;
          return;
        }
      });
    }
    if (!validationFlag) return;

    if (!this.props.ingredientForm._id) {
      this.noIdValert.changeStatus();
      this.savedValues = values;
      return false;
    }

    if (!this.props.isEditing) {
      this.props.addIngredientItem(values);
      this.ingredient.sizeReset();
    } else {
      this.props.saveIngredientItem(this.props.formProductIngredient.values);
    }
  }
  ingredientUpdatedFunction() {
    this.props.saveIngredientItem(this.ingredientUpdatedValues);
  }

  productSubmit(values) {
    var validationFlag = true;
    var { brand, category, name, UPC } = values;
    if (brand == undefined || brand == null || brand == "") {
      this.product.stateChanger("autoBrandValidator", "Required");
      validationFlag = false;
    } else {
      this.product.stateChanger("autoBrandValidator", "");
    }
    if (category == undefined || category == null || category == "") {
      this.product.stateChanger("categoryValidator", "Required");
      validationFlag = false;
    } else {
      this.product.stateChanger("categoryValidator", "");
    }
    if (UPC == undefined || UPC == null || UPC == "") {
      this.product.stateChanger("UPCValidator", "Required");
      validationFlag = false;
    } else {
      let upcValidate = Validations.upc_required(UPC);
      if (upcValidate) {
        this.product.stateChanger("UPCValidator", upcValidate);
        validationFlag = false;
      } else {
        this.product.stateChanger("UPCValidator", "");
      }
    }
    if (name == undefined || name == null || name == "") {
      this.product.stateChanger("nameValidator", "Required");
      validationFlag = false;
    } else {
      this.product.stateChanger("nameValidator", "");
    }
    let data = {
      category: values.category,
      name: values.name,
      upc: values.UPC,
      brand: values.brand,
      comment: values.comment,
      ingredients: this.props.ingredientList
    };

    if (data.ingredients.length < 1) {
      validationFlag = false;
      this.setState({
        ingredientValidator: "You have to create at least 1 ingredient"
      });
    } else {
      this.setState({ ingredientValidator: "" });
    }
    if (!validationFlag) return;

    this.props.saveProduct(data, () => {
      alert(this.props.t("products.SEND_SUCCESS_TEXT"));
    });
  }

  ingredientItemOnClick(index) {
    const ingredient = this.props.ingredientList[index];
    ingredient.isSelected = true;
    this.props.editIngredientItem(index, this.props.selectedIndex, ingredient);
  }

  saveClicked() {
    if (this.ingredient.props.invalid) {
      alert("Please complete Ingredient Information");
    }
    this.props.saveClicked();
  }

  // deleteClicked() {
  //   //if (!window.confirm(this.props.t("products.PERMISSION_DELETE"))) return;
  //   this.props.deleteIngredientItem();
  // }

  saveProduct() {
    this.props.saveProduct();
  }

  saveClickedProduct() {
    if (!this.props.disabled.addBtn) {
      this.dataInFormValert.changeStatus();
    } else {
      this.props.saveClickedProduct();
    }
  }
  submitAfterAsk() {
    this.props.saveClickedProduct();
  }

  clearProduct() {
    if (!window.confirm(this.props.t("products.PERMISSION_CLEAR"))) return;
    this.props.clearProduct();
    //this.product.upcReset();
    this.ingredient.sizeReset();
    this.product.stateChanger("autoBrandValidator", "");
    this.product.stateChanger("categoryValidator", "");
    this.product.stateChanger("UPCValidator", "");
    this.product.stateChanger("nameValidator", "");
    this.setState({ ingredientValidator: "" });
    this.ingredient.stateChanger("autoIngredientValidator", "");
    this.ingredient.stateChanger("m_unitValidator", "");
  }

  otherCuisineModal(e) {
    const cuisineName = window.prompt("Insert new cuisine");
    if (cuisineName) {
      const cuisineObj = { cuisine: cuisineName };
      this.props.createCuisine(cuisineObj);
    }
  }

  getIngredients(e) {
    let ele, data;
    // for (let i = 0; i < this.props.productTotalOptions.length; i++) {
    //   ele = this.props.productTotalOptions[i];
    //   if (ele.value == e) {
    //     data = ele;
    //     break;
    //   }
    // }
    // ;
    this.props.getIngredients(e);
  }

  leave = location => {
    if (
      !this.state.is_saved &&
      (!this.product.props.pristine ||
        !this.ingredient.props.pristine ||
        this.props.ingredientList.length > 0)
    )
      return "Unsaved info will be lost. Are you sure to leave?";
  };
  camelize = text => {
    return text.substr(0, 1).toUpperCase() + text.substr(1);
    // return text.replace(/^([A-Z])|[\s-_]+(\w)/g, (match, p1, p2, offset) => {
    //     if (p2) return p2.toUpperCase();
    //     return p1.toLowerCase();
    // });
  };
  resetPage = () => {};
  ingredientUpdatedFunction() {
    this.props.addIngredientItem(this.ingredientUpdatedValues);
    this.ingredient.sizeReset();
  }
  render() {
    let {
      isLoading,
      measurementOptions,
      ingredientList,
      ingredientTotalOptions,
      brandOptions,
      isEditing,
      ingredientOptions,
      searchIngredientOptions,
      searchProductOptions,
      productOptions,
      searchBrandOptions,
      disabled,
      classNames,
      onChangeForm,
      thereIsNotUPC,
      onChangeIngredientForm,
      selectIngredientName,
      amounNewValue,
      amountReseter
    } = this.props;

    // let isShowSaveIngredient = false;
    // if (
    //   isEditing &&
    //   this.props.formProductIngredient &&
    //   this.props.formProductIngredient.initial !=
    //     this.props.formProductIngredient.values
    //   //&& this.props.formProductIngredient.active
    // ) {
    //   isShowSaveIngredient = true;
    // }

    var _pageFitter, _btnFontSize;
    //  if( isLoadedFromMobile() || getCurrentOrientation()===Orientations.PORTRAIT ){
    //     _pageFitter="page-fitter-mobile";
    //     _btnFontSize=REACT_STYLE_BUTTON_SIZE_MOBILE;
    //  }else{
    //     _pageFitter="page-fitter";
    //     _btnFontSize=REACT_STYLE_BUTTON_SIZE_DESKTOP;
    //  }
    return (
      <div className="vPage flex">
        <Loading isLoading={isLoading} />
        <Valert
          display={false}
          title="Delete Confirmation"
          question="Are you sure you want to delete this entry?"
          onRef={ref => (this.deleteValert = ref)}
          positiveAction={() => {
            this.props.deleteIngredientItem(this.deleteItem);
            //this.props.deleteItem(this.deleteId);
          }}
          positiveText="Yes"
          negativeText="Cancel"
        />
        <Valert
          display={false}
          title={this.props.t("products.DUPLICATE_ENTRY_TITLE")}
          question={this.updateIngradientMessage}
          onRef={ref => (this.updateIngredientValert = ref)}
          positiveAction={this.ingredientUpdatedFunction}
          positiveText="Yes"
          negativeText="Cancel"
        />
        <Valert
          display={false}
          question="You have not added your last item to the list. Do you want to save your data without this item?"
          onRef={ref => (this.dataInFormValert = ref)}
          positiveAction={this.submitAfterAsk}
          positiveText="Yes"
          negativeText="Cancel"
        />
        <Valert
          display={false}
          title="Thank you"
          question="Thank you for your effort to contribute this barcode in our database. Please enter another barcode because the barcode already in our database"
          onRef={ref => (this.UPCvalert = ref)}
          positiveAction={this.resetPage}
          readonly={true}
          positiveText="Ok"
        />
        <Valert
          display={false}
          title="Warning!"
          question={this.props.t("symptoms.OTHER_ENTRY_ERROR_TEXT")}
          onRef={ref => (this.noIdValert = ref)}
          positiveAction={this.savedAddItem}
        />
        {/* <Valert display={false}
            question={this.updateIngradientMessage}
            onRef={ref => (this.updateIngredientValert = ref)}
            positiveAction={this.ingredientUpdatedFunction} /> */}
        <MuiThemeProvider>
          <ProductForm
            t={this.props.t}
            productOnChange={this.productOnChange}
            productOptions={productOptions}
            brandOptions={brandOptions}
            searchProductOptions={searchProductOptions}
            searchBrandOptions={searchBrandOptions}
            formProduct={this.props.formProduct}
            category={
              this.props.formProduct
                ? this.props.formProduct.values.category
                : ""
            }
            validateUpc={this.props.validateUpc}
            onSubmit={this.productSubmit}
            onRef={ref => (this.product = ref)}
            disabled={disabled}
            classNames={classNames}
            onChangeForm={onChangeForm}
            thereIsNotUPC={thereIsNotUPC}
            changeStatusUPCalert={this.UPCvalert}
            getIngredients={this.getIngredients}
          />
        </MuiThemeProvider>
        {/* <h6 className="entered-ingredients">
            {this.props.t("products.INGREDIENTS_LABEL_DEFAULT_TEXT")}
          </h6> */}
        <div
          className={`grayList ingredient-list ${this.state
            .ingredientValidator && "is-invalid"}`}
          ref={el => {
            this.scroll = el;
          }}
          style={{ flex: 1 }}
        >
          {!ingredientList ||
            (ingredientList.length === 0 && (
              // <Row className="usersItem">
              //   <Col>
              //     <div className="wrapper">
              //       <span className="desc">
              //         {this.props.t('products.INGREDIENTS_EMPTY')}
              //       </span>
              //       <div className="clearfix" />
              //     </div>
              //   </Col>
              // </Row>
              <div className="usersItem">
                <Row className="wrapper">
                  <Col>
                    <span className="desc" />
                    {this.props.t("products.INGREDIENTS_EMPTY")}
                  </Col>
                </Row>
              </div>
            ))}
          {ingredientList &&
            ingredientList.map((item, i) => {
              let desc = "";
              if (item.size) desc = `${desc} ${item.size}`;
              if (item.m_unit && item.m_unit != "null")
                desc = `${desc} ${item.m_unit}`;
              desc = `${desc} ${item.name}`; //${this.camelize(item.name)}
              return (
                <div key={i} className="usersItem">
                  <Row
                    className="wrapper"
                    onClick={this.ingredientItemOnClick.bind(this, i)}
                  >
                    <Col xs="10">
                      <span className="desc">{desc}</span>
                    </Col>
                    <Col
                      xs="2"
                      className="d-flex justify-content-end align-items-center"
                    >
                      {item.isSelected && <i className="fas fa-check" />}
                      <i
                        className="fas fa-trash deleteIcon"
                        onClick={e => {
                          e.stopPropagation();
                          this.deleteItem = i;
                          this.deleteValert.changeStatus();
                        }}
                      />
                    </Col>
                  </Row>
                </div>
              );
            })}
        </div>
        {this.state.ingredientValidator && (
          <div className="invalid-feedback">
            {this.state.ingredientValidator}
          </div>
        )}
        <MuiThemeProvider>
          <IngredientForm
            measurementOptions={measurementOptions}
            ingredientOptions={ingredientOptions}
            ingredientTotalOptions={ingredientTotalOptions}
            t={this.props.t}
            searchIngredientOptions={searchIngredientOptions}
            category={
              this.props.formProduct
                ? this.props.formProduct.values.category
                : ""
            }
            onRef={ref => (this.ingredient = ref)}
            formProductIngredient={this.props.formProductIngredient}
            onSubmit={this.ingredientSubmit}
            disabled={disabled}
            onChangeIngredientForm={onChangeIngredientForm}
            selectIngredientName={selectIngredientName}
            amountReseter={amountReseter}
            amounNewValue={amounNewValue}
          />
        </MuiThemeProvider>
        <div class="baseRow">
          <div className="row ops-section">
            {!isEditing && (
              <div className="col">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={this.addClicked}
                  disabled={disabled.addBtn ? "disabled" : ""}
                >
                  {this.props.t("products.ADD_BUTTON_VALUE")}
                </button>
              </div>
            )}
            {isEditing && (
              <div className="col">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={this.saveClicked}
                  disabled={disabled.addBtn ? "disabled" : ""}
                >
                  {this.props.t("products.UPDATE_BUTTON_VALUE")}
                </button>
              </div>
            )}
            {/* {isEditing && !isShowSaveIngredient && (
              <div className="col">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={this.deleteClicked}
                >
                  {this.props.t("products.DELETE_BUTTON_VALUE")}
                </button>
              </div>
            )} */}
            <div class="btn-spacer" />
            <div className="col">
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.saveClickedProduct}
                disabled={disabled.saveBtn ? "disabled" : ""}
              >
                {this.props.t("products.SAVE_BUTTON_VALUE")}
              </button>
            </div>

            <div class="btn-spacer" />

            <div className="col">
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.clearProduct}
                disabled={disabled.clearBtn ? "disabled" : ""}
              >
                {this.props.t("products.CLEAR_BUTTON_VALUE")}
              </button>
            </div>
          </div>
        </div>
        <Prompt message={this.leave} />
      </div>
    );
  }
}

Product = translate("translations")(Product);

const mapStateToProps = state => ({
  ...state.product,
  formProductIngredient: state.form.formProductIngredient,
  formProduct: state.form.formProduct
});

const matchDispatchToProps = dispatch =>
  bindActionCreators({ ...productActions }, dispatch);

export default withRouter(
  connect(
    mapStateToProps,
    matchDispatchToProps
  )(Product)
);
