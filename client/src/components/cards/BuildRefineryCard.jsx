import { Set, List } from 'immutable';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  calculateRefineryConstant,
  calculateRefineryCost,
  calculateRefineryProduction,
  calculateFuelPrice,
} from '../../services/refinery.js';
import { getFuelAmount } from '../../services/utils.js';
import { closeCard as close } from '../../ducks/card.js';
import { buildRefinery as br } from '../../ducks/elmeron.js';
import { stopMonitoring as sm } from '../../ducks/refinery.js';
import './BuildRefineryCard.less';
import Card from './Card.jsx';
import FuelIcon from '../FuelIcon.jsx';
import GemIcon from '../GemIcon.jsx';

const availableTypes = new Set(['Forest', 'Rock', 'Sand']);

function costBody(cost, available, fuelCost, fuelAmount) {
  const isFree = cost.isEmpty() || cost.every(({ amount }) => amount === 0);

  if (isFree) {
    return <p>Free</p>;
  }

  const shouldPrintFuelCost = fuelCost > 0;
  const cannotAffordFuel = fuelAmount < fuelCost;
  const cannotAffordFuelClass = cannotAffordFuel ? 'cannot-afford' : '';

  return (
    <div className="cost-body">
      { shouldPrintFuelCost &&
        <p>
          -
          <FuelIcon />
          <span className={cannotAffordFuelClass}>{fuelCost}</span>
        </p>
      }
      {cost.map(({ amount, resource }, index) => {
        const availableGem = available.get(resource) || 0;
        const cannotAfford = availableGem < amount;
        let amountClass = '';

        if (cannotAfford) {
          amountClass = 'cannot-afford';
        }

        return (
          <p key={index}>
            -
            <GemIcon color={resource.toLowerCase()} />
            <span className={amountClass}>
              {`${amount} / ${availableGem}`}
            </span>
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

  const refineryConstant = calculateRefineryConstant(props.selectedTiles, availableTypes);
  const costMap = calculateRefineryCost(props.selectedTiles, availableTypes);
  const cost = costMap
    .reduce((result, amount, resource) => result.push({ amount, resource }), new List());
  const production = calculateRefineryProduction(props.selectedTiles, availableTypes);
  const fuelPrice = costMap.reduce((result, amount, resource) => {
    const localAmount = props.localGems.get(resource) || 0;
    const required = Math.max(amount - localAmount, 0);
    const available = props.globalGems.get(resource);
    const price = available > 0 ?
      calculateFuelPrice(production, required, available) :
      0;

    return result + price;
  }, 0);


  const { delta, deltaStart, offset } = props.fuel;
  const availableFuel = getFuelAmount(delta, deltaStart, offset, 1000, Date.now());

  const cannotAfford = costMap.some((amount, resource) =>
    !props.globalGems.get(resource) || props.globalGems.get(resource) < amount
  ) || availableFuel < fuelPrice;

  return (
    <Card>
      <div className="build-refinery-card">
        <h1>Build Refinery</h1>
        <p>
          +
          <FuelIcon />
          {`${production} / s`}
        </p>
        {costBody(cost, props.globalGems, fuelPrice, availableFuel)}
        <button disabled={cannotAfford} onClick={onBuild}>BUILD</button>
        <button onClick={onCancel}>CANCEL</button>
      </div>
    </Card>
  );
}

export default connect(
  (state) => ({
    selectedTiles: state.refinery.get('selectedTiles'),
    localGems: state.player.get('gems'),
    globalGems: state.market,
    fuel: state.player.get('fuel').toJS(),
  }),
  (dispatch) => ({
    closeCard: bindActionCreators(close, dispatch),
    buildRefinery: bindActionCreators(br, dispatch),
    stopMonitoring: bindActionCreators(sm, dispatch),
  })
)(BuildRefineryCard);
