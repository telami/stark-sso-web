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
                                        placeholder="请输入用户名"
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
                                        placeholder="请输入密码"
                                        v-decorator="[
                'password',
                {rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur'}
              ]"
                                >
                                    <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
                                </a-input>
                            </a-form-item>
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
                        <a href="http://www.dapideng.com/auth/alipay">
                            <a-icon class="item-icon" type="alipay-circle"></a-icon>
                        </a>
                        <a href="/auth/weibo">
                            <a-icon class="item-icon" type="weibo-circle"></a-icon>
                        </a>
                        <a href="/auth/dingtalk">
                            <a-icon class="item-icon" type="dingding"></a-icon>
                        </a>
                        <a href="http://www.dapideng.com/auth/qq?response_type=code&client_id=XnRFHdwI7KmOQ5nZ&redirect_uri=https://www.telami.cn&scope=USER_INFO&state=123">
                            <a-icon class="item-icon" type="qq"></a-icon>
                        </a>
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
  import {login} from '../api/login'

  const domain = 'http://sso.dapideng.com/uaa';

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
      this.getOauth2Param()
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

        const validateFieldsKey = customActiveKey === 'tab1' ? ['username', 'password'] : ['mobile', 'captcha']

        validateFields(validateFieldsKey, {force: true}, (err, values) => {
          if (!err) {
            const loginParams = {...values}
            delete loginParams.username
            loginParams[!state.loginType ? 'email' : 'username'] = values.username
            loginParams.password = values.password
            login(loginParams, this.oauth2Params).then(res => {
              if (res.code === 200) {
                if (res.message === domain) {
                  this.loginSuccess()
                } else {
                  window.location.href = res.message
                  this.state.loginBtn = false
                }
              }else {
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
        fetch('http://www.dapideng.com/auth/qq?code=' + this.getUrlParam('code') + "&state=" + this.getUrlParam('state'), {
          headers: {
            'Authorization': 'Basic WG5SRkhkd0k3S21PUTVuWjpDNk85S20yTkRYOFZ0blp5dWRBZ0Y4RTZHU2lPM2VrRg==',
            'deviceId': new Date().getTime()
          },
          method: 'GET', // *GET, POST, PUT, DELETE, etc.
        }).then(res => {
          console.log(res.json())
          console.log(res.code)
          console.log(res.message)
          window.location.href = res.message
        })
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
        fetch('http://www.dapideng.com/auth/weibo?code=' + code, {
          headers: {
            'Authorization': 'Basic WG5SRkhkd0k3S21PUTVuWjpDNk85S20yTkRYOFZ0blp5dWRBZ0Y4RTZHU2lPM2VrRg==',
            'deviceId': new Date().getTime()
          },
          method: 'GET', // *GET, POST, PUT, DELETE, etc.
        }).then(res => res.json())
          .catch(error => {
            console.error('Error:', error)
            console.log(error.data)
          })
          .then(response => {
            console.log('Success:', response)
            console.log('data:', response.data)
            this.avatar = response.data.avatar
          });
      },
      dingtalkLogin: function () {
        let url = window.location.href;
        if (url.search("/dingtalk/callback") === -1) {
          return
        }
        console.log(url)
        let code = this.getUrlParam();
        console.log(code)
        if (!code) {
          return;
        }
        fetch('http://www.dapideng.com/auth/dingtalk?code=' + code, {
          headers: {
            'Authorization': 'Basic WG5SRkhkd0k3S21PUTVuWjpDNk85S20yTkRYOFZ0blp5dWRBZ0Y4RTZHU2lPM2VrRg==',
            'deviceId': new Date().getTime()
          },
          method: 'GET', // *GET, POST, PUT, DELETE, etc.
        }).then(res => res.json())
          .catch(error => {
            console.error('Error:', error)
            console.log(error.data)
          })
          .then(response => {
            console.log('Success:', response)
            console.log('data:', response.data)
            this.avatar = response.data.avatar
          });
      },
      alipayLogin: function () {
        let url = window.location.href;
        if (url.search("/alipay/callback") === -1) {
          return
        }
        console.log(url)
        let code = window.location.href.match(/auth_code=(\S*)/)[1];
        console.log(code)
        if (!code) {
          return;
        }
        fetch('http://www.dapideng.com/auth/alipay?code=' + code, {
          headers: {
            'Authorization': 'Basic WG5SRkhkd0k3S21PUTVuWjpDNk85S20yTkRYOFZ0blp5dWRBZ0Y4RTZHU2lPM2VrRg==',
            'deviceId': new Date().getTime()
          },
          method: 'GET', // *GET, POST, PUT, DELETE, etc.
        }).then(res => res.json())
          .catch(error => {
            console.error('Error:', error)
            console.log(error.data)
          })
          .then(response => {
            console.log('Success:', response)
            console.log('data:', response.data)
            this.avatar = response.data.avatar
          });
      }
    }
  }
</script>

<style lang="less" scoped>
    .body-bg {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        overflow-y: auto;
        background: url(../assets/bg.png) no-repeat;
        background-size: cover;

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
