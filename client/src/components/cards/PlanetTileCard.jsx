import React, { PropTypes } from 'react';
import elmeron from '../../services/elmeron/index.js';
import Card from './Card.jsx';
import ExploreButton from './ExploreButton.jsx';
import ZoomInButton from './ZoomInButton.jsx';

export default function PlanetTileCard(props) {
  const { resource, owner } = props.tile;

  return (
    <Card>
      <h1>{resource}</h1>
      <ZoomInButton tile={props.tile} />
      <ExploreButton tile={props.tile} />
    </Card>
  );
}

PlanetTileCard.PropTypes = {
  tile: PropTypes.object.isRequired,
};
