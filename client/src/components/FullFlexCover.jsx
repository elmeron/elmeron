import React from 'react';
import './FullFlexCover.less';

export default function FullFlexCover(props) {
  const customClassName = props.customClassName || '';
  return (
    <div className={`full-flex-cover ${customClassName}`}>
      {props.children}
    </div>
  );
}
