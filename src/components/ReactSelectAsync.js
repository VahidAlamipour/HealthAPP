import React from 'react';
import AsyncCreatableSelect from 'react-select/lib/AsyncCreatable';
//import CreatableSelect from 'react-select/lib/Creatable';
import { FormFeedback } from 'reactstrap';

//import 'react-select/dist/react-select.css';

const ReactSelectAsync = ({
  input,
  loadOptions,
  name,
  options,
  meta: { error }
}) => {
  let isError = typeof error !== 'undefined';
  let handleChange = (e) =>{
      input.onChange(e);
  };
  return (
    <div>
      <AsyncCreatableSelect
        name={input.name}
        onChange={handleChange}
        loadOptions={loadOptions}
      />
      {/*<CreatableSelect options={options} onChange={handleChange}/>*/}
      {/*{ isError && <FormFeedback>{error}</FormFeedback> }*/}
    </div>
  );
};

export default ReactSelectAsync;
