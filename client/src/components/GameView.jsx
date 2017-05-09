import React from 'react';
import './GameView.less';
import WorldNameLabel from './WorldNameLabel.jsx';
import ResourceMonitor from './ResourceMonitor.jsx';
import GridDelegate from './GridDelegate.jsx';
import CardWrapper from './cards/CardWrapper.jsx';
import ConnectionError from './ConnectionError.jsx';
import GameMenu from './GameMenu.jsx';

export default function GameView(props) {
  return (
    <div className="game-view">
      <ConnectionError />
      <GameMenu />
      <WorldNameLabel />
      <ResourceMonitor />
      <GridDelegate />
      <CardWrapper />
    </div>
  );
}
