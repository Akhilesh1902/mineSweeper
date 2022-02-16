// logic

export const TILE_STATUSES = {
  HIDDEN: "hidden",
  MINE: "mine",
  NUMBER: "number",
  MARKED: "marked",
};

export function createboard(boardSize, numberOfMines) {
  const board = [];
  const minePositions = getMinePosition(boardSize, numberOfMines);
  console.log(minePositions);
  for (let x = 0; x < boardSize; x++) {
    const row = [];
    for (let y = 0; y < boardSize; y++) {
      const element = document.createElement("div");
      element.dataset.status = TILE_STATUSES.HIDDEN;
      const tile = {
        element,
        x,
        y,
        mine: minePositions.some(positionMatch.bind(null, { x, y })),
        get status() {
          return this.element.dataset.status;
        },
        set status(value) {
          this.element.dataset.status = value;
        },
      };
      row.push(tile);
    }
    board.push(row);
  }
  return board;
}

export function markTile(tile) {
  if (
    tile.status !== TILE_STATUSES.HIDDEN &&
    tile.status !== TILE_STATUSES.MARKED
  ) {
    return;
  }
  if (tile.status === TILE_STATUSES.MARKED) {
    tile.status = TILE_STATUSES.HIDDEN;
  } else {
    tile.status = TILE_STATUSES.MARKED;
  }
}

export function revealTile(board, tile) {
  if (tile.status !== TILE_STATUSES.HIDDEN) return;
  if (tile.mine) {
    tile.status = TILE_STATUSES.MINE;
    return;
  }
  tile.status = TILE_STATUSES.NUMBER;
  const adjesentTiles = neatbyTiles(board, tile);
  const mines = adjesentTiles.filter((t) => t.mine);
  if (mines.length === 0) {
    adjesentTiles.forEach(revealTile.bind(null, board));
  } else {
    tile.element.textContent = mines.length;
  }
}

export function checkWin(board) {
  console.log("here");
  return board.every((row) => {
    return row.every((tile) => {
      return (
        tile.status === TILE_STATUSES.NUMBER ||
        (tile.mine &&
          (tile.status === TILE_STATUSES.HIDDEN ||
            tile.status === TILE_STATUSES.MARKED))
      );
    });
  });
}
export function checkLoose(board) {
  return board.some((row) => {
    return row.some((tile) => {
      return tile.status === TILE_STATUSES.MINE;
    });
  });
}

function getMinePosition(boardSize, numberOfMines) {
  const positions = [];
  while (positions.length < numberOfMines) {
    const position = {
      x: randomNmber(boardSize),
      y: randomNmber(boardSize),
    };
    if (!positions.some((p) => positionMatch(p, position))) {
      positions.push(position);
    }
  }
  return positions;
}

function positionMatch(a, b) {
  return a.x === b.x && a.y === b.y;
}

function randomNmber(size) {
  return Math.floor(Math.random() * size);
}

function neatbyTiles(board, { x, y }) {
  const tiles = [];

  for (let xOffset = -1; xOffset <= 1; xOffset++) {
    for (let yOffset = -1; yOffset <= 1; yOffset++) {
      const tile = board[x - xOffset]?.[y + yOffset];
      if (tile) tiles.push(tile);
    }
  }

  return tiles;
}
