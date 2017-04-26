import React from 'react';
import { connect } from 'react-redux';
import IslandGrid from './IslandGrid.jsx';
import PlanetGrid from './PlanetGrid.jsx';
import SpaceGrid from './SpaceGrid.jsx';
import BuildableGrid from './BuildableGrid.jsx';

const gridMapping = {
  IslandNode: <IslandGrid />,
  PlanetNode: <PlanetGrid />,
  SpaceNode: <SpaceGrid />,
  BuildingRefinery: <BuildableGrid />,
};

function GridDelegate(props) {
  const { nodeType, monitoring } = props;
  const selector = monitoring ? 'BuildingRefinery' : nodeType;
  const component = gridMapping[selector];

  if (component) {
    return component;
  }

  throw new Error(`Node '${nodeType}' is not a defined grid`);
}

export default connect(
  (state) => ({
    nodeType: state.world.get('nodeType'),
    monitoring: state.refinery.get('monitoring'),
  })
)(GridDelegate);
