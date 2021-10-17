// SubUserCreate.test.js
/* eslint-disable */
import fetchMock from 'fetch-mock';
import store from '../store';
import SubUserCreate from '../pages/SubUserCreate';
import { asyncFlush } from '../test_helper/asyncFlush';
import AppTestHelper from '../test_helper/AppTestHelper';

import { statusEnum } from '../actions/constant';
import { getApiUrl } from '../services/ServiceHelper';
import { getAccessToken, setAccessToken, getLoggedInUser } from '../services/AuthenticationService';
import { 
  authTokenMock,
  userDataMock,
  countriesMock,
  ethnicitiesMock
} from '../test_helper/constant';

let app;

describe('Sub User Create Page', () => {

  beforeEach(async () => {
    setAccessToken(authTokenMock.access_token, false);
    localStorage.setItem('user', JSON.stringify(userDataMock));
    fetchMock.get(getApiUrl() + '/users/' + userDataMock._id, userDataMock);
    fetchMock.get(getApiUrl() + '/lookup/countrycity', countriesMock);
    fetchMock.get(getApiUrl() + '/lookup/ethnicity', ethnicitiesMock);
    
    app = new AppTestHelper(SubUserCreate, store);
    await asyncFlush();
  });

  afterEach(fetchMock.restore);

  it('It must create successfully', async () => {
    app.wrapper.update();

    app.fillInputText('input[name="first_name"]','test');
    app.fillInputText('input[name="last_name"]','test');
    app.selectChangeValue('.birthMonth option','1');
    app.selectChangeValue('.birthYear option','1990');
    app.selectChangeValue('.gender option','1');
    app.selectChangeValue('.address option','Afganistan, Kabul');
    app.selectChangeValue('.ethnicity option','English');
    
    fetchMock.put(getApiUrl() + '/users/' + userDataMock._id, userDataMock);

    app.submitForm('form');
    await asyncFlush();

    expect(store.getState().subUserCreate.status).toBe(statusEnum.SUCCESS);
  });

});