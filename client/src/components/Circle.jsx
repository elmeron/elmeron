import React from 'react';

export default function Circle(props) {
  const { center, radius, customClassName } = props;
  const { x, y } = center || { x: 0, y: 0 };

  return (
    <circle
      cx={x}
      cy={y}
      r={radius}
      className={customClassName}
    />
  );
}
