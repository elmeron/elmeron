import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { startGame as sg } from '../ducks/elmeron.js';
import { showLobbyView as slw } from '../ducks/ui.js';
import logo from '../../static/logo.png';
import './MainMenuView.less';
import LoadingCog from './LoadingCog.jsx';

const validNickname = /^[a-z]{4,}$/i;
const explanations = [
  'Psst! Try a nickname with at least 4 word characters.',
  'Maybe a longer nickname will suffice?',
  'Tip: Your nickname should only contain letters.',
];

class MainMenuView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      nickname: '',
      hasPressedPlay: false,
      nonvalidNickname: false,
      bounceExplanationText: false,
      explanation: MainMenuView.getRandomExplanation(),
    };
    this.onLogoClick = this.onLogoClick.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onNicknameChange = this.onNicknameChange.bind(this);
    this.onPlay = this.onPlay.bind(this);
  }

  static getRandomExplanation() {
    return explanations[Math.floor(Math.random() * explanations.length)];
  }

  componentDidUpdate() {
    if (this.nickname) {
      this.nickname.focus();
    }
  }

  onLogoClick() {
    this.setState({ hasPressedPlay: false });
  }

  onNicknameChange({ target }) {
    this.setState({ nickname: target.value });
  }

  bounceMessage(message) {
    const { bounceExplanationText } = this.state;

    if (!bounceExplanationText) {
      setTimeout(() =>
        this.setState({ bounceExplanationText: false })
      , 200); // match this with .less
    }

    this.setState({
      nonvalidNickname: true,
      bounceExplanationText: true,
      explanation: message,
    });
  }

  onSubmit(event) {
    const { nickname } = this.state;

    event.preventDefault();

    if (nickname && validNickname.test(nickname)) {
      this.props.startGame(nickname.trim(), (err) => {
        if (err) {
          this.bounceMessage(err);
        } else {
          this.props.showLobbyView();
        }
      });
    } else {
      this.bounceMessage(MainMenuView.getRandomExplanation());
    }
  }

  nicknameInput() {
    const {
      nickname,
      nonvalidNickname,
      bounceExplanationText,
      explanation,
    } = this.state;
    const bounceClassName = bounceExplanationText ? 'bounce' : '';
    const explanationParagraph = nonvalidNickname ?
      <p>
        <small className={bounceClassName}>
          {explanation}
        </small>
      </p> :
      null;

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
        {nonvalidNickname && explanationParagraph }
      </form>
    );
  }

  onPlay() {
    this.setState({ hasPressedPlay: true });
  }

  playButton() {
    const { connected, connecting } = this.props;
    const loadingClassName = connected ? '' : 'loading';

    return (
      <button
        className={loadingClassName}
        onClick={this.onPlay}
        disabled={!connected}
      >
        Play
        {!connected && connecting &&
          <LoadingCog />
        }
        {!connected && !connecting &&
          <i className="fa fa-times" />
        }
      </button>
    );
  }

  render() {
    const { nickname, hasPressedPlay } = this.state;

    return (
      <div className="main-menu">
        <img onClick={this.onLogoClick} className="logo" src={logo} />
        <div className="play">
        {hasPressedPlay && this.nicknameInput()}
        {!hasPressedPlay && this.playButton()}
        </div>
      </div>
    );
  }
}

export default connect(
  (state) => ({
    connected: state.elmeron.get('connected'),
    connecting: state.elmeron.get('connecting'),
  }),
  (dispatch) => ({
    startGame: bindActionCreators(sg, dispatch),
    showLobbyView: bindActionCreators(slw, dispatch),
  })
)(MainMenuView);
