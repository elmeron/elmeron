import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import time from '../services/time.js';
import { openCard as open } from '../ducks/card.js';
import { zoomOut as zo } from '../ducks/elmeron.js';
import './WorldNameLabel.less';
import WorldNameLabelCard from './cards/WorldNameLabelCard.jsx';

class WorldNameLabel extends React.PureComponent {
  componentWillMount() {
    this.state = { minutes: 0, seconds: 0 };
  }

  componentDidMount() {
    this.timer = setInterval(() => this.tick(), 500);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer = undefined;
  }

    /*
  componentDidUpdate() {
    if (this.props.nextGemGeneration && !this.timer) {
      this.timer = setInterval(() => this.tick(), 500);
    }
  }
  */

  tick() {
    const { nextTick } = this.props;
    const now = time.now();
    const duration = moment.duration(nextTick - now);

    this.setState({
      minutes: duration.get('minutes'),
      seconds: duration.get('seconds'),
    });
  }

  onClick({ target }) {
    this.props.openCard(target, <WorldNameLabelCard />, 'down');
  }

  render() {
    const { name, nodeType, zoomOut } = this.props;
    const { minutes, seconds } = this.state;
    const minStr = minutes < 10 ? `0${minutes}` : minutes;
    const secStr = seconds < 10 ? `0${seconds}` : seconds;
    const timeStr = `${minStr} : ${secStr}`;

    return (
      <div className="world-name-label">
        <h1 onClick={(e) => this.onClick(e)}>{name}</h1>
        <div>
          <p className="timer">{timeStr}</p>
        </div>
      </div>
    );
  }
}

export default connect(
  (state) => ({
    name: state.world.getIn(['location', 'current']),
    nodeType: state.world.get('nodeType') || '',
    nextTick: state.elmeron.get('nextTick'),
  }),
  (dispatch) => ({
    openCard: bindActionCreators(open, dispatch),
    zoomOut: bindActionCreators(zo, dispatch),
  })
)(WorldNameLabel);
