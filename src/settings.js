export const GAME_MODES =  {
    easy: {
        cols: 9,
        rows: 9,
        mines: 10
    },
    normal: {
        cols: 16,
        rows: 16,
        mines: 40
    },
    hard: {
        rows: 16,
        cols: 30,
        mines: 99
    }
};
export const GAME_STATUSES = {
    loading: 1,
    ready: 2,
    process: 3,
    end: 4
};
export const CELL_STATUSES = {
  empty: 0,
  countMines: 1,
  mine: 2,
  flag: 3
};

