<template>
    <div class="container">
        <div class="main">
            <BasicHeader/>
            <result
                    :isSuccess="true"
                    :content="false"
                    :title="email"
                    :description="description">

                <template slot="action">
                    <a-button size="large" type="primary">查看邮箱</a-button>
                    <a-button size="large" style="margin-left: 8px" @click="goHomeHandle">返回首页</a-button>
                </template>

            </result>
            <BasicFooter/>
        </div>
    </div>
</template>

<script>

    import Result from "@/components/result/result";
    import BasicHeader from "@/components/basic-header/basic-header";
    import BasicFooter from "@/components/basic-footer/basic-footer";

    export default {
        name: 'RegisterResult',
        components: {BasicFooter, BasicHeader, Result},
        data() {
            return {
                description: '激活邮件已发送到你的邮箱中，邮件有效期为24小时。请及时登录邮箱，点击邮件中的链接激活帐户。',
                form: {}
            }
        },
        computed: {
            email() {
                const v = this.form && this.form.username || ''
                return `你的账户：${v} 注册成功`
            }
        },
        created() {
            this.form = this.$route.params
        },
        methods: {
            goHomeHandle() {
                this.$router.push({name: 'login'})
            }
        }
    }
</script>

<style lang="less" scoped>
    .container {
        position: absolute;
        width: 100%;
        height: 100%;
        background: #f0f2f5 url(../assets/bg.svg) no-repeat;

        .main {
            height: 100%;
            margin: 0 auto;
        }
    }
</style>
