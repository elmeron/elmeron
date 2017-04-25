import React from 'react';
import Card from './Card.jsx';
import FuelIcon from '../FuelIcon.jsx';

export default function FuelCard(props) {
  return (
    <Card>
      <p>
        <FuelIcon />
        {props.delta} / s
      </p>
    </Card>
  );
}
