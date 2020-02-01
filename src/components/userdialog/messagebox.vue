<template>
  <div class="MessageBox">
    <div class="MessageBox-Head">
      <input type="button" value="返回" @click="back">
    </div>
    <div class="MessageBox-Body">
      <scroll-box barYWidth="7px" barXHeight="0px" y-slipper-class="MessageBox-Bar-Slipper">
        <template v-slot:content>
          <div class="MessageBox-Msg" v-for="(item,index) in msg" :key="index">
            <div v-if="item.ifnotice === 'false'">
              <label>{{item.name}}新消息</label><br>
              <label>
                <i>{{item.time}}</i>
              </label>
            </div>
            <div v-if="item.ifnotice === 'true'">
              <label>{{item.name}}请求添加好友</label><br>
              <label>
                <i>{{item.time}}</i>
              </label>
            </div>
            <input type="button" style="right:3.5em;" v-if="item.ifnotice === 'true'" value="同意" @click="agree(item.name)">
            <input type="button" v-if="item.ifnotice === 'true'" value="拒绝" @click="refuse(item.name)">
            <input type="button" v-if="item.ifnotice === 'false'" value="查看" @click="view(item.name)">
          </div>
        </template>
      </scroll-box>
    </div>
  </div>
</template>

<script>
import User from './user.vue'
import ScrollBox from '@components/scrollbox/index.vue'
import chatbox from './chatbox.vue'

export default {
  data () {
    return {
      msg: []
    }
  },
  components: {
    ScrollBox
  },
  computed: {
    userDialog () {
      return this.$warehouse.compInstances.userDialog
    },
    User () {
      return this.$warehouse.compInstances.User
    }
  },
  mounted () {
    this.msg = this.User.messageBox
    this.$warehouse.user.onmessage = (msg) => {
      let index = msg.data.indexOf(':')
      let type = msg.data.slice(0, index)
      let data = msg.data.slice(index + 1, msg.data.length)
      if (type === 'message') {
        if (data !== '' && JSON.parse(data)) {
          this.msg = JSON.parse(data)
        } else {
          this.msg = []
        }
      }
    }
  },
  methods: {
    back () {
      this.userDialog.currentComponent = User
    },
    agree (name) {
      this.$warehouse.user.send(`agree:${this.userDialog.currentUser},${name}`)
    },
    refuse (name) {
      this.$warehouse.user.send(`refuse:${this.userDialog.currentUser},${name}`)
    },
    view (name) {
      this.$warehouse.user.send(`view:${this.userDialog.currentUser},${name}`)
      this.userDialog.currentComponent = chatbox
      this.userDialog.currentChat = name
    }
  }
}
</script>

<style scoped>
.MessageBox {
  width: 100%;
  height: 100%;
}
.MessageBox-Head {
  width: 100%;
  height: 3em;
  text-align: center;
}
.MessageBox-Head input {
  position: absolute;
  left: 0.2em;
  top: 0.2em;
  border: 0;
  border-radius: 2px;
  padding: 0.3em 0.4em;
  font-family: 'youyuan';
  -webkit-transition: background-color 0.6s;
  -moz-transition: background-color 0.6s;
  -o-transition: background-color 0.6s;
  transition: background-color 0.6s;
}
.MessageBox-Head input:hover {
  background-color: #bdc3c7;
}
.MessageBox-Body {
  width: 100%;
  height: calc(100% - 3em);
  box-sizing: border-box;
  border: 1px solid lightgray;
}
.MessageBox-Msg {
  position: relative;
  padding: 0.2em;
  width: 26.7em;
}
.MessageBox-Msg:hover {
  background-color: #e5eaeb;
}
.MessageBox-Msg label {
  font-size: 14px;
  font-family: 'youyuan';
}
.MessageBox-Msg input {
  position: absolute;
  top: 0.5em;
  right: 0.2em;
  border: 0;
  border-radius: 2px;
  padding: 0.3em 0.4em;
  font-family: 'youyuan';
  -webkit-transition: background-color 0.6s;
  -moz-transition: background-color 0.6s;
  -o-transition: background-color 0.6s;
  transition: background-color 0.6s;
}
.MessageBox-Msg input:hover {
  background-color: #bdc3c7;
}
</style>
<style>
.MessageBox-Bar-Slipper {
  background-color: #bdc3c7;
  border-radius: 10px;
  -webkit-transition: background-color 0.6s;
  -moz-transition: background-color 0.6s;
  -o-transition: background-color 0.6s;
  transition: background-color 0.6s;
}
.MessageBox-Bar-Slipper:hover {
  background-color: #95a5a6;
}
</style>
