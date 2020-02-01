<template>
  <div class="Modify">
    <div class="Modify-img"></div>
    <div class="Modify-inp">
      <input placeholder="账号" v-model="account" v-on:keyup.enter="modify" maxlength="10">
      <input placeholder="旧密码" type="password" v-model="oldPsw" v-on:keyup.enter="modify" maxlength="20">
      <input placeholder="新密码" type="password" v-model="newPsw" v-on:keyup.enter="modify" maxlength="20">
    </div>
    <div class="Modify-Modify">
      <input type="button" value="修改" @click="modify">
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
      oldPsw: '',
      newPsw: '',
      running: false
    }
  },
  methods: {
    back () {
      this.$warehouse.compInstances.userDialog.currentComponent = Login
    },
    modify () {
      if (this.account === '' || this.oldPsw === '' || this.newPsw === '') {
        alert('请输入完整')
        return ''
      }
      if (this.running) {
        return ''
      }
      this.running = true
      this.$axios({
        method: 'post',
        url: this.$wivsConfig.user.api.modify,
        data: { account: this.account, oldPsw: this.oldPsw, newPsw: this.newPsw }
      }).then((res) => {
        this.running = false
        if (res.data) {
          alert('修改成功')
        } else {
          alert('密码错误，修改失败')
        }
      })
    }
  }
}
</script>

<style scoped>
.Modify {
  width: 100%;
  height: 100%;
}
.Modify-img {
  margin: 0 auto;
  position: relative;
  top: 5em;
  width: 10em;
  height: 10em;
  background-size: cover;
  background-image: url("/img/user72.png");
}
.Modify-inp {
  position: relative;
  top: 8em;
  text-align: center;
  margin: 0 auto;
}
.Modify-inp input {
  padding:0 0.3em 0 0.5em;
  margin-bottom: 1em;
  border: 1px solid lightgray;
  border-radius: 5px;
  height: 2em;
}
.Modify-Modify {
  position: relative;
  top: 7em;
  margin: 1em auto;
  text-align: center;
}
.Modify-Modify input {
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
.Modify-Modify input:hover {
  background-color: #bdc3c7;
}
.Modify-Modify input:active {
  background-color: #95a5a6;
}
</style>
