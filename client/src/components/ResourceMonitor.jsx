import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getFuelAmount } from '../services/utils.js';
import { openCard as open } from '../ducks/card.js';
import './ResourceMonitor.less';
import FuelCard from './cards/FuelCard.jsx';
import FuelIcon from './FuelIcon.jsx';

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
    const { delta, deltaStart, offset } = this.props;
    const now = Date.now();

    this.setState({ amount: getFuelAmount(delta, deltaStart, offset, timeUnit, now) });
  }

  onClick() {
    this.props.openCard(this.fuelIcon, <FuelCard delta={this.props.delta}/>, 'down');
  }

  render() {
    return (
      <div className="resource-monitor">
        <p onClick={e => this.onClick(e)} className="fuel-monitor">
          <FuelIcon refs={(r) => { this.fuelIcon = r; }}/>
          {this.state.amount}
        </p>
      </div>
    );
  }
}

export default connect(
  (state) => ({
    delta: state.player.getIn(['fuel', 'delta']),
    deltaStart: state.player.getIn(['fuel', 'deltaStart']),
    offset: state.player.getIn(['fuel', 'offset']),
  }),
  (dispatch) => ({
    openCard: bindActionCreators(open, dispatch),
  })
)(ResourceMonitor);
