import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { zoomOut as zo } from '../ducks/elmeron.js';
import './WorldNameLabel.less';

function WorldNameLabel(props) {
  const { name, zoomOut } = props;
  const properName = name.replace(/\w\S*/g, (txt) => {
    const t = txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    return t;
  });

  function onClick() {
    zoomOut();
  }

  return (
    <div className="world-name-label">
      <h1 onClick={onClick}>{properName}</h1>
    </div>
  );
}

export default connect(
  (state) => ({
    name: state.world.getIn(['location', 'current']),
  }),
  (dispatch) => ({
    zoomOut: bindActionCreators(zo, dispatch),
  })
)(WorldNameLabel);
