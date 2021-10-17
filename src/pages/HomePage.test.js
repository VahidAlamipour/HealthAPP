// Login.test.js
/* eslint-disable */
import fetchMock from 'fetch-mock';
import store from '../store';
import HomePage from '../pages/HomePage';
import { asyncFlush } from '../test_helper/asyncFlush';
import AppTestHelper from '../test_helper/AppTestHelper';

import { statusEnum } from '../actions/constant';
import { getApiUrl } from '../services/ServiceHelper';
import { getAccessToken, getLoggedInUser } from '../services/AuthenticationService';
import { 
  authTokenMock,
  userDataMock
} from '../test_helper/constant';

let app;

describe('Home Page', () => {

  beforeEach(() => {
    app = new AppTestHelper(HomePage, store);
  });

  afterEach(fetchMock.restore);

  it('It must login successfully', async () => {

    app.fillInputText('input[name="email"]','test@test.com');
    app.fillInputText('input[name="password"]','test');

    fetchMock.get(getApiUrl() + '/security/authenticate', authTokenMock);

    fetchMock.get(getApiUrl() + '/users/email/test@test.com', userDataMock);

    app.submitForm('form');
    await asyncFlush();

    expect(store.getState().home.status).toBe(statusEnum.SUCCESS);
    expect(getAccessToken()).toBe(authTokenMock.access_token);
    expect(getLoggedInUser().email).toBe(userDataMock.email);
  });

});