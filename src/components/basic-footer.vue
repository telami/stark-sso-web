<template>
    <div class="footer">
        <div class="links">
            <a href="https://github.com/telami/stark">Stark</a>
        </div>
        <div class="copyright">
            Copyright
            <a-icon type="copyright"/>
            2019 <a
                href="https://www.telami.cn"
                target="_blank"
                style="margin:0 5px;"
                >telami</a>版权所有
        </div>
    </div>
</template>

<script>
  export default {
    name: 'basic-footer',
    data() {
      return {}
    }
  }
</script>

<style lang="less" scoped>
    .footer {
        padding: 0 16px;
        text-align: center;
        position: fixed;
        bottom: 4vh;
        width: 368px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 14px;

        .links {
            margin-bottom: 8px;

            a {
                color: rgba(0, 0, 0, 0.45);

                &:hover {
                    color: rgba(0, 0, 0, 0.65);
                }

                &:not(:last-child) {
                    margin-right: 40px;
                }
            }
        }

        .copyright {
            color: rgba(0, 0, 0, 0.45);
            font-size: 14px;
        }
    }
</style>
