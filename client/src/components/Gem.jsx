import React from 'react';
import './Gem.less';
import Circle from './Circle.jsx';

export default class Gem extends React.PureComponent {
  componentWillMount() {
    this.state = {
      animationStatus: '',
    };
  }

  animate(status, after, done) {
    this.setState({ animationStatus: status });
    this.timer = setTimeout(() => {
      this.setState({ animationStatus: after});
      if (done) {
        done();
      }
    }, 200);
  }

  componentDidMount() {
    this.animate('ease-in', 'bouncing');
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  onClick(e) {
    e.persist();
    this.animate('ease-out', '', () => this.props.onClick(e.target));
  }

  render() {
    const { animationStatus } = this.state;
    const { center, size } = this.props;
    const radius = Math.round(size / 2);
    const shadowCenter = {
      x: center.x + 2,
      y: center.y + 2,
    };

    return (
      <g className="gem-wrapper" onClick={e => this.onClick(e)}>
        <Circle
          center={shadowCenter}
          radius={radius}
          customClassName={`gem-shadow ${animationStatus}`}
        />
        <Circle
          center={center}
          radius={radius}
          customClassName={`gem ${animationStatus}`}
        />
      </g>
    );
  }
}
