import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { BrowserRouter, MemoryRouter, Route, Switch } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';

import i18n from './i18n';

class AppTestHelper {
  constructor(Page, store, routingPath, route) {
    if (!routingPath) {
      this.wrapper = mount(<Provider store={store}>
        <I18nextProvider i18n={ i18n }>
          <BrowserRouter>
            <Page />
          </BrowserRouter>
        </I18nextProvider>
      </Provider>);
    } else {
      this.wrapper = mount(<Provider store={store}>
        <I18nextProvider i18n={ i18n }>
          <MemoryRouter initialEntries={[ route ]}>
            <Switch>
              <Route exact path={routingPath} component={Page} />
            </Switch>
          </MemoryRouter>
        </I18nextProvider>
      </Provider>);
    }
  }

  fillInputText(selector, value) {
    this.wrapper.find(selector).simulate('change', { target: { value: value } });
  }

  selectClick(selector, index) {
    this.wrapper.find(selector).at(index).simulate('click');
  }

  selectChangeValue(selector, value) {
    this.wrapper.find(selector + '[value="' + value + '"]').simulate('change');
  }

  click(selector) {
    this.wrapper.find(selector).simulate('click');
  }

  submitForm(selector) {
    this.wrapper.find(selector).simulate('submit');
  }
}

export default AppTestHelper;
