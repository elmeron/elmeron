import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { openCard as open, closeCard as close } from '../ducks/card.js';
import ExplorableHexagonGrid from './ExplorableHexagonGrid.jsx';
import PlanetTileCard from './cards/PlanetTileCard.jsx';

function PlanetGrid(props) {
  function onHexClick(anchor, hex) {
    props.openCard(anchor, <PlanetTileCard tile={hex} />);
  }

  return (
    <ExplorableHexagonGrid onHexClick={onHexClick} />
  );
}

export default connect(
  (state) => ({
    tiles: state.world.get('tiles').toIndexedSeq().toJS(),
  }),
  (dispatch) => ({
    openCard: bindActionCreators(open, dispatch),
    closeCard: bindActionCreators(close, dispatch),
  })
)(PlanetGrid);
