<template>
  <div class="Login">
    <div class="Login-img"></div>
    <div class="Login-inp">
      <input placeholder="账号" v-model="account" v-on:keyup.enter="login" maxlength="10">
      <input placeholder="密码" type="password" v-model="password" v-on:keyup.enter="login" maxlength="20">
    </div>
    <div class="Login-Login">
      <input type="button" :value="loginBtn" @click="login">
    </div>
    <div class="Login-Login">
      <input type="button" value="修改密码" @click="modify">
      <input type="button" value="注册" @click="register">
    </div>
  </div>
</template>

<script>
import Register from './register.vue'
import Modify from './modify.vue'
import User from './user.vue'
import Login from './login.vue'

export default {
  data () {
    return {
      account: '',
      password: '',
      loginBtn: '登录',
      running: false
    }
  },
  computed: {
    userDialog () {
      return this.$warehouse.compInstances.userDialog
    }
  },
  methods: {
    login () {
      if (this.account === '' || this.password === '') {
        alert('请将账号和密码输入完整')
      } else if (this.running) {
        return ''
      } else {
        this.loginBtn = '登录...'
        this.running = true
        let ws = new WebSocket(this.$wivsConfig.user.socket)
        ws.onopen = (e) => {
          ws.send(`login:${this.account},${this.password}`)
        }
        ws.onmessage = (msg) => {
          let type = msg.data.split(':')[0]
          let data = msg.data.split(':')[1]
          if (type === 'login') {
            if (JSON.parse(data)) {
              this.$warehouse.user = ws
              this.userDialog.currentComponent = User
              this.userDialog.currentUser = this.account
            } else {
              alert('账号或密码错误')
              if (ws) {
                ws.close()
              }
            }
            this.running = false
          }
        }
        ws.onclose = () => {
          this.loginBtn = '登录'
          this.userDialog.currentComponent = Login
        }
      }
    },
    register () {
      this.userDialog.currentComponent = Register
    },
    modify () {
      this.userDialog.currentComponent = Modify
    }
  }
}
</script>

<style scoped>
.Login {
  width: 100%;
  height: 100%;
}
.Login-img {
  margin: 0 auto;
  position: relative;
  top: 5em;
  width: 10em;
  height: 10em;
  background-size: cover;
  background-image: url("/img/user72.png");
}
.Login-inp {
  position: relative;
  top: 8em;
  text-align: center;
  margin: 0 auto;
}
.Login-inp input {
  padding:0 0.3em 0 0.5em;
  margin-bottom: 1em;
  border: 1px solid lightgray;
  border-radius: 5px;
  height: 2em;
}
.Login-Login {
  position: relative;
  top: 7em;
  margin: 1em auto;
  text-align: center;
}
.Login-Login input {
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
.Login-Login input:hover {
  background-color: #bdc3c7;
}
.Login-Login input:active {
  background-color: #95a5a6;
}
</style>
