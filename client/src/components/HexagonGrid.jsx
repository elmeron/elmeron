import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import './HexagonGrid.less';
import { hexToPixel } from '../services/hex-util.js';
import Hexagon from './Hexagon.jsx';

class HexagonGrid extends React.PureComponent {
  componentWillMount() {
    const { width, height, centerTile, zoom } = this.props;
    this.state = {
      matrix: this.calculateMatrix(width, height, centerTile, zoom),
      dragging: false,
    };
  }

  calculateMatrix(width, height, center, zoom, dx = 0, dy = 0) {
    const { q: cQ, r: cR } = center;
    const { x: cX, y: cY } = hexToPixel(cQ, cR, zoom);

    const offsetX = -cX + width / 2;
    const offsetY = -cY + height / 2;

    const m = [1, 0, 0, 1, offsetX, offsetY];
    m.map(val => val * zoom);

    m[4] += (1 - zoom) * width / 2 + dx;
    m[5] += (1 - zoom) * height / 2 + dy;

    return m;
  }

  pan(dx, dy) {
    const m = this.state.matrix;
    const { width, height, zoom, extremes } = this.props;
    const { xMin, xMax, yMin, yMax } = extremes;
    const x = m[4] + dx;
    const y = m[5] + dy;
    const xMinScale = xMin * zoom;
    const xMaxScale = xMax * zoom;
    const yMinScale = yMin * zoom;
    const yMaxScale = yMax * zoom;

    const topDiff = (y - Math.abs(yMinScale)).toFixed(2);
    const rightDiff = (width - (x + Math.abs(xMaxScale))).toFixed(2);
    const bottomDiff = (height - (y + Math.abs(yMaxScale))).toFixed(2);
    const leftDiff = (x - Math.abs(xMinScale)).toFixed(2);

    const canMoveUp = topDiff >= 0 || bottomDiff < 0;
    const canMoveRight = rightDiff >= 0 || leftDiff < 0;
    const canMoveDown = bottomDiff >= 0 || topDiff < 0;
    const canMoveLeft = leftDiff >= 0 || rightDiff < 0;

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

  render() {
    const {
      width,
      height,
      hexagons,
      zoom,
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
      >
        <rect
          className="background"
          width={width}
          height={height}
        />
        <g transform={`matrix(${matrix})`}>
          {
            hexagons.map((hex) => {
              const q = hex.get('q');
              const r = hex.get('r');
              const center = hexToPixel(q, r, zoom);

              return (
                <Hexagon
                  key={`${q}-${r}`}
                  center={center}
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
  zoom: PropTypes.number.isRequired,
  centerTile: PropTypes.object.isRequired,
  hexagons: PropTypes.arrayOf(PropTypes.object).isRequired,
  extremes: PropTypes.objectOf(PropTypes.number).isRequired,
};

export default connect(
  (state) => ({
    width: state.ui.get('screenWidth'),
    height: state.ui.get('screenHeight'),
    zoom: state.grid.get('zoom'),
    centerTile: state.grid.get('centerTile').toJS(),
    extremes: state.grid.get('extremes').toJS(),
    hexagons: state.tiles.toIndexedSeq(),
  })
)(HexagonGrid);
