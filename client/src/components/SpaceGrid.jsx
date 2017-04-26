import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { openCard as open, closeCard as close } from '../ducks/card.js';
import ExplorableHexagonGrid from './ExplorableHexagonGrid.jsx';
import SpaceTileCard from './cards/SpaceTileCard.jsx';

function SpaceGrid(props) {
  function onHexClick(anchor, hex) {
    props.openCard(anchor, <SpaceTileCard tile={hex} />);
  }

  return (
    <ExplorableHexagonGrid onHexClick={onHexClick} backgroundClass="space-background" />
  );
}

export default connect(
  () => ({}),
  (dispatch) => ({
    openCard: bindActionCreators(open, dispatch),
    closeCard: bindActionCreators(close, dispatch),
  })
)(SpaceGrid);
