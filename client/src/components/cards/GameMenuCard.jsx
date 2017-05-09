import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { leaveGame as lg } from '../../ducks/elmeron.js';
import { showMainMenuView as smmv } from '../../ducks/ui.js';
import Card from './Card.jsx';

function GameMenuCard(props) {
  function onLeaveGame() {
    props.leaveGame(() =>
      props.showMainMenuView()
    );
  }

  return (
    <Card>
      <h1>Menu</h1>
      <button onClick={onLeaveGame}>LEAVE GAME</button>
    </Card>
  );
}

export default connect(
  undefined,
  (dispatch) => ({
    leaveGame: bindActionCreators(lg, dispatch),
    showMainMenuView: bindActionCreators(smmv, dispatch),
  })
)(GameMenuCard);
