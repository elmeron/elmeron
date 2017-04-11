import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { zoomIn as zi } from '../../ducks/elmeron.js';

function ZoomInButton(props) {
  const { children, tile, zoomIn } = props;

  function onClick() {
    zoomIn(tile);
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
  }),
  (dispatch) => ({
    zoomIn: bindActionCreators(zi, dispatch),
  })
)(ZoomInButton);
