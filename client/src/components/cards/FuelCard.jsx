import React from 'react';
import { connect } from 'react-redux';
import { calculateAffordableTiles } from '../../services/utils.js';
import Card from './Card.jsx';
import HexagonIcon from '../HexagonIcon.jsx';
import FuelIcon from '../FuelIcon.jsx';

const gameInterval = 90;

function FuelCard(props) {
  const { delta, fuelAmount, explorationCost, explorationCostConstant } = props;
  const maxAmount = Math.round(delta * gameInterval);
  const currentAffordableTiles = calculateAffordableTiles(fuelAmount, explorationCost, explorationCostConstant);
  const maxAffordableTiles = calculateAffordableTiles(maxAmount, explorationCost, explorationCostConstant);

  return (
    <Card>
      <p>
        <HexagonIcon />
        {currentAffordableTiles} / {maxAffordableTiles}
      </p>
      <p>
        Production<br />
        <FuelIcon /> {delta} / s
      </p>
      <p>
        Cost / tile<br />
        <FuelIcon /> {explorationCost} + {explorationCostConstant}
      </p>
    </Card>
  );
}

export default connect(
  (state) => ({
    delta: state.player.get('fuelDelta'),
    fuelAmount: state.player.get('fuelAmount'),
    explorationCost: state.player.get('explorationCost'),
    explorationCostConstant: state.world.get('explorationCost'),
  })
)(FuelCard);
