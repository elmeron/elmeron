import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import time from '../services/time.js';
import { calculateAffordableTiles } from '../services/utils.js';
import { openCard as open } from '../ducks/card.js';
import './ResourceMonitor.less';
import FuelCard from './cards/FuelCard.jsx';
import FuelIcon from './FuelIcon.jsx';
import GemIcon from './GemIcon.jsx';
import GemCard from './cards/GemCard.jsx';
import HexagonIcon from './HexagonIcon.jsx';

const timeUnit = 1000;

class ResourceMonitor extends React.PureComponent {
  calculateAffordableTiles(amount) {
    const { explorationCost: x, explorationCostConstant: y } = this.props;
    const xy = x / y;

    // calculated analytically
    return Math.floor(0.5 - xy + Math.sqrt(xy * (xy - 1) + 0.25 + 2 * amount / y));
  }

  onFuelClick() {
    this.props.openCard(this.fuelIcon, <FuelCard />, 'down');
  }

  onGemClick() {
    this.props.openCard(this.gemIcon, <GemCard />, 'down');
  }

  render() {
    const { fuelAmount, explorationCost, explorationCostConstant } = this.props;
    const affordableTiles = calculateAffordableTiles(fuelAmount, explorationCost, explorationCostConstant);

    return (
      <div className="resource-monitor">
        <p onClick={() => this.onGemClick()} className="gem-monitor">
          <GemIcon refs={(r) => { this.gemIcon = r; }} />
          {this.props.gems}
        </p>
        <p onClick={() => this.onFuelClick()} className="fuel-monitor">
          <HexagonIcon refs={(r) => { this.fuelIcon = r; }} />
          {affordableTiles}
        </p>
      </div>
    );
  }
}

function countGems(gems) {
  return gems.reduce((result, amount) => {
    let r = result;
    r += amount;
    return r;
  }, 0);
}

export default connect(
  (state) => ({
    fuelAmount: state.player.get('fuelAmount'),
    gems: countGems(state.player.get('gems')),
    explorationCost: state.player.get('explorationCost'),
    explorationCostConstant: state.world.get('explorationCost'),
  }),
  (dispatch) => ({
    openCard: bindActionCreators(open, dispatch),
  })
)(ResourceMonitor);
