import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import time from '../services/time.js';
import { getFuelAmount } from '../services/utils.js';
import { openCard as open } from '../ducks/card.js';
import './ResourceMonitor.less';
import FuelCard from './cards/FuelCard.jsx';
import FuelIcon from './FuelIcon.jsx';
import GemIcon from './GemIcon.jsx';
import GemCard from './cards/GemCard.jsx';
import HexagonIcon from './HexagonIcon.jsx';

const timeUnit = 1000;

class ResourceMonitor extends React.PureComponent {
  componentWillMount() {
    this.state = { affordableTiles: 0, timeLeft: 0 };
  }

  componentDidMount() {
    this.timer = setInterval(() => this.tick(), 500);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  calculateAffordableTiles(amount) {
    const { explorationCost: x, explorationCostConstant: y } = this.props;
    const xy = x / y;

    // calculated analytically
    return Math.floor(0.5 - xy + Math.sqrt(xy * (xy - 1) + 0.25 + 2 * amount / y));
  }

  calculateTimeLeft(amount) {
    const { explorationCost: x, explorationCostConstant: y, delta } = this.props;
    const n = this.calculateAffordableTiles(amount);

    // calculated analytically
    const usableAmount = n * x + n * y * ((n - 1) / 2);
    const nonUsableAmount = amount - usableAmount;
    const remainingCost =  x + n * y;

    return Math.round((remainingCost - nonUsableAmount) / delta);
  }

  tick() {
    const { delta, deltaStart, offset, nextGemGeneration, explorationCost } = this.props;
    const now = time.now();
    const amount = getFuelAmount(delta, deltaStart, offset, timeUnit, now);
    const affordableTiles = this.calculateAffordableTiles(amount);
    const timeLeft = this.calculateTimeLeft(amount);

    this.setState({ affordableTiles, timeLeft });
  }

  onFuelClick() {
    this.props.openCard(this.fuelIcon, <FuelCard />, 'down');
  }

  onGemClick() {
    this.props.openCard(this.gemIcon, <GemCard />, 'down');
  }

  makeTimeText() {
    const { timeLeft } = this.state;
    const timeTrunc = timeLeft;

    if (timeTrunc < 60) {
      return `${timeTrunc} s`;
    }

    const minTrunc = Math.floor(timeLeft / 60);

    return `${minTrunc} min`;
  }

  render() {
    const { affordableTiles } = this.state;
    const timeText = this.makeTimeText();
    const fuelText = `${affordableTiles}, ${timeText}`;

    return (
      <div className="resource-monitor">
        <p onClick={() => this.onGemClick()} className="gem-monitor">
          <GemIcon refs={(r) => { this.gemIcon = r; }} />
          {this.props.gems}
        </p>
        <p onClick={() => this.onFuelClick()} className="fuel-monitor">
          <HexagonIcon refs={(r) => { this.fuelIcon = r; }} />
          {fuelText}
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
    delta: state.player.getIn(['fuel', 'delta']),
    deltaStart: state.player.getIn(['fuel', 'deltaStart']),
    offset: state.player.getIn(['fuel', 'offset']),
    gems: countGems(state.player.get('gems')),
    nextGemGeneration: state.world.get('nextGemGeneration'),
    explorationCost: state.player.get('explorationCost'),
    explorationCostConstant: state.world.get('explorationCost'),
  }),
  (dispatch) => ({
    openCard: bindActionCreators(open, dispatch),
  })
)(ResourceMonitor);
