import i18n from '../i18n';

export const monthOptions = [
  { label: 'January', value: '1' },
  { label: 'February', value: '2' },
  { label: 'March', value: '3' },
  { label: 'April', value: '4' },
  { label: 'May', value: '5' },
  { label: 'June', value: '6' },
  { label: 'July', value: '7' },
  { label: 'August', value: '8' },
  { label: 'September', value: '9' },
  { label: 'October', value: '10' },
  { label: 'November', value: '11' },
  { label: 'December', value: '12' }
];

export const genderOptions = [
  { label: 'Male', value: '1' },
  { label: 'Female', value: '2' },
  { label: 'Others', value: '0' }
];

export const locationOptions = [
  { label: 'Kuala Lumpur', value: 'Kuala Lumpur' },
  { label: 'Penang', value: 'Penang' }
];

export const ethnicityOptions = [
  { optGroup: 'White' },
  { value: 'White English', label: 'English' },
  { value: 'White Welsh', label: 'Welsh' },
  { value: 'White Scottish', label: 'Scottish' },
  { value: 'White Northern Irish', label: 'Northern Irish' },
  { value: 'White Irish', label: 'Irish' },
  { value: 'White Gypsy or Irish Traveller', label: 'Gypsy or Irish Traveller' },
  { value: 'White Other', label: 'Any other White background' },

  { optGroup: 'Mixed or Multiple ethnic groups' },
  { value: 'Mixed White and Black Caribbean', label: 'White and Black Caribbean' },
  { value: 'Mixed White and Black African', label: 'White and Black African' },
  { value: 'Mixed White Other', label: 'Any other Mixed or Multiple background' },

  { optGroup: 'Asian' },
  { value: 'Asian Indian', label: 'Indian' },
  { value: 'Asian Pakistani', label: 'Pakistani' },
  { value: 'Asian Bangladeshi', label: 'Bangladeshi' },
  { value: 'Asian Chinese', label: 'Chinese' },
  { value: 'Asian Other', label: 'Any other Asian background' },

  { optGroup: 'Black' },
  { value: 'Black African', label: 'African' },
  { value: 'Black African American', label: 'African American' },
  { value: 'Black Caribbean', label: 'Caribbean' },
  { value: 'Black Other', label: 'Any other Black background' },

  { optGroup: 'Other ethnic groups' },
  { value: 'Arab', label: 'Arab' },
  { value: 'Hispanic', label: 'Hispanic' },
  { value: 'Latino', label: 'Latino' },
  { value: 'Native American', label: 'Native American' },
  { value: 'Pacific Islander', label: 'Pacific Islander' },
  { value: 'Other', label: 'Any other ethnic group' }
];

export const getYearOptions = () => {
  let yearOptions = [];
  const currentYear = (new Date()).getFullYear();
  //for (let i = 1900; i < currentYear; i++) {
   for( let i=currentYear; i>=1900; i-- ){
    yearOptions.push({ label: i, value: i.toString() });
  }

  return yearOptions;
};

// Get month options translated
export const getMonthOptionsTrans = (monthOptions) =>  {
  return monthOptions.map((option) => {
    return {
      value: option.value,
      label: i18n.t('formCommon.monthOptions.'+option.value)
    }
  });
}

export const getMonthFromDate = (date) => parseInt(date.substring(5,7),10).toString();
export const getYearFromDate = (date) => date.substring(0,4);
