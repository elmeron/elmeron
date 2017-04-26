import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { openCard as open } from '../../ducks/card.js';
import {
  resetSelectedTiles as rst,
  selectTile as st,
  startMonitoring as sm
} from '../../ducks/refinery.js';
import Card from './Card.jsx';
import GemIcon from '../GemIcon.jsx';
import BuildRefineryCard from './BuildRefineryCard.jsx';

function IslandTileCard(props) {
  const { name, offset } = props.tile.resource;

  function onRefine() {
    props.resetSelectedTiles();
    props.selectTile(props.tile);
    props.startMonitoring();
    props.openCard(props.anchor, <BuildRefineryCard />);
  }

  return (
    <Card>
      <h1>{name}</h1>
      <p>
        <GemIcon color={name.toLowerCase()} />
        {offset}
      </p>
      <button onClick={onRefine}>REFINE</button>
    </Card>
  );
}

export default connect(
  undefined,
  (dispatch) => ({
    openCard: bindActionCreators(open, dispatch),
    resetSelectedTiles: bindActionCreators(rst, dispatch),
    selectTile: bindActionCreators(st, dispatch),
    startMonitoring: bindActionCreators(sm, dispatch),
  })
)(IslandTileCard);
