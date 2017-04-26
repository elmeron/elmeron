import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setCardDimension } from '../../ducks/card.js';
import './Card.less';

// this must be synced with the .less file
const margin = 15;

class Card extends React.PureComponent {
  redimension(props) {
    const { dimension } = props;
    const { width, height } = this.ref.getBoundingClientRect();

    dimension(width + (2 * margin), height + (2 * margin));
  }

  componentDidMount() {
    this.redimension(this.props);
  }

  componentDidUpdate() {
    this.redimension(this.props);
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
  undefined,
  (dispatch) => ({
    dimension: bindActionCreators(setCardDimension, dispatch),
  })
)(Card);
