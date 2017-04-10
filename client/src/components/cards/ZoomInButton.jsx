import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import elmeron from '../../services/elmeron/index.js';

function ZoomInButton(props) {
  const { children, tile } = props;

  function onClick() {
    elmeron.zoomIn(tile.owner);
  }

  if (tile.owner && children.includes(tile.owner)) {
    return (
      <button onClick={onClick}>{tile.owner.toUpperCase()}</button>
    );
  }

  return null;
}

ZoomInButton.PropTypes = {
  tile: PropTypes.object.isRequired,
  children: PropTypes.array.isRequired,
};

export default connect(
  (state) => ({
    children: state.world.getIn(['location', 'children']).toJS(),
  })
)(ZoomInButton);
