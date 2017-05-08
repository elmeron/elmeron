import React from 'react';
import './LobbyView.less';

export default function LobbyView() {
  return (
    <div className="lobby">
      <i className="fa fa-cog fa-spin fa-3x"/>
      <h1>Waiting for game to start...</h1>
    </div>
  );
}
