import React, { PropTypes } from 'react';
import './Hexagon.less';
import { Range as range } from 'immutable';
import { roundPathCorners } from '../services/rounding-corners.js';
import config from '../../config.js';

export default function Hexagon(props) {
  function hexCorner(i) {
    const { center } = props;
    const size = props.size || config.tiles.size;
    const { x, y } = center || { x: 0, y: 0 };
    const angleDeg = 60 * i;
    const angleRad = Math.PI / 180 * angleDeg;

    return {
      x: x + size * Math.cos(angleRad),
      y: y + size * Math.sin(angleRad),
    };
  }

  function path() {
    const d = ['M'];

    range(0, 6).forEach((i) => {
      const { x, y } = hexCorner(i);

      d.push(x.toFixed(2));
      d.push(y.toFixed(2));
      d.push('L');
    });

    d.pop();
    d.push('Z');

    return d.join(' ');
  }

  const d = roundPathCorners(path(), 0.1, true);
  const type = props.type.name || '';
  const customClassName = props.customClassName || '';

  return (
    <path
      d={d}
      className={`hexagon ${type.toLowerCase()} ${customClassName}`}
      onClick={e => props.onClick(e.target)}
    />
  );
}

Hexagon.PropTypes = {
  center: PropTypes.object.isRequired,
  type: PropTypes.string,
  onClick: PropTypes.func,
};
