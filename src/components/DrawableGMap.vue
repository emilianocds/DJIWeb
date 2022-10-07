
<template>
 <div id="shapes-list" >
  <div v-for="item in overlayShapes" :key="item">
    <div >{{ item.type }}, {{item.position}}</div>
  </div>
</div>
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
    addShape (shape) {
      this.overlayShapes.push(shape)
    },
    deleteShape (shapeRef) {
      alert(`Are you sure you want to delete ${shapeRef.type}`)
      shapeRef.setMap(null)
      console.log('$overlayShapes1--', this.overlayShapes.length)

      this.overlayShapes.splice(this.overlayShapes.indexOf(shapeRef), 1)
      console.log('$overlayShapes2--', this.overlayShapes.length)
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
    const that = this
    const google = await loader.load()
    this.initialMap = new google.maps.Map(document.getElementById('map'), {
      center: { lat: -34.88338238343086, lng: -56.14534138394627 }, // INITIAL POSITION (MONTEVIDEO)
      zoom: 10
    })
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
      markerOptions: {
        strokeWeight: 4,
        clickable: true,
        editable: true,
        draggable: true,
        zIndex: 1
      },
      circleOptions: {
        strokeWeight: 1,
        clickable: true,
        editable: true,
        draggable: true,
        zIndex: 1
      },
      polygonOptions: {
        strokeWeight: 1,
        clickable: true,
        editable: true,
        draggable: true,
        zIndex: 1
      },
      polylineOptions: {
        strokeWeight: 2,
        clickable: true,
        editable: true,
        draggable: true,
        zIndex: 1
      },
      rectangleOptions: {
        strokeWeight: 2,
        clickable: true,
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
      event.overlay.type = event.type
      that.addShape(event.overlay)

      // add event listener to all shapes created to Delete with right click
      google.maps.event.addListener(event.overlay, 'rightclick', function () {
        event.overlay.setMap(null)
        that.overlayShapes.splice(that.overlayShapes.indexOf(event.overlay), 1)
      })

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
#shapes-list{
  position:absolute;
  z-index:2;
  bottom:20px;
}
.clear{
  background-color:crimson;
  color:white;
}
</style>
