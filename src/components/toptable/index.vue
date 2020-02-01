<template>
  <div class="TopTable">
    <div>
      <img src="/img/logo.png" />
    </div>
    <search-box></search-box>
    <user-table></user-table>
  </div>
</template>

<script>
import SearchBox from '@components/searchbox/index.vue'
import UserTable from '@components/usertable/index.vue'

export default {
  mounted () {
    this.$warehouse.compInstances.TopTable = this
  },
  components: {
    SearchBox,
    UserTable
  }
}
</script>

<style scoped>
.TopTable {
  width: 100%;
  height: 5.2em;
  background-color: rgb(67, 163, 170);
  box-shadow: 0 1px 3px rgba(26,26,26,.1);
  position: relative;
  z-index: 2000;
}
</style>
