import React from 'react';
import { connect } from 'react-redux';
import Card from './Card.jsx';
import FuelIcon from '../FuelIcon.jsx';

function FuelCard(props) {
  return (
    <Card>
      <p>
        <FuelIcon />
        {props.delta} / s
      </p>
    </Card>
  );
}

export default connect(
  (state) => ({
    delta: state.player.getIn(['fuel', 'delta']),
  })
)(FuelCard);
