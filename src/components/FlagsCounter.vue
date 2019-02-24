<template>
    <div class="flags-counter">{{ flags }}</div>
</template>

<script>
    import { mapState } from 'vuex';
    export default {
        name: "FlagsCounter",
        computed: mapState({
            flags: state => state.PlayingField.countFlags
        })
    }
</script>

<style scoped>
    .flags-counter {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 60px;
        height: 60px;
        border: 2px solid #dedede;
        font-family: Arial;
        font-size: 24px;
        color: red;
        margin: 0 10px;
    }
</style>
