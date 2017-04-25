import React from 'react';
import Card from './Card.jsx';
import FuelIcon from '../FuelIcon.jsx';

export default function RefineryCard(props) {
  console.log(props);

  return (
    <Card>
      <h1>Refinery</h1>
      <p>
        <FuelIcon />
        {props.tile.owner.delta}
      </p>
    </Card>
  );
}
