<template>
    <div id="app">
        <select name="modes" class="modes" @change="setModeGame">
            <option v-for="(mode, key) in modes"
                    :key="mode.mines"
                    :value="key">
                {{ key }}
            </option>
        </select>
        <div class="playing-header">
            <flags-counter />
            <timer />
        </div>
        <playing-field />
    </div>
</template>

<script>
    import { GAME_MODES } from './settings.js';
    import PlayingField from './components/PlayingField';
    import FlagsCounter from './components/FlagsCounter';
    import Timer from './components/Timer';

    export default {
        name: 'app',
        data() {
            return {
                modes: GAME_MODES
            }
        },
        components: {
            PlayingField,
            FlagsCounter,
            Timer
        },
        methods: {
            setModeGame(e) {
                const newGame = confirm('New Game?');

                if (newGame) {
                    this.$store.commit('firstSettings', GAME_MODES[e.target.value]);
                }
            }
        },
        created() {
            this.$store.commit('firstSettings', GAME_MODES.easy);
        }
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
        margin-top: 60px;
    }

    .playing-header {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    select.modes {
        display: block;
        width: 200px;
        margin: 0 auto 10px;
        height: 40px;
        line-height: 40px;
        padding-left: 15px;
        font-size: 18px;
    }

</style>
