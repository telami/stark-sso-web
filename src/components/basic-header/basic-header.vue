<template>
    <div class="header">
        <img src="http://xboot.exrick.cn/img/xboot.913bcfa8.png" width="220px">
        <div class="description">XBoot 是很不错的Web前后端分离架构开发平台</div>
    </div>
</template>

<script>
  export default {
    name: "basic-header"
  };
</script>

<style lang="less">
    .header {
        padding-top: 10vh;
        margin-bottom: 6vh;
        text-align: center;

        .description {
            font-size: 14px;
            color: rgba(0, 0, 0, 0.45);
            margin-top: 1vh;
        }
    }
</style>
