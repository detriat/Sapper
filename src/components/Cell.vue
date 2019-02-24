<template>
    <div v-if="visibleCell(row, col)"
         class="cell"
         :class="{ opened: visibleCell(row, col), flag: flagCell(row, col) }"
    >

        <div v-if="isMine(row, col)">
            <img v-if="flagCell(row, col)"
                 src="../assets/images/mine-full.png"
                 alt="mine"
            >
            <img v-else
                 src="../assets/images/mine-action.png"
                 alt="mine-active"
            >
        </div>

        <b v-if="countMines(row, col)">{{ countMines(row, col) }}</b>
    </div>
    <div v-else
         class="cell"
         :class="{ flag: flagCell(row, col) }"
         @click="openCell"
         @click.prevent.right="toggleFlag">
    </div>
</template>

<script>
    import { GAME_STATUSES } from "../settings";
    import { mapGetters, mapState, mapMutations, mapActions } from 'vuex';

    export default {
        name: "Cell",
        props: ['row', 'col'],
        computed: {
            ...mapGetters([
                'isMine',
                'countMines',
                'visibleCell',
                'flagCell'
            ]),
            ...mapState({
                statusGame: state => state.PlayingField.status,
                map: state => state.PlayingField.mapGame,
            })
        },
        methods: {
            openCell() {
                if (this.startedGame()) {
                    const mine = this.isMine(this.row, this.col);

                    if (mine) {
                        this.openAllCells('Game Over! New Game?');
                    } else {
                        const currentRow = this.row;
                        const currentCol = this.col;

                        this.setNumberMinesForAreaCells({
                            row: currentRow,
                            col: currentCol
                        });
                    }
                }
            },
            startedGame() {
                if (this.statusGame === GAME_STATUSES.ready) {
                    const currentRow = this.row;
                    const currentCol = this.col;

                    this.changeGameStatus(GAME_STATUSES.process);
                    this.generateGame({
                        row: currentRow,
                        col: currentCol
                    });

                    return false;
                }

                return true;

            },
            async toggleFlag() {
                await this.toggleFlagCell({row: this.row, col: this.col});
                this.checkEndGame();
            },
            ...mapMutations([
                'changeGameStatus'
            ]),
            ...mapActions([
                'generateGame',
                'setNumberMinesForAreaCells',
                'openAllCells',
                'toggleFlagCell',
                'checkEndGame'
            ])
        },
    }
</script>

<style scoped>
    .cell {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 18px;
        width: 40px;
        height: 40px;
        border: 1px solid #000000;
        background: #cecece;
        transition: background 0.25s linear;
        margin: 1px;
        cursor: pointer;
    }

    .cell.opened {
        background: transparent;
        transition: background 0.25s linear;
        cursor: inherit;
    }

    .cell img {
        max-width: 100%;
    }

    .cell.flag {
        background: url("../assets/images/flag.png") no-repeat center center;
        background-size: contain;
    }

</style>
