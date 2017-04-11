import React from 'react';
import HexagonGrid from './HexagonGrid.jsx';

export default function LoadGameView() {
  return (
    <div className="game-over-view">
      <div className="world-name-label">
        <h1>Elmeron has been found!</h1>
      </div>
      <HexagonGrid />
    </div>
  );
}
