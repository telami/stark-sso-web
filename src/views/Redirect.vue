<template>
    <div class="container">
        <div>登录成功，请稍后</div>
        <div class="load-container" v-show="show">
            <div class="load load1"></div>
            <div class="load load2"></div>
            <div class="load"></div>
        </div>
    </div>
</template>

<script>
  import {qq, alipay, dingtalk, weibo} from '../api/login'

  const socialRedirectUrl = 'http://sso.dapideng.com/api/uaa';

  export default {
    name: "Redirect",
    data() {
      return {
        show: true
      }
    },
    mounted() {
      this.qqLogin();
      this.alipayLogin();
    },
    methods: {
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
        qq(this.getUrlParam('code'), this.getUrlParam('state'), this.deviceId).then(res => this.authenticationSuccess(res))
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
        alipay(code, state, this.deviceId).then(res => this.authenticationSuccess(res))
      },
      authenticationSuccess(res) {
        if (res.code === 200) {
          if (res.message.length === 0) {
            this.loginSuccess()
          } else {
            window.location.href = socialRedirectUrl + res.message
          }
        } else {
          this.requestFailed(res)
        }
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
    }
  }
</script>

<style lang="less" scoped>
    .container {
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        height: 60%;

        .load-container {
            margin: 50px auto;
            width: 150px;
            text-align: center;

            .load {
                width: 20px;
                height: 20px;
                background-color: #00adb5;

                border-radius: 100%;
                display: inline-block;
                -webkit-animation: bouncedelay 1.4s infinite ease-in-out;
                animation: bouncedelay 1.4s infinite ease-in-out;
                /* Prevent first frame from flickering when animation starts */
                -webkit-animation-fill-mode: both;
                animation-fill-mode: both;
            }

            .load1 {
                -webkit-animation-delay: -0.32s;
                animation-delay: -0.32s;
            }

            .load2 {
                -webkit-animation-delay: -0.16s;
                animation-delay: -0.16s;
            }
        }

        @-webkit-keyframes bouncedelay {
            0%, 80%, 100% {
                -webkit-transform: scale(0.0)
            }
            40% {
                -webkit-transform: scale(1.0)
            }
        }

        @keyframes bouncedelay {
            0%, 80%, 100% {
                transform: scale(0.0);
                -webkit-transform: scale(0.0);
            }
            40% {
                transform: scale(1.0);
                -webkit-transform: scale(1.0);
            }
        }
    }
</style>
