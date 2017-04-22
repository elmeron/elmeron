import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import './CardWrapper.less';

const UP = 'up';
const RIGHT = 'right';
const DOWN = 'down';
const LEFT = 'left';

const margin = 15;
const arrowMargin = 10;

function CardWrapper(props) {
  function calculateDirection(anchor, width, height, screenWidth, screenHeight) {
    const { top, left, width: anchorWidth, height: anchorHeight } = anchor;
    const spaceAbove = top;
    const spaceRight = screenWidth - left - anchorWidth;
    const spaceBelow = screenHeight - top - anchorHeight;
    const spaceLeft = left;

    if (spaceRight > width) {
      return RIGHT;
    }
    if (spaceLeft > width) {
      return LEFT;
    }
    if (spaceAbove > height) {
      return UP;
    }
    if (spaceBelow > height) {
      return DOWN;
    }

    return RIGHT;
  }

  function calculateX(anchor, width, direction = RIGHT) {
    const { left, width: anchorWidth } = anchor;

    if (direction === UP || direction == DOWN) {
      return (left + (anchorWidth / 2)) - (width / 2);
    }
    if (direction === RIGHT) {
      return left + anchorWidth + margin;
    }
    if (direction === LEFT) {
      return left - width - margin;
    }

    throw new Error(`Unknown card direction: '${direction}'`);
  }

  function calculateY(anchor, height, direction = RIGHT) {
    const { top, height: anchorHeight } = anchor;

    if (direction === UP) {
      return top - height - margin - 5; // not sure why 5
    }
    if (direction === RIGHT || direction === LEFT) {
      return top + (anchorHeight / 2) - (height / 2);
    }
    if (direction === DOWN) {
      return top + anchorHeight + margin;
    }

    throw new Error(`Unknown card direction: '${direction}'`);
  }

  function calculateArrowX(width, direction = RIGHT) {
    if (direction === UP || direction === DOWN) {
      return (width / 2) - arrowMargin;
    }
    if (direction === RIGHT) {
      return -arrowMargin;
    }
    if (direction === LEFT) {
      return width;
    }

    throw new Error(`Unknown card direction: '${direction}'`);
  }

  function calculateArrowY(height, direction) {
    if (direction === UP) {
      return height + 5; // not sure why 5
    }
    if (direction === RIGHT || direction == LEFT) {
      return (height / 2) - arrowMargin;
    }
    if (direction === DOWN) {
      return -arrowMargin;
    }

    throw new Error(`Unknown card direction: '${direction}'`);
  }

  if (props.open) {
    const { anchor,
            component,
            width,
            height,
            direction: dir,
            screenWidth,
            screenHeight } = props;
    let direction = dir;

    if (!direction) {
      direction = calculateDirection(anchor, width, height, screenWidth, screenHeight);
    }

    const style = {
      left: calculateX(anchor, width, direction),
      top: calculateY(anchor, height, direction),
    };
    const arrowStyle = {
      top: calculateArrowY(height, direction),
      left: calculateArrowX(width, direction),
    };
    const arrowClassName = `card-arrow arrow-${direction}`;

    return (
      <div
        className="card-wrapper"
        style={style}
      >
        <div className={arrowClassName} style={arrowStyle} />
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
  direction: PropTypes.string.isRequired,
  screenWidth: PropTypes.number.isRequired,
  screenHeight: PropTypes.number.isRequired,
};

export default connect(
  (state) => ({
    open: state.card.get('open'),
    component: state.card.get('component'),
    anchor: state.card.get('anchor').toJS(),
    width: state.card.get('width'),
    height: state.card.get('height'),
    direction: state.card.get('direction'),
    screenWidth: state.ui.get('screenWidth'),
    screenHeight: state.ui.get('screenHeight'),
  })
)(CardWrapper);
