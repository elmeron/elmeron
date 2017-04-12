import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { zoomIn as zi } from '../../ducks/elmeron.js';
import { properCase } from '../../services/utils.js';
import Card from './Card.jsx';
import ExploreButton from './ExploreButton.jsx';

function PlanetCard(owner, onZoom) {
  const name = properCase(owner);

  return (
    <div>
      <h1>{`${name} Planet`}</h1>
      <button onClick={onZoom}>ZOOM IN</button>
    </div>
  );
}

function UnknownCard() {
  return <h1>Unknown Planet</h1>;
}

function SpaceTileCard(props) {
  const { resource, owner } = props.tile;
  let body = null;

  function onZoom() {
    props.zoomIn(props.tile);
  }

  if (owner) {
    if (resource === 'Unknown') {
      body = UnknownCard();
    } else {
      body = PlanetCard(owner, onZoom);
    }
  }

  return (
    <Card>
      {body}
      <ExploreButton tile={props.tile} />
    </Card>
  );
}

export default connect(
  () => ({}),
  (dispatch) => ({
    zoomIn: bindActionCreators(zi, dispatch),
  })
)(SpaceTileCard);
