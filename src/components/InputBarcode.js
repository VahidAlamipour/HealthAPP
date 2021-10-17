import React, { Component } from 'react';
import { FormFeedback, Input } from 'reactstrap';


class InputBarcode extends Component {
    constructor(){
        super();
        this.state = {
            val:''
        }
        this.OnChange = this.OnChange.bind(this);
    }
    componentDidMount() {
        this.props.onRef(this);
    }
    valueChenger(val) {
        this.setState({ val: val })
    }
    OnChange(evt) {
        const financialGoal = (evt.target.validity.valid) ? evt.target.value : this.state.val;
        this.setState({ val: financialGoal });
    }
    render() {
        return (
            <Input autoComplete="off" {...this.props.input}
                placeholder={this.props.placeholder}
                className={this.props.className}
                onInput={this.OnChange}
                value={this.state.val}
                pattern="[0-9]*"
            />
        )
    }
}
export default InputBarcode;