import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { openCard as open } from '../ducks/card.js';
import { zoomOut as zo } from '../ducks/elmeron.js';
import './WorldNameLabel.less';
import WorldNameLabelCard from './cards/WorldNameLabelCard.jsx';

function WorldNameLabel(props) {
  const { name, nodeType, zoomOut } = props;

  function onClick({ target }) {
    props.openCard(target, <WorldNameLabelCard />, 'down');
  }

  return (
    <div className="world-name-label">
      <h1 onClick={onClick}>{name}</h1>
    </div>
  );
}

export default connect(
  (state) => ({
    name: state.world.getIn(['location', 'current']),
    nodeType: state.world.get('nodeType') || '',
  }),
  (dispatch) => ({
    openCard: bindActionCreators(open, dispatch),
    zoomOut: bindActionCreators(zo, dispatch),
  })
)(WorldNameLabel);
