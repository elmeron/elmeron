import React from 'react';
import StandardHexagonGrid from './StandardHexagonGrid.jsx';
import GameMenu from './GameMenu.jsx';
import CardWrapper from './cards/CardWrapper.jsx';

export default function GameOverView() {
  return (
    <div className="game-over-view">
      <GameMenu />
      <div className="world-name-label">
        <h1>Elmeron has been found!</h1>
      </div>
      <StandardHexagonGrid backgroundClass="space-background" />
      <CardWrapper />
    </div>
  );
}
