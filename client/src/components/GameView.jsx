import React from 'react';
import './GameView.less';
import GridDelegate from './GridDelegate.jsx';
import CardWrapper from './cards/CardWrapper.jsx';

export default function GameView(props) {
  return (
    <div className="game-view">
      <GridDelegate />
      <CardWrapper />
    </div>
  );
}
