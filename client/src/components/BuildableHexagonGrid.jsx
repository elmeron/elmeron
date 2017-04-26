import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import HexagonGrid from './HexagonGrid.jsx';
import StandardHexagonGroup from './StandardHexagonGroup.jsx';
import Hexagon from './Hexagon.jsx';

function BuildableGrid(props) {
  return (
    <div className="buildable-grid">
      <HexagonGrid>
        <StandardHexagonGroup hexagons={props.hexagons} onHexClick={onHexClick} />
      </HexagonGrid>
    </div>
  );
}

export default connect(
  (state) => ({}),
  (dispatch) => ({})
)(BuildableGrid);
