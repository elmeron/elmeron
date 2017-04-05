import React, { PropTypes } from 'react';
import elmeron from '../../services/elmeron/index.js';

export default function UnexploredCardBody(props) {
  function onClick() {
    elmeron.explore(props.tile);
  }

  return (
    <button onClick={onClick}>EXPLORE</button>
  );
}

UnexploredCardBody.PropTypes = {
  tile: PropTypes.object.isRequired,
};
