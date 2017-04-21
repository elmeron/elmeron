import React from 'react';
import { connect } from 'react-redux';
import './ResourceMonitor.less';
import { getFuelAmount } from '../services/utils.js';

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

  render() {
    return (
      <div className="resource-monitor">
        <p>
          <i className="fa fa-tint" aria-hidden="true"></i>
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
  })
)(ResourceMonitor);
