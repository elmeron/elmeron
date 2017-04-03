import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import config from '../../config.js';

function TileMap(props) {
  const {
    screenWidth,
    screenHeight,
    zoom,
    center,
    tiles,
  } = props;
  const { size, spacing } = config.tiles;
  const gridProps = {
    width: screenWidth,
    height: screenHeight,
    hexagons: tiles.toArray(),
    zoom,
    center: center.toJS(),
    size,
    spacing,
  };

  return (
    <div>{`${screenWidth} x ${screenHeight}`}</div>
  );
}

TileMap.propTypes = {
  screenWidth: PropTypes.number.isRequired,
  screenHeight: PropTypes.number.isRequired,
  zoom: PropTypes.number.isRequired,
  center: PropTypes.object.isRequired,
  tiles: PropTypes.object.isRequired,
};

export default connect(
  (state) => ({
    screenWidth: state.ui.get('screenWidth'),
    screenHeight: state.ui.get('screenHeight'),
    zoom: state.ui.get('zoom'),
    center: state.ui.get('center'),
    tiles: state.tiles,
  })
)(TileMap);
