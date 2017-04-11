import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { explore as ex } from '../../ducks/elmeron.js';

function ExploreButton(props) {
  const { tile, explore } = props;

  function onClick() {
    explore(tile);
  }

  if (tile.resource === 'Unexplored') {
    return (
      <button onClick={onClick}>EXPLORE</button>
    );
  }

  return null;
}

ExploreButton.PropTypes = {
  tile: PropTypes.object.isRequired,
  explore: PropTypes.func.isRequired,
};

export default connect(
  () => ({}),
  (dispatch) => ({
    explore: bindActionCreators(ex, dispatch),
  })
)(ExploreButton);
