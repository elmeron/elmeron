import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { calculateRefineryCost, calculateRefineryProduction } from '../../services/hex-util.js';
import { closeCard as close } from '../../ducks/card.js';
import { buildRefinery as br } from '../../ducks/elmeron.js';
import { stopMonitoring as sm } from '../../ducks/refinery.js';
import './BuildRefineryCard.less';
import Card from './Card.jsx';
import FuelIcon from '../FuelIcon.jsx';

function BuildRefineryCard(props) {
  function onBuild() {
    props.buildRefinery(props.selectedTiles.toArray());
  }

  function onCancel() {
    props.stopMonitoring();
  }

  const cost = calculateRefineryCost(props.selectedTiles);
  const production = calculateRefineryProduction(props.selectedTiles);

  return (
    <Card>
      <div className="build-refinery-card">
        <h1>Build Refinery</h1>
        <p>
          +
          <FuelIcon />
          {`${production} / s`}
        </p>
        <p>
          -
          <FuelIcon />
          {cost}
        </p>
        <button onClick={onBuild}>BUILD</button>
        <button onClick={onCancel}>CANCEL</button>
      </div>
    </Card>
  );
}

export default connect(
  (state) => ({
    selectedTiles: state.refinery.get('selectedTiles'),
  }),
  (dispatch) => ({
    closeCard: bindActionCreators(close, dispatch),
    buildRefinery: bindActionCreators(br, dispatch),
    stopMonitoring: bindActionCreators(sm, dispatch),
  })
)(BuildRefineryCard);
