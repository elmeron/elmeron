import React from 'react';
import { connect } from 'react-redux';
import { getFuelAmount } from '../../services/utils.js';
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
    this.timer = setInterval(() => this.tick(), 100);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
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

    return (
      <Card>
        <h1>Refinery</h1>
        <p>
          <GemIcon color={name.toLowerCase()} />
          {amount}
        </p>
        <p>
          <FuelIcon />
          {delta} / s
        </p>
      </Card>
    );
  }
}

export default connect(
  (state) => ({
    tiles: state.world.get('tiles'),
  })
)(RefineryCard);
