import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { buildRefinery as br } from '../../ducks/elmeron.js';
import Card from './Card.jsx';

function IslandTileCard(props) {
  const { name } = props.tile.resource;

  function onBuild() {
    props.buildRefinery([props.tile]);
  }

  return (
    <Card>
      <h1>{name}</h1>
      <button onClick={onBuild}>REFINE</button>
    </Card>
  );
}

IslandTileCard.PropTypes = {
  tile: PropTypes.object.isRequired,
};

export default connect(
  (state) => ({}),
  (dispatch) => ({
    buildRefinery: bindActionCreators(br, dispatch),
  })
)(IslandTileCard);
