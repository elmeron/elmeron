import React from 'react';
import { connect } from 'react-redux';
import IslandGrid from './IslandGrid.jsx';
import PlanetGrid from './PlanetGrid.jsx';
import SpaceGrid from './SpaceGrid.jsx';

const gridMapping = {
  IslandNode: <IslandGrid />,
  PlanetNode: <PlanetGrid />,
  SpaceNode: <SpaceGrid />,
};

function GridDelegate(props) {
  const { nodeType } = props;
  const component = gridMapping[nodeType];

  if (component) {
    return component;
  }

  throw new Error(`Node '${nodeType}' is not a defined grid`);
}

export default connect(
  (state) => ({
    nodeType: state.world.get('nodeType'),
  })
)(GridDelegate);
