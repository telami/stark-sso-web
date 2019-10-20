<template>
    <div class="container">
        <div class="main">
            <BasicHeader/>
            <a-row>
                <a-col>
                    <a-tabs
                            defaultActiveKey="1"
                            :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }"
                    >
                        <a-tab-pane key="1" tab="绑定Stark账号">
                            <a-form
                            >
                                <a-form-item>
                                    <a-input
                                            size="large"
                                            type="text"
                                            placeholder="用户名"
                                            v-decorator="[
                'username',
                {rules: [{ required: true, message: '请输入用户名' }], validateTrigger: 'change'}
              ]"
                                    >
                                        <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
                                    </a-input>
                                </a-form-item>
                                <a-form-item>
                                    <a-input
                                            size="large"
                                            type="password"
                                            autocomplete="false"
                                            placeholder="密码"
                                            v-decorator="[
                'password',
                {rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur'}
              ]"
                                    >
                                        <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
                                    </a-input>
                                </a-form-item>
                                <a-form-item style="margin-top:24px">
                                    <a-button
                                            size="large"
                                            type="primary"
                                            htmlType="submit"
                                            class="confirm"
                                    >确定
                                    </a-button>
                                </a-form-item>
                                <a-form-item>
                                    <router-link :to="{name:'login'}">返回</router-link>
                                    <router-link
                                            :to="{ name: 'register' }"
                                            style="float: right;"
                                    >还没有账号？立即注册
                                    </router-link>
                                </a-form-item>
                            </a-form>
                        </a-tab-pane>
                    </a-tabs>
                </a-col>
            </a-row>
            <BasicFooter/>
        </div>
    </div>
</template>
<script>
  import BasicFooter from "@/components/basic-footer";
  import BasicHeader from "@/components/basic-header";

  export default {
    name: 'relate',
    components: {BasicFooter, BasicHeader}
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
            min-width: 260px;
            width: 368px;
            margin: 0 auto;

            .confirm {
                width: 100%;
            }
        }

    }
</style>
