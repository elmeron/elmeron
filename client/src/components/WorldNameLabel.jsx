import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { zoomOut as zo } from '../ducks/elmeron.js';
import { properCase } from '../services/utils.js';
import './WorldNameLabel.less';

function WorldNameLabel(props) {
  const { name, nodeType, zoomOut } = props;
  const properName = properCase(name);
  const type = nodeType.replace('Node', '');
  const label = type === 'Space' ? properName : `${properName} ${type}`;

  function onClick() {
    zoomOut();
  }

  return (
    <div className="world-name-label">
      <h1 onClick={onClick}>{label}</h1>
    </div>
  );
}

export default connect(
  (state) => ({
    name: state.world.getIn(['location', 'current']),
    nodeType: state.world.get('nodeType'),
  }),
  (dispatch) => ({
    zoomOut: bindActionCreators(zo, dispatch),
  })
)(WorldNameLabel);
