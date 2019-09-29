<template>
    <div class="container">
        <div class="profile">
            <h1>{{nickname}}</h1>
            <img :src="avatar">
        </div>
    </div>
</template>
<script>
  import {me} from '../api/login'

  export default {
    data() {
      return {
        avatar: '',
        nickname: ''
      }
    },
    methods: {
      _me() {
        return me();
      }
    },
    created() {
      this._me().then(res => {
        this.avatar = res.data.avatar
        this.nickname = res.data.nickname
        this.$notification.success({
          message: '欢迎',
          description: this.nickname + ' 欢迎回来'
        })
      })
    }
  }
</script>
<style lang="less">
    .container {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
    }
</style>
