import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setCardDimension } from '../../ducks/card.js';
import './Card.less';

// this must be synced with the .less file
const margin = 15;

class Card extends React.PureComponent {
  componentDidMount() {
    const { dimension } = this.props;
    const { width, height } = this.ref.getBoundingClientRect();

    dimension(width + (2 * margin), height + (2 * margin));
  }

  render() {
    const { children } = this.props;

    return (
      <div
        className="card"
        ref={(r) => { this.ref = r; }}
      >
        {children}
      </div>
    );
  }
}

Card.PropTypes = {
  dimension: PropTypes.func.isRequired,
};

export default connect(
  () => ({}),
  (dispatch) => ({
    dimension: bindActionCreators(setCardDimension, dispatch),
  })
)(Card);
