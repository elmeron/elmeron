import React, { PropTypes } from 'react';
import elmeron from '../../services/elmeron/index.js';

export default function ExploreButton(props) {
  function onClick() {
    elmeron.explore(props.tile);
  }

  if (props.tile.resource === 'Unexplored') {
    return (
      <button onClick={onClick}>EXPLORE</button>
    );
  }

  return null;
}

ExploreButton.PropTypes = {
  tile: PropTypes.object.isRequired,
};
