// ProfileUpdate.test.js
/* eslint-disable */
import fetchMock from 'fetch-mock';
import store from '../store';
import ProfileUpdate from '../pages/ProfileUpdate';
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

describe('Profile Update Page', () => {

  beforeEach(async () => {
    setAccessToken(authTokenMock.access_token, false);
    localStorage.setItem('user', JSON.stringify(userDataMock));
    fetchMock.get(getApiUrl() + '/users/' + userDataMock._id, userDataMock);
    fetchMock.get(getApiUrl() + '/lookup/countrycity', countriesMock);
    fetchMock.get(getApiUrl() + '/lookup/ethnicity', ethnicitiesMock);
    
    app = new AppTestHelper(ProfileUpdate, store, '/:id', '/1');
    await asyncFlush();
  });

  afterEach(fetchMock.restore);

  it('It must show user profile', async () => {
    // Check user form initialization value
    expect(store.getState().profileUpdate.userForm._id).toEqual(userDataMock._id);
    expect(store.getState().profileUpdate.userForm.first_name).toEqual(userDataMock.first_name);
    expect(store.getState().profileUpdate.userForm.last_name).toEqual(userDataMock.last_name);
    expect(store.getState().profileUpdate.userForm.gender).toEqual(userDataMock.gender);
    expect(store.getState().profileUpdate.userForm.address).toEqual(userDataMock.address);
    expect(store.getState().profileUpdate.userForm.ethnicity).toEqual(userDataMock.ethnicity);
  });

  it('It must update successfully', async () => {
    fetchMock.put(getApiUrl() + '/users/' + userDataMock._id, userDataMock);

    app.submitForm('form');
    await asyncFlush();

    expect(store.getState().profileUpdate.status).toBe(statusEnum.SUCCESS);
  });

});