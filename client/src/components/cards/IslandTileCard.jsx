import React, { PropTypes } from 'react';
import Card from './Card.jsx';
import ExploreButton from './ExploreButton.jsx';

export default function IslandTileCard(props) {
  const { resource } = props.tile;

  return (
    <Card>
      <h1>{resource}</h1>
      <ExploreButton tile={props.tile} />
    </Card>
  );
}

IslandTileCard.PropTypes = {
  tile: PropTypes.object.isRequired,
};
