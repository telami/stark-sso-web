<template>
    <div class="container">
        <div class="main">
            <BasicHeader/>
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
                            <a-row type="flex" justify="space-around" align="top">
                                <a-col :span="16">
                                    <a-form-item>
                                        <a-input size="large" type="text" placeholder="验证码"
                                                 v-decorator="['imageCode', {rules: [{ required: true, message: '请输入验证码' }], validateTrigger: 'blur'}]">
                                            <a-icon slot="prefix" type="safety" :style="{ color: 'rgba(0,0,0,.25)' }"/>
                                        </a-input>
                                    </a-form-item>
                                </a-col>
                                <a-col :span="8" @click="getImage">
                                    <img :src="imageCode" style="padding-left: 10px" height="40" width="120"
                                         alt="出了点小故障" :key="imageCodeKey"/>
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
                                                 v-decorator="['smsCode', {rules: [{ required: true, message: '请输入验证码' }], validateTrigger: 'blur'}]">
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

                    <a-form-item>
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
                        <a-icon class="item-icon" type="dribbble" @click="redirectToOschina"></a-icon>
                        <router-link class="register" :to="{ name: 'register' }">注册账户</router-link>
                    </div>
                </a-form>
            </a-row>
            <Footer/>
        </div>
    </div>
</template>

<script>
  import {login, loginMobile, getImageCode, getSmsCaptcha} from '../api/login'
  import Footer from "@/components/basic-footer";
  import BasicHeader from "@/components/basic-header";

  const socialRedirectUrl = 'http://sso.dapideng.com/api/uaa';

  export default {
    name: "login",
    components: {BasicHeader, Footer},
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

        const validateFieldsKey = customActiveKey === 'tab1' ? ['username', 'password', 'imageCode'] : ['mobile', 'smsCode']

        validateFields(validateFieldsKey, {force: true}, (err, values) => {
          if (!err) {
            const loginParams = {...values}
            if (this.state.loginType === 1) {
              loginParams.username = values.username
              loginParams.password = values.password;
              loginParams.imageCode = values.imageCode;
              login(loginParams, this.oauth2Params, this.deviceId).then(res => {
                if (res.code === 200) {
                  if (res.message === '') {
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
              loginParams.mobile = values.mobile
              loginParams.smsCode = values.smsCode
              loginMobile(loginParams, this.oauth2Params, this.deviceId).then(res => {
                if (res.code === 200) {
                  if (res.message === '') {
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
            }

          } else {
            setTimeout(() => {
              state.loginBtn = false
            }, 600)
          }
        })
      },
      handleTabClick(key) {
        this.customActiveKey = key
        this.state.loginType = key === 'tab1' ? 1 : 2
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
      },
      getImage() {
        this.deviceId = new Date().getTime();
        getImageCode(this.deviceId).then((res) => {
          this.imageCode = 'data:image/jpg;base64,' + res.data;
          this.imageCodeKey = new Date().getTime();
        }).catch(() => {
          this.imageCode = '';
          this.$message.error('获取图片验证码失败');
        });
      },
      getCaptcha(e) {
        e.preventDefault()
        const {form: {validateFields}, state} = this

        validateFields(['mobile'], {force: true}, (err, values) => {
          if (!err) {
            state.smsSendBtn = true

            const interval = window.setInterval(() => {
              if (state.time-- <= 0) {
                state.time = 60
                state.smsSendBtn = false
                window.clearInterval(interval)
              }
            }, 1000)

            const hide = this.$message.loading('验证码发送中..', 0)
            getSmsCaptcha(values.mobile, this.deviceId).then(res => {
              setTimeout(hide, 0)
              if (res.code === 200) {
                this.$notification['success']({
                  message: '提示',
                  description: '验证码获取成功，您的验证码为：' + res.data,
                  duration: 8
                })
              } else {
                this.requestFailed(res)
              }
            }).catch(err => {
              setTimeout(hide, 1)
              clearInterval(interval)
              state.time = 60
              state.smsSendBtn = false
              this.requestFailed(err)
            })
          }
        })
      },
      redirectToQq() {
        window.location.href = socialRedirectUrl + '/auth/qq' + this.oauth2Params
      },
      redirectToAlipay() {
        window.location.href = socialRedirectUrl + '/auth/alipay' + this.oauth2Params
      },
      redirectToDingtalk() {
        window.location.href = socialRedirectUrl + '/auth/dingtalk' + this.oauth2Params
      },
      redirectToWeibo() {
        window.location.href = socialRedirectUrl + '/auth/weibo' + this.oauth2Params
      },
      redirectToOschina() {
        window.location.href = socialRedirectUrl + '/auth/oschina' + this.oauth2Params
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

            .user-layout-login {
                label {
                    font-size: 14px;
                }

                .getCaptcha {
                    display: block;
                    width: 100%;
                    height: 40px;
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
                        font-size: 20px;
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
        }
    }

</style>
