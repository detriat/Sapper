<template>
    <div class="timer">
        {{ getMinutes }} : {{ getSeconds }}
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import { GAME_STATUSES } from '../settings.js';

    export default {
        name: "Timer",
        data() {
            return {
                minutes: 0,
                seconds: 0,
                timerId: null
            }
        },
        computed: {
            getMinutes() {
                return this.minutes < 10 ? `0${this.minutes}` : this.minutes;
            },
            getSeconds() {
                return this.seconds < 10 ? `0${this.seconds}` : this.seconds;
            },
            ...mapState({
                status: state => state.PlayingField.status
            })
        },
        watch:{
            status(){
                const gameStatus = this.status;
                if (gameStatus === GAME_STATUSES.process) this.start();
                if (gameStatus === GAME_STATUSES.end) this.stop();
            }
        },
        methods: {
            start() {
                this.stop(this.timerId);
                this.minutes = 0;
                this.seconds = 0;
                this.timerId = setInterval(this.tick, 1000);
            },
            stop() {
                clearInterval(this.timerId);
            },
            tick() {
                if (this.seconds < 59) {
                    this.seconds++;
                }else {
                    this.seconds = 0;
                    this.minutes++;
                }
            }
        }
    }
</script>

<style scoped>
    .timer {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 90px;
        height: 60px;
        border: 2px solid #dedede;
        font-family: Arial;
        font-size: 24px;
        color: red;
        margin: 0 10px;
    }
</style>
