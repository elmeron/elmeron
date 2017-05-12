import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { openCard as open } from '../ducks/card.js';
import './GameMenu.less';
import GameMenuCard from './cards/GameMenuCard.jsx';
import PlayerIcon from './PlayerIcon.jsx';

function GameMenu(props) {
  function onClick({ target }) {
    props.openCard(target, <GameMenuCard />, 'up');
  }

  return (
    <div className="game-menu">
      <p onClick={onClick}>
        <PlayerIcon />
        {props.nickname}
      </p>
    </div>
  );
}

export default connect(
  (state) => ({
    nickname: state.elmeron.get('nickname'),
  }),
  (dispatch) => ({
    openCard: bindActionCreators(open, dispatch),
  })
)(GameMenu);
