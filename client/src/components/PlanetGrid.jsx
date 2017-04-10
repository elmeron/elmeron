import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { openCard as open } from '../ducks/card.js';
import HexagonGrid from './HexagonGrid.jsx';
import PlanetTileCard from './cards/PlanetTileCard.jsx';

function PlanetGrid(props) {
  function onHexClick(anchor, hex) {
    props.openCard(anchor, <PlanetTileCard tile={hex} />);
  }

  return (
    <HexagonGrid onHexClick={onHexClick} />
  );
}

export default connect(
  (state) => ({
    tiles: state.world.get('tiles').toIndexedSeq().toJS(),
  }),
  (dispatch) => ({
    openCard: bindActionCreators(open, dispatch),
  })
)(PlanetGrid);
