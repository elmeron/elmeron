import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { zoomOut as zo } from '../../ducks/elmeron.js';
import './WorldNameLabelCard.less';
import Card from './Card.jsx';
import FuelIcon from '../FuelIcon.jsx';

function WorldNameLabelCard(props) {
  function onZoom() {
    props.zoomOut();
  }

  const { nodeType, explorationCost } = props;
  const isSpace = nodeType && nodeType.startsWith('Space');
  const hasExplored = props.hasExploredFirstIsland || props.isExplored;
  const canZoomOut = !isSpace && hasExplored;

  return (
    <Card customClassName="world-name-label-card">
      <p>
        <FuelIcon />
        {explorationCost}
      </p>
      {!props.hasExploredFirstIsland &&
        <p>
          You must explore the island before you can zoom out
        </p>
      }
      <button disabled={!canZoomOut} onClick={onZoom}>ZOOM OUT</button>
    </Card>
  );
}

export default connect(
  (state) => ({
    nodeType: state.world.get('nodeType'),
    explorationCost: state.world.get('explorationCost'),
    isExplored: state.world.get('isExplored'),
    hasExploredFirstIsland: state.player.get('hasExploredFirstIsland'),
  }),
  (dispatch) => ({
    zoomOut: bindActionCreators(zo, dispatch),
  })
)(WorldNameLabelCard);
