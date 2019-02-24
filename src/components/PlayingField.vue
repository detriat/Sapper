<template>
    <div class="playing-field">
        <div v-for="(row, rowIndex) in mode.rows"
             class="playing-field__row"
             :key="row"
        >
            <div v-for="(col, colIndex) in mode.cols"
                 class="playing-field__col"
                 :key="col"
            >
                <cell :row="rowIndex"
                      :col="colIndex"
                ></cell>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import Cell from './Cell';

    export default {
        name: "PlayingField",
        components: {
            Cell
        },
        computed: {
            ...mapState({
                mode: state => state.PlayingField.mode
            })
        }
    }
</script>

<style scoped>

    .playing-field {
        margin: 0 auto;
        display: table;
    }

    .playing-field__row {
        display: flex;
    }
</style>
