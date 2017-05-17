import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { zoomIn as zi } from '../../ducks/elmeron.js';
import Card from './Card.jsx';

function IslandCard(owner, onZoom) {
  return (
    <div>
      <h1>{owner}</h1>
      <button onClick={onZoom}>ZOOM IN</button>
    </div>
  );
}

function UnknownCard(owner) {
  return <h1>Unknown Island</h1>;
}

function PlanetTileCard(props) {
  const { owner } = props.tile;
  let body = null;

  function onZoom() {
    props.zoomIn(props.tile);
  }

  if (owner) {
    if (props.children.includes(owner)) {
      body = IslandCard(owner, onZoom);
    } else {
      body = UnknownCard();
    }
  }

  return (
    <Card>
      { body }
    </Card>
  );
}

export default connect(
  (state) => ({
    children: state.world.getIn(['location', 'children']),
  }),
  (dispatch) => ({
    zoomIn: bindActionCreators(zi, dispatch),
  })
)(PlanetTileCard);
