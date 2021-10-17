// Profile.test.js
/* eslint-disable */
import fetchMock from 'fetch-mock';
import store from '../store';
import Profile from '../pages/Profile';
import { asyncFlush } from '../test_helper/asyncFlush';
import AppTestHelper from '../test_helper/AppTestHelper';

import { statusEnum } from '../actions/constant';
import { getApiUrl } from '../services/ServiceHelper';
import { getAccessToken, setAccessToken, getLoggedInUser } from '../services/AuthenticationService';
import { 
  authTokenMock,
  userDataMock
} from '../test_helper/constant';

let app;

describe('Profile Page', () => {

  beforeEach(async () => {
    setAccessToken(authTokenMock.access_token, false);
    localStorage.setItem('user', JSON.stringify(userDataMock));
    fetchMock.get(getApiUrl() + '/users/' + userDataMock._id, userDataMock);
    
    app = new AppTestHelper(Profile, store);
    await asyncFlush();
  });

  afterEach(fetchMock.restore);

  it('It must show user profile', async () => {
    expect(store.getState().profile.user._id).toEqual(userDataMock._id);
    expect(store.getState().profile.user.first_name).toEqual(userDataMock.first_name);
    expect(store.getState().profile.user.last_name).toEqual(userDataMock.last_name);
    expect(store.getState().profile.user.gender).toEqual(userDataMock.gender);
    expect(store.getState().profile.user.address).toEqual(userDataMock.address);
    expect(store.getState().profile.user.ethnicity).toEqual(userDataMock.ethnicity);
    expect(store.getState().profile.subUsers).toHaveLength(1);

    app.wrapper.update();

    it('It must update profile', async () => {
      fetchMock.get(getApiUrl() + '/users/2', userDataMock);
      app.selectChangeValue('.profileSelect option','2');
      await asyncFlush();

      expect(store.getState().profile.user._id).toEqual('2');
    });
  });

});