import React, { PropTypes } from 'react';
import Card from './Card.jsx';
import UnexploredCardBody from './UnexploredCardBody.jsx';

function createUnexploredCardBody(tile) {
  return <UnexploredCardBody tile={tile} />;
}

const bodyMapping = {
  Unexplored: createUnexploredCardBody,
};

export default function TileCard(props) {
  const { resource } = props.tile;
  const name = resource.charAt(0).toUpperCase() + resource.slice(1);

  function getBody(tile) {
    const body = bodyMapping[tile.resource];
    if (body) {
      return body(tile);
    }
    return null;
  }

  return (
    <Card>
      <h1>{name}</h1>
      {getBody(props.tile)}
    </Card>
  );
}

TileCard.PropTypes = {
  tile: PropTypes.object.isRequired,
};
