<template>
  <div>
    <top-table></top-table>
    <div class="Home-Main">
      <map-table></map-table>
      <main-table></main-table>
    </div>
  </div>
</template>

<script>
import TopTable from '@components/toptable/index.vue'
import MainTable from '@components/maintable/index.vue'
import MapTable from '@components/maptable/index.vue'

export default {
  components: {
    TopTable,
    MainTable,
    MapTable
  }
}
</script>

<style scoped>
.Home-Main {
  width: calc(100vw + 24em);
  height: calc(100vh - 5.2em);
  float: right;
}
</style>
