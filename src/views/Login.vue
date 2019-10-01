<template>
    <div class="body-bg">
        <div class="main">
            <a-row>
                <a-form
                        id="formLogin"
                        class="user-layout-login"
                        ref="formLogin"
                        :form="form"
                        @submit="handleSubmit"
                >
                    <a-tabs
                            :activeKey="customActiveKey"
                            :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }"
                            @change="handleTabClick"
                    >
                        <a-tab-pane key="tab1" tab="用户名密码登录">
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
                            <a-row :gutter="16">
                                <a-col class="gutter-row" :span="16">
                                    <a-form-item>
                                        <a-input size="large" type="text" placeholder="验证码"
                                                 v-decorator="['imageCode', {rules: [{ required: true, message: '请输入验证码' }], validateTrigger: 'blur'}]">
                                            <a-icon slot="prefix" type="safety" :style="{ color: 'rgba(0,0,0,.25)' }"/>
                                        </a-input>
                                    </a-form-item>
                                </a-col>
                                <a-col class="gutter-row" :span="8">
                                    <img :src="imageCode" :key="imageCodeKey" @click="getImage"/>
                                </a-col>
                            </a-row>
                        </a-tab-pane>
                        <a-tab-pane key="tab2" tab="手机号登录">
                            <a-form-item>
                                <a-input size="large" type="text" placeholder="手机号"
                                         v-decorator="['mobile', {rules: [{ required: true, pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号' }], validateTrigger: 'change'}]">
                                    <a-icon slot="prefix" type="mobile" :style="{ color: 'rgba(0,0,0,.25)' }"/>
                                </a-input>
                            </a-form-item>
                            <a-row :gutter="16">
                                <a-col class="gutter-row" :span="16">
                                    <a-form-item>
                                        <a-input size="large" type="text" placeholder="验证码"
                                                 v-decorator="['captcha', {rules: [{ required: true, message: '请输入验证码' }], validateTrigger: 'blur'}]">
                                            <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }"/>
                                        </a-input>
                                    </a-form-item>
                                </a-col>
                                <a-col class="gutter-row" :span="8">
                                    <a-button
                                            class="getCaptcha"
                                            tabindex="-1"
                                            :disabled="state.smsSendBtn"
                                            @click.stop.prevent="getCaptcha"
                                            v-text="!state.smsSendBtn && '获取验证码' || (state.time+' s')"
                                    ></a-button>
                                </a-col>
                            </a-row>
                            <a-row :gutter="16">
                                <a-col class="gutter-row" :span="16">
                                    <a-form-item>
                                        <a-input size="large" type="text" placeholder="验证码"
                                                 v-decorator="['captcha', {rules: [{ required: true, message: '请输入验证码' }], validateTrigger: 'blur'}]">
                                            <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }"/>
                                        </a-input>
                                    </a-form-item>
                                </a-col>
                                <a-col class="gutter-row" :span="8">
                                    <a-button
                                            class="getCaptcha"
                                            tabindex="-1"
                                            :disabled="state.smsSendBtn"
                                            @click.stop.prevent="getCaptcha"
                                            v-text="!state.smsSendBtn && '获取验证码' || (state.time+' s')"
                                    ></a-button>
                                </a-col>
                            </a-row>
                        </a-tab-pane>
                    </a-tabs>

                    <a-form-item style="margin-top:24px">
                        <a-button
                                size="large"
                                type="primary"
                                htmlType="submit"
                                class="login-button"
                                :loading="state.loginBtn"
                                :disabled="state.loginBtn"
                        >确定
                        </a-button>
                    </a-form-item>

                    <div class="user-login-other">
                        <span>其他登录方式</span>
                        <a-icon class="item-icon" type="alipay-circle" @click="redirectToAlipay"></a-icon>
                        <a-icon class="item-icon" type="weibo-circle" @click="redirectToWeibo"></a-icon>
                        <a-icon class="item-icon" type="dingding" @click="redirectToDingtalk"></a-icon>
                        <a-icon class="item-icon" type="qq" @click="redirectToQq"></a-icon>
                        <a>
                            <a-icon class="item-icon" type="weibo-circle"></a-icon>
                        </a>
                        <!--                        <router-link class="register" :to="{ name: 'register' }">注册账户</router-link>-->
                    </div>
                </a-form>
            </a-row>
        </div>
    </div>
