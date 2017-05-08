import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { showGameView as sgw } from '../ducks/ui.js';
import './LobbyView.less';

const WAIT_SECONDS = 3;

class LobbyCountdownView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { count: WAIT_SECONDS };
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      const { count } = this.state;

      if (this.interval && count <= 1) {
        clearInterval(this.interval);
        this.props.showGameView();
      } else {
        this.setState({ count: count - 1 });
      }
    }, 1000);
  }

  render() {
    const { count } = this.state;

    return (
      <div className="lobby">
        <h1>Game start in {count}...</h1>
      </div>
    );
  }
}

export default connect(
  undefined,
  (dispatch) => ({
    showGameView: bindActionCreators(sgw, dispatch),
  })
)(LobbyCountdownView);
