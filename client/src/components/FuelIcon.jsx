import React from 'react';
import './FuelIcon.less';

export default function FuelIcon(props) {
  function callRef(ref) {
    if (props.refs) {
      props.refs(ref);
    }
  }

  return (
    <i
      className="fa fa-tint fuel-icon"
      aria-hidden="true"
      ref={callRef}
    />
  );
}