</template>

<script>
  import {login, qq, alipay, dingtalk, weibo, getImageCode} from '../api/login'

  const socialRedirectUrl = 'http://sso.dapideng.com/api/uaa';

  export default {
    name: "login",
    data: function () {
      return {
        customActiveKey: 'tab1',
        loginBtn: false,
        // login type: 1 username, 2 telephone
        loginType: 1,
        form: this.$form.createForm(this),
        oauth2Params: '',
        imageCode: '',
        imageCodeKey: '',
        deviceId: '',
        state: {
          time: 60,
          loginBtn: false,
          // login type: 1 username, 2 telephone
          loginType: 1,
          smsSendBtn: false
        }
      }
    },
    mounted() {
      this.qqLogin();
      this.osChinaLogin();
      this.weiboLogin();
      this.dingtalkLogin();
      this.alipayLogin();
      this.getOauth2Param();
      this.getImage();
    },
    methods: {
      handleSubmit(e) {
        e.preventDefault()
        const {
          form: {validateFields},
          state,
          customActiveKey
        } = this

        state.loginBtn = true

        const validateFieldsKey = customActiveKey === 'tab1' ? ['username', 'password', 'imageCode'] : ['mobile', 'captcha']

        validateFields(validateFieldsKey, {force: true}, (err, values) => {
          if (!err) {
            const loginParams = {...values}
            delete loginParams.username
            loginParams[!state.loginType ? 'email' : 'username'] = values.username
            loginParams.password = values.password;
            loginParams.imageCode = values.imageCode;
            login(loginParams, this.oauth2Params, this.deviceId).then(res => {
              if (res.code === 200) {
                if (res.message === '') {
                  //return ''
                  this.loginSuccess()
                } else {
                  window.location.href = socialRedirectUrl + res.message
                  this.state.loginBtn = false
                }
              } else {
                this.requestFailed(res)
              }
            }).catch(err => this.requestFailed(err))
              .finally(() => {
                state.loginBtn = false
              })
          } else {
            setTimeout(() => {
              state.loginBtn = false
            }, 600)
          }
        })
      },
      handleTabClick(key) {
        this.customActiveKey = key
        // this.form.resetFields()
      },
      loginSuccess() {
        this.$router.push({name: 'about'})
      },
      requestFailed(err) {
        this.getImage();
        this.$notification['error']({
          message: '错误',
          description: err.message || '请求出现错误，请稍后再试',
          duration: 4
        })
      },
      getOauth2Param() {
        let params = window.location.search;
        if (!params.search("redirect_uri")) {
          return
        }
        this.oauth2Params = params
        console.log(params)
      },
      getUrlParam(type) {
        if (type === 'code') {
          return window.location.href.match(/code=(\S*)&state/)[1];
        } else if (type === 'state') {
          return window.location.href.match(/state=(\S*)/)[1];
        }
      },
      getImage() {
        this.deviceId = new Date().getTime();
        getImageCode(this.deviceId).then((res) => {
          this.imageCode = 'data:image/jpg;base64,' + res.data;
          this.imageCodeKey = new Date().getTime();
        });
      },
      redirectToQq() {
        console.log(socialRedirectUrl + '/auth/qq' + this.oauth2Params)
        window.location.href = socialRedirectUrl + '/auth/qq' + this.oauth2Params
      },
      redirectToAlipay() {
        console.log(socialRedirectUrl + '/auth/alipay' + this.oauth2Params)
        window.location.href = socialRedirectUrl + '/auth/alipay' + this.oauth2Params
      },
      redirectToDingtalk() {
        console.log(socialRedirectUrl + '/auth/dingtalk' + this.oauth2Params)
        window.location.href = socialRedirectUrl + '/auth/dingtalk' + this.oauth2Params
      },
      redirectToWeibo() {
        console.log(socialRedirectUrl + '/auth/weibo' + this.oauth2Params)
        window.location.href = socialRedirectUrl + '/auth/weibo' + this.oauth2Params
      },
      qqLogin() {
        let url = window.location.href;
        if (url.search("/qq/callback") === -1) {
          return
        }
        console.log(url)
        let code = this.getUrlParam('code');
        console.log(code)
        if (!code) {
          return;
        }
        qq(this.getUrlParam('code'), this.getUrlParam('state'), this.deviceId).then(res => this.authenticationSuccess(res))
      },
      osChinaLogin() {
        let url = window.location.href;
        if (url.search("/oschina/callback") === -1) {
          return
        }
        console.log(url)
        let code = this.getUrlParam();
        console.log(code)
        if (!code) {
          return;
        }
        fetch('http://www.dapideng.com/auth/oschina?code=' + this.getUrlParam(), {
          headers: {
            'Authorization': 'Basic WG5SRkhkd0k3S21PUTVuWjpDNk85S20yTkRYOFZ0blp5dWRBZ0Y4RTZHU2lPM2VrRg==',
            'deviceId': new Date().getTime()
          },
          method: 'GET', // *GET, POST, PUT, DELETE, etc.
        }).then(response => console.log(response.json()))
      },
      weiboLogin: function () {
        let url = window.location.href;
        if (url.search("/weibo/callback") === -1) {
          return
        }
        console.log(url)
        let code = window.location.href.match(/code=(\S*)/)[1];
        console.log(code)
        if (!code) {
          return;
        }
        weibo(code, this.getUrlParam('state'), this.deviceId).then(res => this.authenticationSuccess(res))
      },
      dingtalkLogin: function () {
        let url = window.location.href;
        if (url.search("/dingtalk/callback") === -1) {
          return
        }
        console.log(url)
        let code = this.getUrlParam('code');
        console.log(code)
        if (!code) {
          return;
        }
        dingtalk(code, this.getUrlParam('state'), this.deviceId).then(res => this.authenticationSuccess(res))
      },
      alipayLogin: function () {
        let url = window.location.href;
        if (url.search("/alipay/callback") === -1) {
          return
        }
        console.log(url)
        let code = window.location.href.match(/auth_code=(\S*)/)[1];
        let state = window.location.href.match(/state=(\S*)&scope/)[1];
        console.log(code)
        console.log(state)
        if (!code) {
          return;
        }
        alipay(code, state, this.deviceId).then.then(res => this.authenticationSuccess(res))
      },
      authenticationSuccess(res) {
        if (res.code === 200) {
          if (res.message.length === 0) {
            this.loginSuccess()
          } else {
            window.location.href = socialRedirectUrl + res.message
            this.state.loginBtn = false
          }
        } else {
          this.requestFailed(res)
        }
      }
    }
  }
</script>

<style lang="less" scoped>
    .body-bg {
        position: absolute;
        width: 100%;
        height: 100%;
        background: #8360c3; /* fallback for old browsers */
        background: -webkit-linear-gradient(to top, #2ebf91, #8360c3); /* Chrome 10-25, Safari 5.1-6 */
        background: linear-gradient(to top, #2ebf91, #8360c3); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */


        .main {
            min-width: 260px;
            width: 368px;
            margin: 0 auto;
            padding-top: 10%;
        }
    }

    .user-layout-login {
        label {
            font-size: 14px;
        }

        .getCaptcha {
            display: block;
            width: 100%;
            height: 40px;
        }

        .forge-password {
            font-size: 14px;
        }

        button.login-button {
            padding: 0 15px;
            font-size: 16px;
            height: 40px;
            width: 100%;
        }

        .user-login-other {
            text-align: left;
            margin-top: 24px;
            line-height: 22px;

            .item-icon {
                font-size: 24px;
                color: rgba(0, 0, 0, 0.2);
                margin-left: 16px;
                vertical-align: middle;
                cursor: pointer;
                transition: color 0.3s;

                &:hover {
                    color: #1890ff;
                }
            }

            .register {
                float: right;
            }
        }
    }
</style>
