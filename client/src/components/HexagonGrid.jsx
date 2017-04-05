import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import config from '../../config.js';
import { hexToPixel } from '../services/hex-util.js';
import './HexagonGrid.less';
import Hexagon from './Hexagon.jsx';

class HexagonGrid extends React.PureComponent {
  componentWillMount() {
    const { width, height, centerTile } = this.props;
    this.state = {
      matrix: this.calculateMatrix(width, height, centerTile),
      dragging: false,
    };
  }

  calculateMatrix(width, height, center) {
    const { q: cQ, r: cR } = center;
    const { x: cX, y: cY } = hexToPixel(cQ, cR, 1);

    const offsetX = -cX + (width / 2);
    const offsetY = -cY + (height / 2);

    return [1, 0, 0, 1, offsetX, offsetY];
  }

  pan(dx, dy) {
    const m = this.state.matrix;
    const { width, height, extremes } = this.props;
    const { xMin, xMax, yMin, yMax } = extremes;
    const { padding } = config.grid;
    const zoom = m[0];
    const x = m[4] + dx;
    const y = m[5] + dy;

    const xMinScale = zoom * xMin;
    const xMaxScale = zoom * xMax;
    const yMinScale = zoom * yMin;
    const yMaxScale = zoom * yMax;

    const topDiff = (y - Math.abs(yMinScale)).toFixed(2);
    const rightDiff = (width - (x + Math.abs(xMaxScale))).toFixed(2);
    const bottomDiff = (height - (y + Math.abs(yMaxScale))).toFixed(2);
    const leftDiff = (x - Math.abs(xMinScale)).toFixed(2);

    const canMoveUp = topDiff >= padding || bottomDiff < padding;
    const canMoveRight = rightDiff >= padding || leftDiff < padding;
    const canMoveDown = bottomDiff >= padding || topDiff < padding;
    const canMoveLeft = leftDiff >= padding || rightDiff < padding;

    if (dy < 0 && canMoveUp || dy > 0 && canMoveDown) {
      m[5] = y;
    }
    if (dx > 0 && canMoveRight || dx < 0 && canMoveLeft) {
      m[4] = x;
    }

    this.setState({ matrix: m });
  }

  onDragStart(e) {
    const startX = e.clientX;
    const startY = e.clientY;
    this.setState({
      dragging: true,
      startX,
      startY,
    });
  }

  onDragMove(e) {
    if (!this.state.dragging) {
      return;
    }

    const x = e.clientX;
    const y = e.clientY;
    const dx = x - this.state.startX;
    const dy = y - this.state.startY;

    this.pan(dx, dy);
    this.setState({
      startX: x,
      startY: y,
    });
  }

  onDragEnd() {
    this.setState({ dragging: false });
  }

  onScroll(e) {
    const m = this.state.matrix;
    const { zoomMin, zoomMax } = config.grid;
    const delta = e.deltaY > 0 ? 0.1 : -0.1;
    const zoom = m[0];
    let value = zoom + delta;

    value = value >= zoomMin && value <= zoomMax ? value : zoom;

    m[0] = value;
    m[3] = value;

    this.setState({ matrix: Object.assign([], m) });
  }

  render() {
    const {
      width,
      height,
      hexagons,
      zoom,
      onBackgroundClick,
      onHexClick,
    } = this.props;
    const viewBox = [0, 0, width, height].join(' ');
    const matrix = this.state.matrix.join(' ');

    return (
      <svg
        className="hexagon-grid"
        width={width}
        height={height}
        viewBox={viewBox}
        onMouseDown={e => this.onDragStart(e)}
        onMouseMove={e => this.onDragMove(e)}
        onMouseUp={() => this.onDragEnd()}
        onMouseLeave={() => this.onDragEnd()}
        onWheel={e => this.onScroll(e)}
      >
        <rect
          className="background"
          width={width}
          height={height}
          onClick={() => onBackgroundClick()}
        />
        <g transform={`matrix(${matrix})`}>
          {
            hexagons.map((hex) => {
              const q = hex.get('q');
              const r = hex.get('r');
              const type = hex.get('resource');
              const center = hexToPixel(q, r, zoom);

              return (
                <Hexagon
                  key={`${q}-${r}`}
                  center={center}
                  type={type}
                  onClick={elem => onHexClick(elem, hex.toJS())}
                />
              );
            })
          }
        </g>
      </svg>
    );
  }
}

HexagonGrid.PropTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  centerTile: PropTypes.object.isRequired,
  hexagons: PropTypes.arrayOf(PropTypes.object).isRequired,
  extremes: PropTypes.objectOf(PropTypes.number).isRequired,
  onBackgroundClick: PropTypes.func.isRequired,
  onHexClick: PropTypes.func.isRequired,
};

export default connect(
  (state) => ({
    width: state.ui.get('screenWidth'),
    height: state.ui.get('screenHeight'),
    centerTile: state.grid.get('centerTile').toJS(),
    extremes: state.grid.get('extremes').toJS(),
    hexagons: state.world.get('tiles').toIndexedSeq(),
  })
)(HexagonGrid);
