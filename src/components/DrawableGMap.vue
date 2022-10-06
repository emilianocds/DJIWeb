
<template>
  <button class="clear" v-on:click="clearShapes">Clear</button>
  <button class="clear" v-on:click="deleteShape(0)">Remove</button>
    <div id="map"></div>
</template>

<script>
// done with https://developers.google.com/maps/documentation/javascript/drawinglayer library
// +docs https://developers.google.com/maps/documentation/javascript/reference/drawing
import { Loader } from 'google-maps'
import { defineComponent } from 'vue'

const apiKey = import.meta.env.GOOGLE_MAPS_API_KEY || 'AIzaSyCWjSQkpYWRMa93lsB6UbQ8jeEWtH7J43s'
const options = { libraries: ['drawing'] }
const loader = new Loader(apiKey, options)

export default defineComponent({
  el: '#gmaps',
  name: 'googleMaps',
  data: function () {
    return {
      overlayShapes: [],
      drawingManager: {},
      initialMap: {},
    }
  },
  methods: {
    addShape: function (shape) {
      this.overlayShapes.push(shape)
    },

    deleteShape: function (index) {
      if (index < this.overlayShapes.length) {
        console.log('this.overlayShapes', this.overlayShapes[index].setMap)
        this.overlayShapes[index].setMap(null)
        this.overlayShapes.splice(index, 1)
        console.log('this.overlayShapes', this.overlayShapes)
      }
    },

    clearShapes: function () {
      console.log('clearMap')
      if (confirm('Want to clear all overlayShapes?')) {
        this.overlayShapes = []
        // TODO: Clear all somehow, worst case: iterate over all shapes and remove one by one
      }
    },
  },
  mounted: async function () {
    const google = await loader.load()
    this.initialMap = new google.maps.Map(document.getElementById('map'), {
      center: { lat: -34.88338238343086, lng: -56.14534138394627 }, // INITIAL POSITION (MONTEVIDEO)
      zoom: 10
    })
    this.overlayShapes = []
    // add drawing menu
    this.drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.MARKER,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          google.maps.drawing.OverlayType.MARKER,
          google.maps.drawing.OverlayType.CIRCLE,
          google.maps.drawing.OverlayType.POLYGON,
          google.maps.drawing.OverlayType.POLYLINE,

        ]
      },
      circleOptions: {
        strokeWeight: 1,
        clickable: false,
        editable: true,
        draggable: true,
        zIndex: 1
      },
      polygonOptions: {
        strokeWeight: 1,
        clickable: false,
        editable: true,
        draggable: true,
        zIndex: 1
      },
      polylineOptions: {
        strokeWeight: 2,
        clickable: false,
        editable: true,
        draggable: true,
        zIndex: 1
      },
      rectangleOptions: {
        strokeWeight: 2,
        clickable: false,
        editable: true,
        draggable: true,
        zIndex: 1
      }
    })

    // particular event handler a overlay object on complete
    google.maps.event.addListener(this.drawingManager, 'circlecomplete', (circle) => {
      const radius = circle.getRadius()
      // circle.setMap(null) this does remove the circle
    })
    // callback when any overlay is completed
    google.maps.event.addListener(this.drawingManager, 'overlaycomplete', (event) => {
      console.log('overlaycomplete event type:', event.type)
      console.log('overlay object:', event.overlay)

      this.overlayShapes.push(event.overlay)

      if (event.type === 'marker') {
        console.log('marker', event.overlay)
      }
      if (event.type === 'circle') {
        console.log('circle', event.overlay)
      }
      if (event.type === 'polyline') {
        console.log('polyline', event.overlay)
      }
      if (event.type === 'polygon') {
        console.log('polygon', event.overlay)
      }
      if (event.type === 'rectangle') {
        console.log('rectangle', event.overlay)
      }
    })
    this.drawingManager.setMap(this.initialMap)

    //  CONTROLS ARE EVEN MOVABLE :
    // drawingManager.setOptions({
    //   drawingControlOptions: {
    //     position: google.maps.ControlPosition.BOTTOM_LEFT,
    //   }
    // })
  }
})
</script>

<style scoped>
#map {
  height:100%;
}
.clear{
  background-color:crimson;
  color:white;
}
</style>
