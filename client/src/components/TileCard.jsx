import React, { PropTypes } from 'react';
import Card from './Card.jsx';

export default function TileCard(props) {
  const { resource } = props.tile;
  const name = resource.charAt(0).toUpperCase() + resource.slice(1);

  return (
    <Card>
      <h1>{name}</h1>
    </Card>
  );
}

TileCard.PropTypes = {
  tile: PropTypes.object.isRequired,
};
