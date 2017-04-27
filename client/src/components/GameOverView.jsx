import React from 'react';
import StandardHexagonGrid from './StandardHexagonGrid.jsx';

export default function LoadGameView() {
  return (
    <div className="game-over-view">
      <div className="world-name-label">
        <h1>Elmeron has been found!</h1>
      </div>
      <StandardHexagonGrid backgroundClass="space-background" />
    </div>
  );
}
