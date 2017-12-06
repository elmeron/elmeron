import React from 'react';
import { connect } from 'react-redux';
import { getFuelAmount } from '../../services/utils.js';
import './RefineryCard.less';
import Card from './Card.jsx';
import GemIcon from '../GemIcon.jsx';
import FuelIcon from '../FuelIcon.jsx';

const timeUnit = 1000;

class RefineryCard extends React.PureComponent {
  componentWillMount() {
    const { offset } = this.props.tile.resource;
    this.state = { amount: offset };
  }

  componentDidMount() {
    // this.timer = setInterval(() => this.tick(), 100);
  }

  componentWillUnmount() {
    // clearInterval(this.timer);
  }

  getTile() {
    const { q, r } = this.props.tile;
    return this.props.tiles.get(`${q},${r}`).toJS();
  }

  tick() {
    const tile = this.getTile();
    const { delta, deltaStart, offset } = tile.resource;
    const now = Date.now();

    this.setState({
      amount: getFuelAmount(delta, deltaStart, offset, timeUnit, now),
    });
  }

  render() {
    const { owner, resource } = this.getTile();
    const { delta } = owner;
    const { name } = resource;
    const { amount } = this.state;
    const color = name.toLowerCase();
    const productionRate = amount > 0 ? delta : 0;

    return (
      <Card>
        <div className="refinery-card">
          <h1>Refinery</h1>
          { /*
          <p>
            <GemIcon color={color} />
            {amount}
          </p>
          */ }
          <p>
            <FuelIcon /> {productionRate} / s
            { /*
            <span className="ratio-colon">:</span>
            <GemIcon color={color} />
            1
            */ }
          </p>
        </div>
      </Card>
    );
  }
}

export default connect(
  (state) => ({
    tiles: state.world.get('tiles'),
  })
)(RefineryCard);
