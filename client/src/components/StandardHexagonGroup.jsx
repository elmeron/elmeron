import React from 'react';
import { hexToPixel } from '../services/hex-util.js';
import Hexagon from './Hexagon.jsx';

export default function StandardHexagonGroup(props) {
  const onHexClick = props.onHexClick || function() {};
  const HexagonComponent = props.hexagonComponent || Hexagon;

  return (
    <g ref={props.refs}>
      {
        props.hexagons.map((hex) => {
          const { q, r, owner } = hex;
          const center = hexToPixel(q, r);
          let type;

          if (owner && owner.type) {
            type = { name: owner.type }; // have to do this because of reasons
          }
          else {
            type = hex.resource;
          }

          return (
            <HexagonComponent
              key={`${q}-${r}`}
              center={center}
              size={props.size}
              type={type}
              customClassName={props.customClassName}
              onClick={elem => onHexClick(elem, hex)}
            />
          );
        })
      }
    </g>
  );
}
