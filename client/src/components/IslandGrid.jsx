import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import config from '../../config.js';
import { openCard as open, closeCard as close } from '../ducks/card.js';
import { pickGem as pg } from '../ducks/elmeron.js';
import ExplorableHexagonGrid from './ExplorableHexagonGrid.jsx';
import StandardHexagonGroup from './StandardHexagonGroup.jsx';
import RefineryCard from './cards/RefineryCard.jsx';
import IslandTileCard from './cards/IslandTileCard.jsx';
import Gem from './Gem.jsx';

function IslandGrid(props) {
  function onHexClick(anchor, hex) {
    if (hex.owner && hex.owner.type === 'Refinery') {
      return props.openCard(anchor, <RefineryCard tile={hex} />);
    }

    props.openCard(anchor, <IslandTileCard tile={hex} anchor={anchor} />);
  }

  function onGemClick(elem, tile) {
    props.closeCard();
    props.pickGem(tile);
  }

  const { size } = config.tiles;
  const gemSize = size - (size * 0.6);

  return (
    <ExplorableHexagonGrid onHexClick={onHexClick}>
      <StandardHexagonGroup
        hexagons={props.gems}
        size={gemSize}
        hexagonComponent={Gem}
        onHexClick={onGemClick}
      />
    </ExplorableHexagonGrid>
  );
}

export default connect(
  (state) => ({
    tiles: state.world.get('tiles').toIndexedSeq().toJS(),
    gems: state.world.get('tiles').filter(tile =>
      tile.getIn(['resource', 'canPickGem'])
    ).toIndexedSeq().toJS(),
  }),
  (dispatch) => ({
    openCard: bindActionCreators(open, dispatch),
    closeCard: bindActionCreators(close, dispatch),
    pickGem: bindActionCreators(pg, dispatch),
  })
)(IslandGrid);
