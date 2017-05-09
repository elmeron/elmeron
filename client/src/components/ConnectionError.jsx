import React from 'react';
import { connect } from 'react-redux';
import './ConnectionError.less';
import FullFlexCover from './FullFlexCover.jsx';
import LoadingCog from './LoadingCog.jsx';

function ConnectionError(props) {
  const { connected, connecting, error } = props;

  if (connected && !error) {
    return null;
  }

  let message = <p>Could not reconnect</p>;

  if (connecting) {
    message = (
      <p>
        Trying to reconnect
        <LoadingCog />
      </p>
    );
  } else if (error) {
    const m = error.type || error;
    message = <p>{m}</p>;
  }

  return (
    <FullFlexCover customClassName="connection-error">
      <h1>Lost connection to server</h1>
      {message}
    </FullFlexCover>
  );
}

export default connect(
  (state) => ({
    connected: state.elmeron.get('connected'),
    connecting: state.elmeron.get('connecting'),
    error: state.elmeron.get('error'),
  })
)(ConnectionError);
