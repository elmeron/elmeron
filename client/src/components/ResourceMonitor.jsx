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

const timeUnit = 1000;

class ResourceMonitor extends React.PureComponent {
  componentWillMount() {
    this.state = { amount: 0 };
  }

  componentDidMount() {
    this.timer = setInterval(() => this.tick(), 100);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  tick() {
    const { delta, deltaStart, offset, nextGemGeneration } = this.props;
    const now = time.now();

    this.setState({
      amount: getFuelAmount(delta, deltaStart, offset, timeUnit, now),
    });
  }

  onFuelClick() {
    this.props.openCard(this.fuelIcon, <FuelCard />, 'down');
  }

  onGemClick() {
    this.props.openCard(this.gemIcon, <GemCard />, 'down');
  }

  render() {
    return (
      <div className="resource-monitor">
        <p onClick={() => this.onGemClick()} className="gem-monitor">
          <GemIcon refs={(r) => { this.gemIcon = r; }} />
          {this.props.gems}
        </p>
        <p onClick={() => this.onFuelClick()} className="fuel-monitor">
          <FuelIcon refs={(r) => { this.fuelIcon = r; }} />
          {this.props.explorationCost} / {this.state.amount}
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
  }),
  (dispatch) => ({
    openCard: bindActionCreators(open, dispatch),
  })
)(ResourceMonitor);
