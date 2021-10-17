import React from 'react';
import classNames from 'classnames';
import _ from 'lodash';

const RecipeRatingStar = ({ recipeId, rating, updateRating }) => {
  let ratingDecrement = rating;

  let onClick = (ratingSelected) => {
    const ratingUpdated = ratingSelected + 1;
    updateRating(recipeId, ratingUpdated);
  };

  return (
    <div className="rating-box">
      {
        _.times(5, function(i) {
          const isRated = ratingDecrement > 0 ? true : false;
          const ratingClass = classNames('rating',{ rated: isRated });
          ratingDecrement--;
          return (<a className={ratingClass} onClick={() => onClick(i)}><i className="fas fa-star"/></a>);
        })
      }
    </div>
  );
}

export default RecipeRatingStar;
