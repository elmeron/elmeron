/* eslint-disable */
import React, { PropTypes } from 'react';
/* eslint-enable */
import { connect } from 'react-redux';
import GameView from './GameView.jsx';
import LoadGameView from './LoadGameView.jsx';

const componentMapping = {
  game: <GameView />,
  loadGame: <LoadGameView />,
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
