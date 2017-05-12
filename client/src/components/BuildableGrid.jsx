import { Set } from 'immutable';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import config from '../../config.js';
import { openCard as open, closeCard as close } from '../ducks/card.js';
import { focus as fo } from '../ducks/grid.js';
import {
  stopMonitoring as sm,
  selectTile as st,
  deselectTile as dt
} from '../ducks/refinery.js';
import { getSurroundingTiles, tilesAreConnected } from '../services/hex-util.js';
import HexagonGrid from './HexagonGrid.jsx';
import StandardHexagonGroup from './StandardHexagonGroup.jsx';
import BuildRefineryCard from './cards/BuildRefineryCard.jsx';

class BuildableGrid extends React.PureComponent {
  openCard() {
    this.props.openCard(this.selection, <BuildRefineryCard />);
  }

  componentWillMount() {
    const { selectedTiles, focus } = this.props;
    const focusTile = selectedTiles.first();

    focus(focusTile);
  }

  componentDidMount() {
    this.openCard();
  }

  componentWillUnmount() {
    this.props.closeCard();
  }

  componentDidUpdate(prevProps) {
    const { selectedTiles: prevSelectedTiles } = prevProps;
    const { selectedTiles: newSelectedTiles } = this.props;

    if (prevSelectedTiles.size !== newSelectedTiles.size) {
      this.openCard();
    }
  }

  onBackgroundClick() {
    this.openCard();
  }

  onSelectedTileClick(elem, tile) {
    const { selectedTiles, deselectTile } = this.props;
    const afterDeselect = selectedTiles.delete(tile);

    if (selectedTiles.size > 1 && tilesAreConnected(afterDeselect)) {
      deselectTile(tile);
    }
  }

  onBuildableTileClick(elem, tile) {
    const { selectTile } = this.props;

    selectTile(tile);
  }

  render() {
    const { allTiles, selectedTiles, buildableTiles } = this.props;
    const { size } = config.tiles;
    const selectedTileSize = size - (size * 0.2);

    return (
      <HexagonGrid onBackgroundClick={() => this.onBackgroundClick()}>
        <StandardHexagonGroup hexagons={allTiles} customClassName="dimmed" />
        <StandardHexagonGroup
          hexagons={selectedTiles}
          refs={(r) => { this.selection = r; }}
        />
        <StandardHexagonGroup
          hexagons={selectedTiles}
          size={selectedTileSize}
          customClassName="refinery"
          onHexClick={(elem, tile) => this.onSelectedTileClick(elem, tile)}
        />
        <StandardHexagonGroup
          hexagons={buildableTiles}
          onHexClick={(elem, tile) => this.onBuildableTileClick(elem, tile)}
        />
      </HexagonGrid>
    );
  }
}

function filterOutUnexplored(tiles) {
  return tiles.filterNot(tile => tile.getIn(['resource', 'name']) === 'Unexplored');
}

function getBuildableTiles(selectedTiles, allTiles, nickname) {
  return getSurroundingTiles(selectedTiles, allTiles, ({ resource, owner, player }) => {
    const { name } = resource;
    const type = owner && owner.type;
    const differentNickname = player && player !== nickname;
    return  name === 'Unexplored' ||
            name === 'Ocean' ||
            type === 'Refinery' ||
            differentNickname;
  });
}

export default connect(
  (state) => ({
    allTiles: filterOutUnexplored(state.world.get('tiles')).toIndexedSeq().toJS(),
    selectedTiles: state.refinery.get('selectedTiles'),
    buildableTiles: getBuildableTiles(
                      state.refinery.get('selectedTiles'),
                      state.world.get('tiles').toIndexedSeq().toJS(),
                      state.elmeron.get('nickname')),
  }),
  (dispatch) => ({
    openCard: bindActionCreators(open, dispatch),
    closeCard: bindActionCreators(close, dispatch),
    focus: bindActionCreators(fo, dispatch),
    stopMonitoring: bindActionCreators(sm, dispatch),
    selectTile: bindActionCreators(st, dispatch),
    deselectTile: bindActionCreators(dt, dispatch),
  })
)(BuildableGrid);
