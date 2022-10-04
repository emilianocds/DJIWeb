<template>
  <div class="g-map-wrapper">

    <div id="load-script"> </div>

  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref, watch } from 'vue'
import { getApp } from '/@/root'
export default defineComponent({
  components: {
  },
  name: 'DrawableGMap',
  props: {},
  setup () {
    onMounted(() => {
      const app = getApp()
      const divScripts = document.getElementById('load-script')
      const newScript = document.createElement('script')
      newScript.src = 'https://cse.google.com/cse.js?cx=007968012720720263530:10z7awj2l37'
      divScripts.appendChild(newScript)
    })

    return {}
  }
})
</script>
// TODO: update api_key we are using mine( Mborbacds) https://maps.googleapis.com/maps/api/js?key={ import.meta.env.VITE_APP_ENVIRONMENT }&libraries=drawing&callback=initMap

<style lang="scss" scoped>

.g-map-wrapper {
  height: 100%;
  width: 100%;
}
</style>
