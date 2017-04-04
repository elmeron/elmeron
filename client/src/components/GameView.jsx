import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { calculateExtremes } from '../ducks/grid.js';
import { openCard as open, closeCard as close } from '../ducks/card.js';
import './GameView.less';
import CardWrapper from './CardWrapper.jsx';
import HexagonGrid from './HexagonGrid.jsx';
import TileCard from './TileCard.jsx';

class GameView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onBackgroundClick = this.onBackgroundClick.bind(this);
    this.onHexClick = this.onHexClick.bind(this);
  }

  componentWillMount() {
    const { tiles, calcExtremes } = this.props;
    calcExtremes(tiles);
  }

  onBackgroundClick() {
    this.props.closeCard();
  }

  onHexClick(element, hex) {
    const { left, top, width, height } = element.getBoundingClientRect();

    this.props.openCard({ left, top, width, height }, <TileCard tile={hex} />);
  }

  render() {
    return (
      <div className="game-view">
        <HexagonGrid
          onBackgroundClick={this.onBackgroundClick}
          onHexClick={this.onHexClick}
        />
        <CardWrapper />
      </div>
    );
  }
}

export default connect(
  (state) => ({
    tiles: state.world.get('tiles').toJS(),
  }),
  (dispatch) => ({
    calcExtremes: bindActionCreators(calculateExtremes, dispatch),
    openCard: bindActionCreators(open, dispatch),
    closeCard: bindActionCreators(close, dispatch),
  })
)(GameView);
