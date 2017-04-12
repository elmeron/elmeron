import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { openCard as open } from '../ducks/card.js';
import HexagonGrid from './HexagonGrid.jsx';
import PlanetTileCard from './cards/PlanetTileCard.jsx';

function SpaceGrid(props) {
  function onHexClick(anchor, hex) {
    props.openCard(anchor, <PlanetTileCard tile={hex} />);
  }

  return (
    <HexagonGrid onHexClick={onHexClick} backgroundClass="space-background" />
  );
}

export default connect(
  () => ({}),
  (dispatch) => ({
    openCard: bindActionCreators(open, dispatch),
  })
)(SpaceGrid);
