import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { openCard as open } from '../ducks/card.js';
import './GameMenu.less';
import GameMenuCard from './cards/GameMenuCard.jsx';

function GameMenu(props) {
  function onClick({ target }) {
    props.openCard(target, <GameMenuCard />, 'up');
  }

  return (
    <div className="game-menu">
      <p onClick={onClick}>MENU</p>
    </div>
  );
}

export default connect(
  undefined,
  (dispatch) => ({
    openCard: bindActionCreators(open, dispatch),
  })
)(GameMenu);
