import React from 'react';
import FullFlexCover from './FullFlexCover.jsx';
import LoadingCog from './LoadingCog.jsx';

export default function LobbyView() {
  return (
    <FullFlexCover>
      <LoadingCog size="3x" />
      <h1>Waiting for game to start...</h1>
    </FullFlexCover>
  );
}
