<template>
  <div class="Register">
    <div class="Register-img"></div>
    <div class="Register-inp">
      <input placeholder="账号" maxlength="10" v-model="account">
      <input placeholder="密码" type="password" maxlength="20" v-model="psw" v-on:keyup.enter="register">
      <input placeholder="确认密码" type="password" maxlength="20" v-model="confirmPsw" v-on:keyup.enter="register">
    </div>
    <div class="Register-Register">
      <input type="button" value="注册" @click="register">
      <input type="button" value="返回" @click="back">
    </div>
  </div>
</template>

<script>
import Login from './login.vue'

export default {
  data () {
    return {
      account: '',
      psw: '',
      confirmPsw: '',
      running: false
    }
  },
  methods: {
    back () {
      this.$warehouse.compInstances.userDialog.currentComponent = Login
    },
    register () {
      if (this.account === '' || this.psw === '' || this.confirmPsw === '') {
        alert('请输入完整')
        return ''
      }
      if (this.psw !== this.confirmPsw) {
        alert('密码不一致')
        return ''
      }
      this.running = true
      this.$axios({
        method: 'post',
        url: this.$wivsConfig.user.api.register,
        data: { account: this.account, psw: this.psw }
      }).then((res) => {
        this.running = false
        if (res.data) {
          alert('注册成功')
        } else {
          alert('账号已被注册')
        }
      })
    }
  }
}
</script>

<style scoped>
.Register {
  width: 100%;
  height: 100%;
}
.Register-img {
  margin: 0 auto;
  position: relative;
  top: 5em;
  width: 10em;
  height: 10em;
  background-size: cover;
  background-image: url("/img/user72.png");
}
.Register-inp {
  position: relative;
  top: 8em;
  text-align: center;
  margin: 0 auto;
}
.Register-inp input {
  padding:0 0.3em 0 0.5em;
  margin-bottom: 1em;
  border: 1px solid lightgray;
  border-radius: 5px;
  height: 2em;
}
.Register-Register {
  position: relative;
  top: 7em;
  margin: 1em auto;
  text-align: center;
}
.Register-Register input {
  width: 5em;
  height: 2em;
  border: 0;
  border-radius: 3px;
  margin: 0 0.5em;
  -webkit-transition: background-color 0.6s;
  -moz-transition: background-color 0.6s;
  -o-transition: background-color 0.6s;
  transition: background-color 0.6s;
}
.Register-Register input:hover {
  background-color: #bdc3c7;
}
.Register-Register input:active {
  background-color: #95a5a6;
}
</style>
