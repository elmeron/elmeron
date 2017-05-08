import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { startGame as sg } from '../ducks/elmeron.js';
import { showLobbyView as slw } from '../ducks/ui.js';
import logo from '../../static/logo.png';
import './MainMenuView.less';

class MainMenuView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { nickname: '', hasPressedPlay: false };
    this.onSubmit = this.onSubmit.bind(this);
    this.onNicknameChange = this.onNicknameChange.bind(this);
    this.onPlay = this.onPlay.bind(this);
  }

  componentDidUpdate() {
    if (this.nickname) {
      this.nickname.focus();
    }
  }

  onNicknameChange({ target }) {
    this.setState({ nickname: target.value });
  }

  onSubmit(event) {
    event.preventDefault();
    this.props.startGame(this.state.nickname);
    this.props.showLobbyView();
  }

  nicknameInput() {
    const { nickname } = this.state;

    return (
      <form onSubmit={this.onSubmit}>
        <p>Type in your nickname and press Enter to play</p>
        <input
          type="text"
          name="nickname"
          placeholder="Nickname"
          value={nickname}
          onChange={this.onNicknameChange}
          ref={(r) => { this.nickname = r; }}
        />
      </form>
    );
  }

  onPlay() {
    this.setState({ hasPressedPlay: true });
  }

  playButton() {
    return (
      <button onClick={this.onPlay}>Play</button>
    );
  }

  render() {
    const { nickname, hasPressedPlay } = this.state;

    return (
      <div className="main-menu">
        <img className="logo" src={logo} />
        <div className="play">
        {hasPressedPlay && this.nicknameInput()}
        {!hasPressedPlay && this.playButton()}
        </div>
      </div>
    );
  }
}

export default connect(
  undefined,
  (dispatch) => ({
    startGame: bindActionCreators(sg, dispatch),
    showLobbyView: bindActionCreators(slw, dispatch),
  })
)(MainMenuView);
