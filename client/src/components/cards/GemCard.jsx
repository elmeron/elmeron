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
      {props.gems.map(({ resource, globalAmount, localAmount }, index) =>
        <p key={index}>
          <GemIcon color={resource.toLowerCase()} />
          {localAmount} / {globalAmount}
        </p>
      )}
    </Card>
  );
}

function mapLocalGemsToGlobal(local, global) {
  return global.reduce((result, globalAmount, resource) => {
    const localAmount = local.get(resource) || 0;
    return result.push({ resource, globalAmount, localAmount })
  }, new List());
}

export default connect(
  (state) => ({
    gems: mapLocalGemsToGlobal(
      state.player.get('gems'),
      state.player.get('exploredTiles'),
    ),
  })
)(GemCard);
