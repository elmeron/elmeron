import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import './CardWrapper.less';

function CardWrapper(props) {
  function calculateX(anchor) {
    const { left, width } = anchor;

    return left + width;
  }

  function calculateY(anchor, height) {
    const { top, height: anchorHeight } = anchor;

    return top + (anchorHeight / 2) - (height / 2);
  }

  function calculateArrowY(height) {
    return (height / 2) - 10;
  }

  if (props.open) {
    const { anchor, component, height } = props;

    const style = {
      left: calculateX(anchor),
      top: calculateY(anchor, height),
    };
    const arrowStyle = {
      top: calculateArrowY(height),
    };

    return (
      <div
        className="card-wrapper"
        style={style}
      >
        <div className="card-arrow" style={arrowStyle} />
        {component}
      </div>
    );
  }

  return null;
}

CardWrapper.PropTypes = {
  open: PropTypes.bool.isRequired,
  component: PropTypes.element.isRequired,
  anchor: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

export default connect(
  (state) => ({
    open: state.card.get('open'),
    component: state.card.get('component'),
    anchor: state.card.get('anchor').toJS(),
    width: state.card.get('width'),
    height: state.card.get('height'),
  })
)(CardWrapper);
