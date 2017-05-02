import { Set, List } from 'immutable';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { calculateRefineryCost, calculateRefineryProduction } from '../../services/refinery.js';
import { closeCard as close } from '../../ducks/card.js';
import { buildRefinery as br } from '../../ducks/elmeron.js';
import { stopMonitoring as sm } from '../../ducks/refinery.js';
import './BuildRefineryCard.less';
import Card from './Card.jsx';
import FuelIcon from '../FuelIcon.jsx';
import GemIcon from '../GemIcon.jsx';

const availableTypes = new Set(['Forest', 'Rock', 'Sand']);

function cannotAffordBody(amount, available) {
  if (available < amount) {
    return <span className="message">({available})</span>
  }

  return null;
}

function costBody(cost, available) {
  const isFree = cost.isEmpty() || cost.every(({ amount }) => amount === 0);

  if (isFree) {
    return <p>Free</p>;
  }

  return (
    <div className="cost-body">
      {cost.map(({ amount, resource }, index) => {
        const availableGem = available.get(resource) || 0;

        return (
          <p key={index}>
            -
            <GemIcon color={resource.toLowerCase()} />
            {amount}
            {cannotAffordBody(amount, availableGem)}
          </p>
        );
      })}
    </div>
  );
}

function BuildRefineryCard(props) {
  function onBuild() {
    props.buildRefinery(props.selectedTiles.toArray());
  }

  function onCancel() {
    props.stopMonitoring();
  }

  const costMap = calculateRefineryCost(props.selectedTiles, availableTypes);
  const cost = costMap
    .reduce((result, amount, resource) => result.push({ amount, resource }), new List());
  const production = calculateRefineryProduction(props.selectedTiles, availableTypes);
  const cannotAfford = costMap.some((amount, resource) =>
    !props.gems.get(resource) || props.gems.get(resource) < amount
  );

  return (
    <Card>
      <div className="build-refinery-card">
        <h1>Build Refinery</h1>
        <p>
          +
          <FuelIcon />
          {`${production} / s`}
        </p>
        {costBody(cost, props.gems)}
        <button disabled={cannotAfford} onClick={onBuild}>BUILD</button>
        <button onClick={onCancel}>CANCEL</button>
      </div>
    </Card>
  );
}

export default connect(
  (state) => ({
    selectedTiles: state.refinery.get('selectedTiles'),
    gems: state.player.get('gems'),
  }),
  (dispatch) => ({
    closeCard: bindActionCreators(close, dispatch),
    buildRefinery: bindActionCreators(br, dispatch),
    stopMonitoring: bindActionCreators(sm, dispatch),
  })
)(BuildRefineryCard);
