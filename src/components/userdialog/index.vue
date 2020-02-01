<template>
  <div class="UserDialog">
    <component v-bind:is="currentComponent"></component>
  </div>
</template>

<script>
import Login from './login.vue'

export default {
  name: 'userDialog',
  data () {
    return {
      currentComponent: Login,
      currentUser: '',
      currentChat: ''
    }
  },
  mounted () {
    this.$warehouse.compInstances.userDialog = this
  }
}
</script>

<style scoped>
.UserDialog {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
