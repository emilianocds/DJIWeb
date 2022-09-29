@@ -0,0 +1,37 @@
<template>
    <GMapMap
        :center="center"
        :zoom="7"
        map-type-id="terrain"
        style="width: 100%; height: 100%; position: absolute;"

    >
      <GMapCluster>
        <GMapMarker
            :key="index"
            v-for="(m, index) in markers"
            :position="m.position"
            :clickable="true"
            :draggable="true"
            @click="center=m.position"
        />
      </GMapCluster>
    </GMapMap>
  </template>
<script lang="ts">
export default {
  name: 'App',
  data () {
    return {
      center: { lat: 51.093048, lng: 6.842120 },
      markers: [
        {
          position: {
            lat: 51.093048, lng: 6.842120
          },
        }, // Along list of clusters
      ]
    }
  }
}
</script>