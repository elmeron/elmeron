import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { closeCard as close } from '../ducks/card.js';
import { explore as ex } from '../ducks/elmeron.js';
import HexagonGrid from './HexagonGrid.jsx';
import Hexagon from './Hexagon.jsx';
import StandardHexagonGroup from './StandardHexagonGroup.jsx';

function ExplorableHexagonGrid(props) {
  function onHexClick(elem, hex) {
    const { onHexClick, closeCard, explore } = props;
    const resource = hex.resource.name;

    if (resource === 'Ocean' || resource === 'Void') {
      return props.closeCard();
    }

    if (resource === 'Unexplored') {
      props.closeCard();
      return explore(hex);
    }

    if (onHexClick) {
      onHexClick(elem, hex);
    }
  }

  return (
    <HexagonGrid backgroundClass={props.backgroundClass}>
      <StandardHexagonGroup hexagons={props.hexagons} onHexClick={onHexClick} />
      {props.children}
    </HexagonGrid>
  );
}

export default connect(
  (state) => ({
    hexagons: state.world.get('tiles').toIndexedSeq().toJS(),
  }),
  (dispatch) => ({
    explore: bindActionCreators(ex, dispatch),
    closeCard: bindActionCreators(close, dispatch),
  })
)(ExplorableHexagonGrid);
