import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import MainMenuView from './MainMenuView.jsx';
import LobbyView from './LobbyView.jsx';
import GameView from './GameView.jsx';
import LoadGameView from './LoadGameView.jsx';
import GameOverView from './GameOverView.jsx';

const componentMapping = {
  mainMenu: <MainMenuView />,
  lobby: <LobbyView />,
  game: <GameView />,
  loadGame: <LoadGameView />,
  gameOver: <GameOverView />,
};

function ViewDelegate(props) {
  const { view } = props;
  const component = componentMapping[view];

  if (component) {
    return component;
  }

  throw new Error(`Component '${view}' is not a defined view`);
}

ViewDelegate.PropTypes = {
  view: PropTypes.element.isRequired,
};

export default connect(
  (state) => ({
    view: state.ui.get('view'),
  })
)(ViewDelegate);
