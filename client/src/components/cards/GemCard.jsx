import { List } from 'immutable';
import React from 'react';
import { connect } from 'react-redux';
import Card from './Card.jsx';
import GemIcon from '../GemIcon.jsx';

function GemCard(props) {
  if (props.gems.isEmpty()) {
    return <Card><p>Empty</p></Card>
  }

  return (
    <Card>
      {props.gems.map(({ amount, resource }, index) =>
        <p key={index}>
          <GemIcon color={resource.toLowerCase()} />
          {amount}
        </p>
      )}
    </Card>
  );
}

export default connect(
  (state) => ({
    gems: state.player.get('gems').reduce((result, amount, resource) =>
      result.push({ amount, resource })
    , new List()),
  })
)(GemCard);
