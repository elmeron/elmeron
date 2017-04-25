import React from 'react';
import './GemIcon.less';

export default function GemIcon(props) {
  function callRef(ref) {
    if (props.refs) {
      props.refs(ref);
    }
  }

  const color = props.color || '';

  return (
    <i
      className={`fa fa-circle gem-icon ${color}`}
      aria-hidden="true"
      ref={callRef}
    />
  );
}
