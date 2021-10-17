import React, { Component } from 'react';
import {BrowserRouter as Router, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import MainPage from './pages/MainPage';
import { I18nextProvider } from 'react-i18next';


import i18n from './i18n';

class App extends Component {

  render() {
    return (
      <I18nextProvider i18n={ i18n }>
        <Router>
          <Route path="/" component={MainPage} />
        </Router>
      </I18nextProvider>
    );
  }
}

export default App;
