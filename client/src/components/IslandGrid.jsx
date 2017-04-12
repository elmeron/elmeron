import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { openCard as open, closeCard as close } from '../ducks/card.js';
import HexagonGrid from './HexagonGrid.jsx';
import IslandTileCard from './cards/IslandTileCard.jsx';

function IslandGrid(props) {
  function onHexClick(anchor, hex) {
    if (hex.resource === 'Ocean') {
      props.closeCard();
      return;
    }

    props.openCard(anchor, <IslandTileCard tile={hex} />);
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
    closeCard: bindActionCreators(close, dispatch),
  })
)(IslandGrid);
