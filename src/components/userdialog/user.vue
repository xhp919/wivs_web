<template>
  <div class="User">
    <div class="User-Head">
      <label v-html="userName"></label>
      <br>
      <input type="button" value="退出" @click="exit">
      <div style="display:inline-block;position:relative;">
        <input type="button" value="消息" @click="getMessage">
        <div class="User-RedPoint" v-show="redPoint"></div>
      </div>
      <input style="float:right;" type="button" value="添加好友" @click="addFriend">
    </div>
    <input class="User-SearchFriend" placeholder="搜索我的好友" v-model="inputText">
    <div class="User-Body">
      <scroll-box barYWidth="7px" barXHeight="0px" y-slipper-class="User-Bar-Slipper">
        <template v-slot:content>
          <div v-for="(item, index) in friendsList" :key="index" class="User-Friend" @dblclick="openChatBox(item)">
            <span>
              {{item}}
            </span>
            <input type="button" value="删除" @click="remove(item)">
          </div>
        </template>
      </scroll-box>
    </div>
  </div>
</template>

<script>
import ScrollBox from '@components/scrollbox/index.vue'
import Login from './login.vue'
import chatbox from './chatbox.vue'
import MessageBox from './messagebox.vue'
import AddFriend from './addfriend.vue'

export default {
  data () {
    return {
      userName: '',
      friendsList: [],
      friends: [],
      inputText: '',
      redPoint: false,
      messageBox: []
    }
  },
  computed: {
    userDialog () {
      return this.$warehouse.compInstances.userDialog
    }
  },
  components: {
    ScrollBox
  },
  mounted () {
    this.$warehouse.compInstances.User = this
    this.userName = this.userDialog.currentUser
    this.$warehouse.user.send(`getFriends:${this.userName}`)
    this.$warehouse.user.send(`getMessage:${this.userName}`)
    this.$warehouse.user.onmessage = (msg) => {
      let index = msg.data.indexOf(':')
      let type = msg.data.slice(0, index)
      let data = msg.data.slice(index + 1, msg.data.length)
      if (type === 'friends') {
        if (JSON.parse(data)) {
          this.friends = JSON.parse(data)
          this.friendsList = JSON.parse(data)
        }
      }
      if (type === 'message') {
        if (data !== '' && JSON.parse(data)) {
          this.messageBox = JSON.parse(data)
        }
      }
    }
  },
  methods: {
    exit () {
      this.$warehouse.user.close()
      this.userDialog.currentComponent = Login
      this.userDialog.currentUser = ''
    },
    remove (item) {
      for (let i in this.friendsList) {
        if (this.friendsList[i] === item) {
          this.$warehouse.user.send(`deleteFriend:${this.userName},${item}`)
          this.friendsList.splice(i, 1)
          break
        }
      }
    },
    openChatBox (item) {
      this.userDialog.currentComponent = chatbox
      this.userDialog.currentChat = item
    },
    getMessage () {
      this.userDialog.currentComponent = MessageBox
    },
    addFriend () {
      this.userDialog.currentComponent = AddFriend
    }
  },
  watch: {
    inputText () {
      if (this.inputText === '') {
        this.friendsList = this.friends
      } else {
        this.friendsList = []
        for (let i in this.friends) {
          if (this.friends[i].indexOf(this.inputText) !== -1) {
            this.friendsList.push(this.friends[i])
          }
        }
      }
    },
    messageBox () {
      if (this.messageBox.length === 0) {
        this.redPoint = false
      } else {
        this.redPoint = true
      }
    }
  }
}
</script>

<style scoped>
.User {
  position: relative;
  width: 100%;
  height: 100%;
}
.User-Head {
  width: 100%;
  padding: 0.4em 0;
  margin-top: 0.5em;
}
.User-Head label {
  display: inline-block;
  vertical-align: middle;
  font-size: 16px;
  width: 100%;
  height: 26px;
  font-family: 'youyuan'
}
.User-Head input {
  border: 0;
  border-radius: 2px;
  padding: 0.3em 0.4em;
  margin: 0 0.3em 0 0;
  font-family: 'youyuan';
  -webkit-transition: background-color 0.6s;
  -moz-transition: background-color 0.6s;
  -o-transition: background-color 0.6s;
  transition: background-color 0.6s;
}
.User-Head input:hover {
  background-color: #bdc3c7;
}
.User-Head input:active {
  background-color: #95a5a6;
}
.User-RedPoint {
  display: inline-block;
  position: relative;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  left: -0.3em;
  top: -1em;
  background-color: red;
}
.User-SearchFriend {
  display: block;
  width: 94%;
  height: 2em;
  border: 1px solid lightgray;
  padding: 0 0.5em;
  border-radius: 5px;
}
.User-Body {
  position: relative;
  margin: 0.2em 0.3em 0 0;
  width: 99%;
  height: calc(100% - 9.5em);
  border: 1px solid lightgray;
  border-radius: 5px;
}
.User-Friend {
  width: 26.1em;
  padding: 0.5em;
}
.User-Friend:hover {
  background-color: #ecf0f1;
}
.User-Friend span {
  font-size: 18px;
  font-family: 'youyuan';
}
.User-Friend input {
  float: right;
  border: 0;
  border-radius: 2px;
  padding: 0.1em 0.4em;
  margin: 0 0.3em 0 0;
  font-family: 'youyuan';
  -webkit-transition: background-color 0.6s;
  -moz-transition: background-color 0.6s;
  -o-transition: background-color 0.6s;
  transition: background-color 0.6s;
  background-color: #e2e5e5;
}
.User-Friend input:hover {
  background-color: #bdc3c7;
}
</style>
<style>
.User-Bar-Slipper {
  background-color: #bdc3c7;
  border-radius: 10px;
  -webkit-transition: background-color 0.6s;
  -moz-transition: background-color 0.6s;
  -o-transition: background-color 0.6s;
  transition: background-color 0.6s;
}
.User-Bar-Slipper:hover {
  background-color: #95a5a6;
}
</style>
