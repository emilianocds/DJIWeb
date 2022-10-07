
<template>
 <div id="shapes-list" v-if="overlayShapes.length > 0" >
  <div v-for="item in overlayShapes" :key="item">
    <div > <a @click="item.deleteSpan.onclick" v-html="item.deleteSpan.outerHTML" /> {{ this.renderTypeName(item.type) }}, {{this.getShapePosition(item)}}</div>
  </div>
</div>
 <a id="remove-all" v-show="overlayShapes.length > 0">❌ Remove all shapes</a>
    <div id="map"></div>
</template>

<script>
// done with https://developers.google.com/maps/documentation/javascript/drawinglayer library
// +docs https://developers.google.com/maps/documentation/javascript/reference/drawing
import { Loader } from 'google-maps'
import { defineComponent } from 'vue'
import { CURRENT_CONFIG } from '/@/api/http/config'

const apiKey = CURRENT_CONFIG.gmapKey
const options = { libraries: ['drawing'] }
const loader = new Loader(apiKey, options)

const SHAPES = {
  circle: 'circle',
  marker: 'marker',
  polygon: 'polygon',
  polyline: 'polyline',
}

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
      const deleteSpan = document.createElement('span')
      deleteSpan.innerHTML = '❌  :'
      // to remove particular shape
      shape.deleteSpan = deleteSpan
      deleteSpan.onclick = () => {
        shape.setMap(null)
        this.overlayShapes.splice(this.overlayShapes.indexOf(shape), 1)
      }
      // I believe adding the google overlay object to Vue state messes it up
      this.overlayShapes.push(shape)
    },
    deleteShape (shapeRef) {
      alert(`Are you sure you want to delete ${shapeRef.type}`)
      shapeRef.setMap(null)
      this.overlayShapes.splice(this.overlayShapes.indexOf(shapeRef), 1)
    },
    clearShapes: function () {
      console.log('clearMap')
      if (confirm('Want to clear all overlayShapes?')) {
        this.overlayShapes = []
      }
    },
    renderTypeName: function (typeName) {
      return typeName.charAt(0).toUpperCase() + typeName.slice(1)
    },
    getShapePosition: function (shape) {
      switch (shape.type) {
        case SHAPES.circle:
          return shape?.getCenter?.()
        case SHAPES.marker:
          return shape?.getPosition?.()
        case SHAPES.polygon:
        case SHAPES.polyline:
          return shape?.getPath?.().getAt(0).toString()
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
      // to remove all shapes
      document
        .getElementById('remove-all')
        .addEventListener('click', function () {
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
  color: rgb(243, 243, 243);
  background-color: rgba(0, 0, 0, 0.391);
  /* border: 2px solid rgba(0, 0, 0, 0.373); */
  border: 2px solid rgba(255, 0, 0, 0.373);
  border-radius: 5px;
  z-index:2;
  bottom:30px;
  margin-left: 10px;
  padding: 8px;
}
#remove-all{
  position:absolute;
  margin:5px;
  left:75%;
  z-index: 2;
  background-color:white;
  color:DimGray;
  border: none;
}
#remove-all:hover{
  background-color:lightGray;
  }
</style>
