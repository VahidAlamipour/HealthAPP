import React from 'react';
import classnames from 'classnames';

import './styles/loading.css';

const Loading = ({
  isLoading
}) => {
  const loadingStyleClass = classnames({
    'loading-wrapper': true,
    'show': isLoading
  });

  return (
    <div className={loadingStyleClass}>
      <span></span>
    </div>
  );
};

export default Loading;
