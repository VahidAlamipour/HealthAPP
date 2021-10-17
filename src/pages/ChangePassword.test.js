// ProfileUpdate.test.js
/* eslint-disable */
import fetchMock from 'fetch-mock';
import store from '../store';
import ChangePassword from '../pages/ChangePassword';
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

describe('Change password Page', () => {

  beforeEach(async () => {
    setAccessToken(authTokenMock.access_token, false);
    localStorage.setItem('user', JSON.stringify(userDataMock));

    app = new AppTestHelper(ChangePassword, store);
    await asyncFlush();
  });

  afterEach(fetchMock.restore);


  it('It must update successfully', async () => {
    fetchMock.post(getApiUrl() + '/users/resetpassword', {});

    app.fillInputText('input[name="old_password"]','Testtest1!');
    app.fillInputText('input[name="new_password"]','Testtest1!');
    app.fillInputText('input[name="confirm_password"]','Testtest1!');

    app.submitForm('form');
    await asyncFlush();

    expect(store.getState().changePassword.status).toBe(statusEnum.SUCCESS);
  });

});