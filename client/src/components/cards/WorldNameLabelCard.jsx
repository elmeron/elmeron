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
  const canZoomOut = nodeType && !nodeType.startsWith('Space');

  return (
    <Card customClassName="world-name-label-card">
      <p>
        <FuelIcon />
        {explorationCost}
      </p>
      {
        canZoomOut &&
        <button onClick={onZoom}>ZOOM OUT</button>
      }
    </Card>
  );
}

export default connect(
  (state) => ({
    nodeType: state.world.get('nodeType'),
    explorationCost: state.world.get('explorationCost'),
  }),
  (dispatch) => ({
    zoomOut: bindActionCreators(zo, dispatch),
  })
)(WorldNameLabelCard);
