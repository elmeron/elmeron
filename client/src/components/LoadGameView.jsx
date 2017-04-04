import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import elmeron from '../services/elmeron';
import { showGameView } from '../ducks/ui.js';
import { setTiles } from '../ducks/world.js';

function LoadGameView(props) {
  elmeron.on('getTiles', (tiles) => {
    props.setTilesInStore(tiles);
    props.gameView();
  });
  elmeron.startGame('Test person');
  elmeron.getTiles();

  return (
    <div className="loading-game-view">
      LOADING
    </div>
  );
}

LoadGameView.PropTypes = {
  gameView: PropTypes.func.isRequired,
  setTilesInStore: PropTypes.func.isRequired,
};

export default connect(
  () => ({}),
  dispatch => ({
    gameView: bindActionCreators(showGameView, dispatch),
    setTilesInStore: bindActionCreators(setTiles, dispatch),
  })
)(LoadGameView);
