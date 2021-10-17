import React from "react";
import { Input } from "reactstrap";
import {
  search as searchService,
  getDetail as getDetailService
} from "../services/AutocompleteService";
import { Date } from "core-js";

class VautoCompelete extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
    this.internalChange = this.internalChange.bind(this);
    this.internalSelect = this.internalSelect.bind(this);
    this._handleKeyDown = this._handleKeyDown.bind(this);
    this.autoSelect = this.autoSelect.bind(this);
  }
  async internalChange(e) {
    this.setState({ data: [] });
    var data = [];
    let val = e.target.value;
    if (this.props.onChangeText) this.props.onChangeText(val);
    if (this.props.category)
      data = await searchService(
        val,
        this.props.category,
        this.props.level,
        this.props.noUser
      );
    this.setState({ data: data });
  }
  async internalSelect(item) {
    var data = {};
    data = await getDetailService(
      item._id,
      this.props.category,
      this.props.noUser
    );
    if (this.props.onSelect) this.props.onSelect(data);
    this.setState({ data: [] });
  }
  autoSelect() {
    let selectedItem = undefined;
    if (Array.isArray(this.state.data) && this.state.data.length > 0) {
      this.state.data.forEach(item => {
        if (
          item.fullName.trim().toLocaleLowerCase() ==
          this.props.val.trim().toLocaleLowerCase()
        ) {
          selectedItem = item;
        }
      });
      if (selectedItem) {
        this.internalSelect(selectedItem);
      }
      setTimeout(() => {
        this.setState({ data: [] });
      }, 500);
    }
  }
  _handleKeyDown = e => {
    if (e.key === "Enter" && this.state.data.length > 0) {
      this.autoSelect();
    }
  };
  _onBlure = e => {
    this.autoSelect();
    setTimeout(() => {
      this.setState({ show: false });
    }, 300);
  };
  render() {
    const { input, disabled, val, placeholder } = this.props;
    let value = val || "";
    return (
      <div className="vAutocomplete">
        <Input
          {...input}
          ref="input"
          type="text"
          autoComplete="off"
          disabled={disabled}
          placeholder={placeholder}
          onChange={this.internalChange}
          value={value}
          onFocus={() => {
            this.setState({ show: true });
          }}
          onBlur={this._onBlure}
          onKeyDown={this._handleKeyDown}
        />
        {this.state.show && this.state.data && this.state.data.length > 0 && (
          <ul className="vAutoUl">
            {this.state.data.map(item => {
              return (
                <li
                  onClick={e => this.internalSelect(item, this.props.category)}
                >
                  {item.fullName}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }
}
export default VautoCompelete;
