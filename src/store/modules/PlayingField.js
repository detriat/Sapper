import { GAME_MODES, GAME_STATUSES, CELL_STATUSES } from '../../settings.js';

const state = {
    mode: {},
    status: GAME_STATUSES.loading,
    mapGame: [],
    countFlags: 0,
    findedMines: 0
};

const mutations = {
    firstSettings(state, mode = GAME_MODES.easy) {
        state.mode = mode;
        state.mapGame = createMap(mode.rows, mode.cols);
        state.countFlags = mode.mines;
        state.findedMines = 0;
        state.status = GAME_STATUSES.ready;
    },
    changeMapGame(state, map = []) {
        state.mapGame = map;
    },
    changeCellMap(state, {row = 0, col = 0, options = []}) {
        options.forEach(option => state.mapGame[row][col][option.field] = option.value);
    },
    toggleFlagCell(state, {row = 0, col = 0}) {
        state.mapGame[row][col].flag = !state.mapGame[row][col].flag;
        state.mapGame[row][col].flag ? state.countFlags-- : state.countFlags++;
    },
    changeGameStatus(state, status = 0) {
        state.status = status;
    },
    changeFindedMines(state, payload = 0) {
        state.findedMines += payload;
    }
};

const actions = {
    async generateGame(context, {row = 0, col = 0}) {
        await context.dispatch('placeMines', {clickedRow: row, clickedCol:col});
    },
    async placeMines(context, {clickedRow, clickedCol}) {
        let countMines  = state.mode.mines;
        const countRows = state.mode.rows;
        const countCols = state.mode.cols;
        let map = state.mapGame;

        while (countMines > 0) {
            const rowIndex = getRandomInt(0, countRows - 1);
            const colIndex = getRandomInt(0, countCols - 1);
            const isMine   = await context.dispatch('isMine', {map, rowIndex, colIndex});

            if (!isMine && clickedRow !== rowIndex && clickedCol !== colIndex) {
                map[rowIndex][colIndex].type = CELL_STATUSES.mine;
                countMines--;
            }
        }

        context.commit('changeMapGame', map);
        context.dispatch('setNumberMinesForAreaCells', {row: clickedRow, col: clickedCol})
    },
    isMine(context, {map = [], rowIndex = 0, colIndex = 0}){
        return map[rowIndex][colIndex].type === CELL_STATUSES.mine;
    },
    setNumberMinesForAreaCells (context, {row, col}) {
        let countMines = 0;
        const neighboringCells = [
            {
                row: -1,
                col: -1
            },
            {
                row: -1,
                col: 0
            },
            {
                row: -1,
                col: 1
            },

            {
                row: 0,
                col: -1
            },
            {
                row: 0,
                col: 0
            },
            {
                row: 0,
                col: 1
            },

            {
                row: 1,
                col: -1
            },
            {
                row: 1,
                col: 0
            },
            {
                row: 1,
                col: 1
            },

        ];
        const stackCells = [{
            row,
            col
        }];

        let rowIndex = 0;
        let colIndex = 0;

        while (countMines === 0 && stackCells.length) {

            const currentCell = stackCells.pop();
            let map = state.mapGame;

            neighboringCells.forEach(cell => {

                rowIndex = currentCell.row + cell.row;
                colIndex = currentCell.col + cell.col;

                if (issetCell(map, rowIndex, colIndex) && !map[rowIndex][colIndex].opened) {

                    if (map[rowIndex][colIndex].type === CELL_STATUSES.mine) {
                        countMines++;
                    }else {
                        stackCells.push({
                            row: rowIndex,
                            col: colIndex
                        });

                        context.commit('changeCellMap', {
                            row: rowIndex,
                            col: colIndex,
                            options: [
                                {
                                    field: 'opened',
                                    value: true
                                }
                            ]
                        });

                    }
                }
            });

            if (countMines > 0) {

                context.commit('changeCellMap', {
                    row: currentCell.row,
                    col: currentCell.col,
                    options: [
                        {
                            field: 'type',
                            value: CELL_STATUSES.countMines
                        },
                        {
                            field: 'countBombs',
                            value: countMines
                        }
                    ]
                });
            }

        }
    },
    openAllCells(context, messageAfterOpen = 'Game Over! New Game?') {
        state.mapGame.forEach((row, rowIndex) => {
           row.forEach((col, colIndex) => {
               setTimeout(function () {
                   context.commit('changeCellMap', {
                       row: rowIndex,
                       col: colIndex,
                       options: [{
                           field: 'opened',
                           value: true
                       }]
                   })
               }, 150 * rowIndex);
           })
        });

        setTimeout(() => {
            const newGame = confirm(messageAfterOpen);

            if (newGame) {
                context.commit('firstSettings', state.mode);
            }

        }, 150 * state.mapGame.length);

    },
    toggleFlagCell(context, {row = 0, col = 0}) {
        const isMine = context.getters.isMine(row, col);

        if (state.mapGame[row][col].flag || state.countFlags > 0) {
            context.commit('toggleFlagCell', {row, col});
        }

        (isMine && state.mapGame[row][col].flag)
            ? context.commit('changeFindedMines', 1)
            : context.commit('changeFindedMines', -1);
    },
    checkEndGame(context) {
        if (state.findedMines === state.mode.mines) {
            context.dispatch('openAllCells', 'You Win! New Game?')
        }
    }
};

const getters = {
    isMine: () => (row = 0, col = 0) => state.mapGame[row][col].type === CELL_STATUSES.mine,
    countMines: () => (row = 0, col = 0) => {

        if (state.mapGame[row][col].type === CELL_STATUSES.countMines){
            return state.mapGame[row][col].countBombs;
        }

        return false;
    },
    visibleCell: () => (row = 0, col = 0) => state.mapGame[row][col].opened,
    flagCell: () => (row = 0, col = 0) => state.mapGame[row][col].flag
};

function createMap(rows = 9, cols = 9) {
    let map = [];

    for (let row = 0; row < rows; row++) {
        map[row] = [];

        for (let col = 0; col < cols; col++) {
            map[row][col] = {
                type: CELL_STATUSES.empty,
                opened: false,
                flag: false,
            };
        }
    }

    return map;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function issetCell(map = [], row = 0, col = 0) {
    if (typeof map[row] !== 'undefined' && typeof map[row][col] !== 'undefined') {
        return true
    }

    return false;
}

export default {
    namespace:true,
    state,
    mutations,
    actions,
    getters
}
