<style lang="scss" scoped>
    .loadingDiv {
        height: 100%;
        width: 100%;
        position: absolute;
        left: 0;
        top: 0;
        background: rgba(255,255,255,0.7);
        z-index: 10000;
        transition: .3s;
        img {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            margin: auto;
            width: 100px;
            height: 70px;
            animation: 2s infinite;
        }
    }
</style>

<template>
    <div class="loadingDiv" :style="{ display: isShow == true? 'block': 'none' }">
        <img style="width:50px;height:50px" src="@/assets/loading.gif" ondragstart="return false">
    </div>
</template>

<script>
    export default {
        props: ['isShow']
    }
</script>

