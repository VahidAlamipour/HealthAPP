import i18n from '../i18n';

const Validations =
{
   required: (value) => (value ? undefined : i18n.t('validations.required')),
   upc_required: (value) => {
      if (value === undefined) return i18n.t('validations.required');
      const isNum = /^\d+$/.test(value);
      if (isNum === false)
         return i18n.t('validations.digit');
      if (value.length !== 8 && value.length !== 12 && value.length !== 13 && value.length !== 14 && value.length !== 17)
         return i18n.t('validations.upcLength');
      return undefined;
   },
   select_required: (value) => (typeof value === 'undefined' || value === null || value === "null" ? i18n.t('validations.required') : undefined),
   select_required_related: (value, requiredSelection, toched) => {
      if (!toched) {
         return undefined;
      }
      if (requiredSelection) {
         return i18n.t("symptoms.NO_USER_SELECTED_ERROR_TEXT");
      }
      return (typeof value === 'undefined' || value === null || value === "null" ? i18n.t('validations.required') : undefined)
   },
   email_phone: value =>
      value &&
         !(
            /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ||
            /^[0-9+-/(/)]{6,20}$/i.test(value)
         )
         ? i18n.t('validations.email_address')
         : undefined,
   minLength: (min) => value => value && value.length <= min ? `Must be ${min} characters or more` : undefined,
   maxLength: (max) => value => value && value.length >= max ? `Must be same or less than ${max}` : undefined,
   min8: (value) => value && value.length < 8 ? 'Minimal 8 characters' : undefined,
   max15: (value) => value && value.length > 15 ? 'Maximal 15 characters' : undefined,
   positive: (value) => typeof value !== 'undefined' && parseFloat(value) <= 0 ? i18n.t('Must be bigger than 0') : undefined,
   min_one_uppercase: value =>
      !/^(?=.*[A-Z]).+$/.test(value)
         ? 'Password must contain at least one uppercase'
         : undefined,
   min_one_number: value =>
      value &&
         !/^(?=.*\d).+$/i.test(value)
         ? 'Password must contain at least one number'
         : undefined,
   min_one_special: value =>
      value &&
         !/^(?=.*[!@#\$%\^&\*]).+$/i.test(value)
         ? 'Password must contain at least one special characters'
         : undefined
}

export default Validations;
