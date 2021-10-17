import React from 'react';
import { FormFeedback, Input } from 'reactstrap';
import AutoComplete from 'material-ui/AutoComplete';
const Typeahead = ({
  input,
  label,
  required,
  dataSource,
  validate,
    hintText,
    onKeyUp,
    onNewRequest,
  meta: { touched, error }
}) => {
  let isError = touched && (typeof error !== 'undefined');
  let requiredSpan = required && (<span className="required">*</span>);
  return (
    <div className={isError ? 'invalid' : ''}>
      <AutoComplete
          {...input}
          hintText={hintText}
          listStyle={{maxHeight: 200, overflow: 'auto'}}
          openOnFocus
          searchText={input.value}
          fullWidth={true}
          inputProps={{
              onKeyUp: onKeyUp
          }}
          validate={validate}
          underlineStyle={{display: 'none'}}
          dataSource={dataSource}
          filter={(searchText, key) => true}
          onNewRequest={onNewRequest}
      />
      { isError && <FormFeedback>{error}</FormFeedback> }
    </div>
  );
};

export default Typeahead;
