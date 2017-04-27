import React from 'react';
import { connect } from 'react-redux';
import HexagonGrid from './HexagonGrid.jsx';
import StandardHexagonGroup from './StandardHexagonGroup.jsx';

function StandardHexagonGrid(props) {
  return (
    <HexagonGrid backgroundClass={props.backgroundClass}>
      <StandardHexagonGroup hexagons={props.tiles} />
    </HexagonGrid>
  );
}

export default connect(
  (state) => ({
    tiles: state.world.get('tiles').filterNot(tile =>
      tile.getIn(['resource', 'name']) === 'Unexplored'
    ).toIndexedSeq().toJS(),
  })
)(StandardHexagonGrid);
