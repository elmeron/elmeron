import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { openCard as open } from '../../ducks/card.js';
import {
  resetSelectedTiles as rst,
  selectTile as st,
  startMonitoring as sm
} from '../../ducks/refinery.js';
import './IslandTileCard.less';
import Card from './Card.jsx';
import GemIcon from '../GemIcon.jsx';
import PlayerIcon from '../PlayerIcon.jsx';
import BuildRefineryCard from './BuildRefineryCard.jsx';

function IslandTileCard(props) {
  const { name, offset } = props.tile.resource;
  const { player } = props.tile;
  const cannotRefine = player && player !== props.nickname;

  function onRefine() {
    props.resetSelectedTiles();
    props.selectTile(props.tile);
    props.startMonitoring();
    props.openCard(props.anchor, <BuildRefineryCard />);
  }

  return (
    <Card customClassName="island-tile-card">
      <h1>{name}</h1>
      { player &&
        <p>
          <PlayerIcon />
          {player}
        </p>
      }
      <p>
        <GemIcon color={name.toLowerCase()} />
        {offset}
      </p>
      <button disabled={cannotRefine} onClick={onRefine}>REFINE</button>
    </Card>
  );
}

export default connect(
  (state) => ({
    nickname: state.elmeron.get('nickname'),
  }),
  (dispatch) => ({
    openCard: bindActionCreators(open, dispatch),
    resetSelectedTiles: bindActionCreators(rst, dispatch),
    selectTile: bindActionCreators(st, dispatch),
    startMonitoring: bindActionCreators(sm, dispatch),
  })
)(IslandTileCard);
