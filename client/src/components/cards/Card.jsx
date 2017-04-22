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

  componentWillReceiveProps(props) {
    this.redimension(props);
  }

  render() {
    const { children, customClassName } = this.props;
    const customName = customClassName || '';

    return (
      <div
        className={`card ${customClassName}`}
        ref={(r) => { this.ref = r; }}
      >
        {children}
      </div>
    );
  }
}

Card.PropTypes = {
  dimension: PropTypes.func.isRequired,
  customClassName: PropTypes.string,
};

export default connect(
  (state) => ({
    open: state.card.get('open'),
  }),
  (dispatch) => ({
    dimension: bindActionCreators(setCardDimension, dispatch),
  })
)(Card);
