import React from 'react';
import './PlayerIcon.less';

export default function PlayerIcon(props) {
  const customClassName = props.customClassName || '';

  return (
    <i
      className={`player-icon fa fa-user ${customClassName}`}
    />
  );
}
