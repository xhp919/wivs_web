<template>
  <div class="UserTable">
    <img @click="switchUserDialog" src="/img/user24.png">
  </div>
</template>

<script>
import userDialog from '@components/userdialog/index.vue'

export default {
  data () {
    return {
      ifOn: false
    }
  },
  computed: {
    Dialog () {
      return this.$warehouse.compInstances.Dialog
    }
  },
  methods: {
    switchUserDialog () {
      if (this.ifOn) {
        this.Dialog.removeTab(userDialog)
        this.ifOn = false
      } else {
        this.Dialog.addTab('用户', userDialog)
        this.ifOn = true
      }
    }
  }
}
</script>

<style scoped>
.UserTable {
  width: 2.4em;
  height: 2.4em;
  border-radius: 50%;
  position: absolute;
  right: 1.3em;
  top: 1.3em;
  overflow: hidden;
}
.UserTable:hover {
  box-shadow: 0 0 0.25em 0.1875em rgb(220, 220, 220);
}
</style>
