export const authTokenMock = {
  access_token: 'abc123',
  subs: 'test@test.com'
};

export const userDataMock = {
  _id: '1',
  email: 'john.doe1@test.com',
  mobile: '123',
  first_name: 'John',
  last_name: 'Doe',
  nick_name: 'John Doe',
  address: 'Afganistan, Kabul',
  gender: 1,
  ethnicity: 'English',
  birthday: 186683400000,
  locale: 'en',
  status: 0,
  sub_users: [
    {
      _id: '2',
      email: 'jane.doe@test.com',
      mobile: '123',
      first_name: 'Jane',
      last_name: 'Doe',
      nick_name: 'Jane Doe',
      address: 'Afganistan, Kabul',
      gender: 1,
      ethnicity: 'English',
      birthday: 186683400000
    }
  ]
};

export const countriesMock = {
  title: 'CountryCities',
  countries_cities: [
    'Afganistan, Kabul', 'Algeria, Oran'
  ]
};

export const ethnicitiesMock = {
  title: 'Ethnicities',
  item: {
    White: [
      'English',
      'Welsh',
      'Scottissh',
      'Northern Irish',
      'Irish'
    ]
  }
};

