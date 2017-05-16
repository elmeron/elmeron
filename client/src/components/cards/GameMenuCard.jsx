import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { leaveGame as lg } from '../../ducks/elmeron.js';
import { showMainMenuView as smmv } from '../../ducks/ui.js';
import './GameMenuCard.less';
import Card from './Card.jsx';
import PlayerIcon from '../PlayerIcon.jsx';

function PlayerListItem(player) {
  const { nickname, online } = player;
  const className = online ?
    'online' : 'offline fa-user-times'

  return (
    <p key={nickname}>
      <PlayerIcon customClassName={className} />
      {nickname}
    </p>
  );
}

function PlayerList(players) {
  return (
    <div className="players-list">
      {players.map((player, index) =>
        PlayerListItem(player)
      )}
    </div>
  );
}

function GameMenuCard(props) {
  function onLeaveGame() {
    props.leaveGame().then(() =>
      props.showMainMenuView()
    );
  }

  return (
    <Card customClassName="game-menu-card">
      <h1>Menu</h1>
      {PlayerList(props.players)}
      <button onClick={onLeaveGame}>LEAVE GAME</button>
    </Card>
  );
}

function getOtherPlayers(players, nickname) {
  return players.filterNot(player => player.get('nickname') === nickname);
}

export default connect(
  (state) => ({
    nickname: state.elmeron.get('nickname'),
    players: getOtherPlayers(
      state.elmeron.get('players'),
      state.elmeron.get('nickname')
    ).toJS(),
  }),
  (dispatch) => ({
    leaveGame: bindActionCreators(lg, dispatch),
    showMainMenuView: bindActionCreators(smmv, dispatch),
  })
)(GameMenuCard);
