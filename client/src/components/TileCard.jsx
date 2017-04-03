import React, { PropTypes } from 'react';
import Card from './Card.jsx';

export default function TileCard(props) {
  const { type } = props.tile;
  const name = type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <Card>
      <h1>{name}</h1>
    </Card>
  );
}

TileCard.PropTypes = {
  tiles: PropTypes.object.isRequired,
};
