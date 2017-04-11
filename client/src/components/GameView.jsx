import React from 'react';
import './GameView.less';
import WorldNameLabel from './WorldNameLabel.jsx';
import GridDelegate from './GridDelegate.jsx';
import CardWrapper from './cards/CardWrapper.jsx';

export default function GameView(props) {
  return (
    <div className="game-view">
      <WorldNameLabel />
      <GridDelegate />
      <CardWrapper />
    </div>
  );
}
