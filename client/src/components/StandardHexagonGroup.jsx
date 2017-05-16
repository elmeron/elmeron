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
          const { q, r, owner, resource } = hex;
          const center = hexToPixel(q, r);

          return (
            <HexagonComponent
              key={`${q}-${r}`}
              center={center}
              size={props.size}
              type={resource}
              customClassName={props.customClassName}
              onClick={elem => onHexClick(elem, hex)}
            />
          );
        })
      }
    </g>
  );
}
