import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { calculateExtremes } from '../ducks/grid.js';
import HexagonGrid from './HexagonGrid.jsx';

class GameView extends React.PureComponent {
  componentWillMount() {
    const { tiles, zoom, calcExtremes } = this.props;
    calcExtremes(tiles, zoom);
  }

  render() {
    return (
      <div className="game-view">
        <HexagonGrid />
      </div>
    );
  }
}

export default connect(
  (state) => ({
    tiles: state.tiles.toIndexedSeq().toJS(),
    zoom: state.grid.get('zoom'),
  }),
  (dispatch) => ({
    calcExtremes: bindActionCreators(calculateExtremes, dispatch),
  })
)(GameView);
