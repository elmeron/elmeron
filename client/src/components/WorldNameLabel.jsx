import React from 'react';
import { connect } from 'react-redux';
import elmeron from '../services/elmeron/index.js';
import './WorldNameLabel.less';

function WorldNameLabel(props) {
  const { name } = props;
  const properName = name.replace(/\w\S*/g, (txt) => {
    const t = txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    return t;
  });

  function onClick() {
    elmeron.zoomOut();
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
  })
)(WorldNameLabel);
