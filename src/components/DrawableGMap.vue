
<template>
 <div id="shapes-list" v-if="overlayShapes.length > 0" >
  <div v-for="item in overlayShapes" :key="item">
    <div > <a @click="item.deleteSpan.onclick" v-html="item.deleteSpan.outerHTML" /> <span id="shapes-list-item" :class="{ 'shape-on-hover': shapeOnHover === item.id }" @mouseover="this.selectShape(item)" @mouseout="this.unSelectShape()" >{{ this.renderTypeName(item) }}, {{this.getShapePosition(item)}}</span></div>
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
      selectedShape: 0,
      drawingManager: {},
      initialMap: {},
      shapeLabel: 1,
      drone: {},
      google: {},
      shapeOnHover: null,
    }
  },
  methods: {
    addShape (shape) {
      shape.id = this.shapeLabel
      if (shape.type === 'marker') {
        shape.setLabel(this.shapeLabel.toString())
      }
      this.incrementShapeLabel()
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
    incrementShapeLabel () {
      this.shapeLabel++
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
    renderTypeName: function (shape) {
      return `${shape.id} - ${shape.type.charAt(0).toUpperCase() + shape.type.slice(1)}`
    },
    getShapePosition: function (shape) {
      switch (shape.type) {
        case SHAPES.circle:
          return shape?.getCenter?.()
        case SHAPES.marker:
          return shape?.getPosition?.()
        case SHAPES.polygon:
        case SHAPES.polyline:
          return shape?.getPath?.().getAt(0)
      }
    },
    centerMapToShape: function (shape) {
      shape.getMap().setCenter(this.getShapePosition(shape))
    },
    selectShape (shape) {
      if (this.selectedShape) {
        if (this.selectedShape.type === SHAPES.marker) {
          this.selectedShape.setAnimation(null)
        } else {
          this.selectedShape.setOptions({ strokeColor: 'black', fillColor: 'black' })
        }
      } // last selected is de-selected

      if (shape.type === SHAPES.marker) {
        shape.setAnimation(this.google.maps.Animation.BOUNCE)
      } else {
        shape.setOptions({ strokeColor: 'blue', fillColor: 'blue' })
      }
      this.selectedShape = shape
    },
    unSelectShape () {
      if (this.selectedShape) {
        if (this.selectedShape.type === SHAPES.marker) {
          this.selectedShape.setAnimation(null)
        } else {
          this.selectedShape.setOptions({ strokeColor: 'black', fillColor: 'black' })
        }
      } // last selected is de-selected
    },
  },
  mounted: async function () {
    const that = this
    const google = await loader.load()
    this.google = google
    this.initialMap = new google.maps.Map(document.getElementById('map'), {
      center: { lat: -34.88338238343086, lng: -56.14534138394627 }, // INITIAL POSITION (MONTEVIDEO)
      zoom: 10,
      streetViewControl: false, // does not seem necessary
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
        zIndex: 1,
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

      google.maps.event.addListener(event.overlay, 'mouseover', function () {
        event.overlay.setOptions({ strokeColor: 'blue', fillColor: 'blue' })
        that.shapeOnHover = event.overlay.id
      })
      google.maps.event.addListener(event.overlay, 'mouseout', function () {
        event.overlay.setOptions({ strokeColor: 'black', fillColor: 'black' })
        that.shapeOnHover = null
      })

      // to remove all shapes
      document
        .getElementById('remove-all')
        .addEventListener('click', function () {
          that.shapeLabel = 1
          event.overlay.setMap(null)
          that.overlayShapes.splice(that.overlayShapes.indexOf(event.overlay), 1)
        })

      if (event.type === SHAPES.marker) {
        console.log('marker', event.overlay)
      }
      if (event.type === SHAPES.circle) {
        console.log('circle', event.overlay)
      }
      if (event.type === SHAPES.polyline) {
        console.log('polyline', event.overlay)
      }
      if (event.type === SHAPES.polygon) {
        console.log('polygon', event.overlay)
      }
      if (event.type === SHAPES.polylirectanglene) {
        console.log('rectangle', event.overlay)
      }
    })

    const coords = [(-34.907232837397544, -56.149853973243474),
      (-34.90413570697162, -56.153802184913395),
      (-34.90075688600939, -56.15895202622199),
      (-34.8982226790612, -56.16324356064582),
      (-34.89484361483305, -56.16873672470832),
      (-34.89104200142728, -56.17388656601691),
      (-34.88738102225599, -56.17920806870246),
      (-34.883860696148524, -56.18367126450324)]

    const svgMarker = { // TODO: change drone svg path
      path: 'M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z',
      fillColor: 'blue',
      fillOpacity: 0.6,
      strokeWeight: 0,
      rotation: 0,
      scale: 2,
      anchor: new google.maps.Point(15, 30),
    }
    google.maps.event.addListener(this.initialMap, 'click', function (event) {
      console.log('event', event)
      const result = [event.latLng.lat(), event.latLng.lng()]
      transition(result)
    })

    this.drone = new google.maps.Marker({
      position: this.initialMap.getCenter(),
      icon: svgMarker,
      map: this.initialMap,
    })
    const position = this.drone.getPosition()
    const numDeltas = 100
    const delay = 10 // milliseconds
    let i = 0
    let deltaLat
    let deltaLng

    const transition = (result) => {
      i = 0
      deltaLat = (result[0] - position.lat()) / numDeltas
      deltaLng = (result[1] - position.lng()) / numDeltas
      console.log('-------', deltaLat, deltaLng)
      moveDrone()
    }

    const moveDrone = () => {
      position[0] += deltaLat
      position[1] += deltaLng
      console.log('position:', position)
      const latlng = new google.maps.LatLng(position[0], position[1])
      console.log('Latitude:' + position[0] + ' | Longitude:' + position[1])
      // this.drone.setTitle('Latitude:' + position[0] + ' | Longitude:' + position[1])
      /* eslint-disable no-debugger */
      debugger
      this.drone.setPosition(latlng)
      // this.drone.setMap(this.initialMap)
      if (i !== numDeltas) {
        i++
        // setTimeout(moveDrone, delay)
      }
    }

    //  CONTROLS ARE EVEN MOVABLE :
    // drawingManager.setOptions({
    //   drawingControlOptions: {
    //     position: google.maps.ControlPosition.BOTTOM_LEFT,
    //   }
    // })
    this.drawingManager.setMap(this.initialMap)
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
#shapes-list a{
  font-size: 12px;
}
#shapes-list-item{
  cursor: pointer;
}
.shape-on-hover,
#shapes-list-item:hover{
  color: blue;
}
#remove-all{
  position:absolute;
  font-size: 11.7px;
  padding: 3px 4px 3px 4px;
  border-radius: 2px;
  margin:5px;
  left:55%;
  z-index: 2;
  background-color:white;
  color:DimGray;
  border: none;
  transform: translateX(35%);
}
#remove-all:hover{
  background-color:lightGray;
  }
</style>
