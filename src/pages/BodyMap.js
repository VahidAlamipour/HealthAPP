import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {translate} from 'react-i18next';
import {withRouter, Prompt} from 'react-router';
//import './styles/bodymap.css';


class BodyMap extends React.Component {
  constructor(props) {
    super(props);
    this.state={
       body:''
    }
  }
  componentDidMount() {
     this.setState({body:<object className="bodyMapObject" type="text/html" data="https://s3.us-east-2.amazonaws.com/body-map/index.html"></object>});
  }
  render()
  {
     var ran = Math.random();
     var url = "https://s3.us-east-2.amazonaws.com/body-map/index.html?dummy="+ran;
    return (
       <div className="vPage">
          <object className="bodyMapObject" type="text/html" data={url}></object>
       </div>
    )
  }
}
BodyMap = translate('translations')(BodyMap);
export default withRouter(connect()(BodyMap));
//export default  BodyMap;

// const mapStateToProps = state => ({
//   ...state.product,
//   formProductIngredient: state.form.formProductIngredient,
//   formProduct: state.form.formProduct
// });

// const matchDispatchToProps = dispatch => (bindActionCreators({...productActions}, dispatch));

// export default withRouter(connect(mapStateToProps, matchDispatchToProps)(Product));
