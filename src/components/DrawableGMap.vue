
<template>
    <div id="map"></div>
</template>

<script>
// done with https://developers.google.com/maps/documentation/javascript/drawinglayer library
// +docs https://developers.google.com/maps/documentation/javascript/reference/drawing
import { Loader } from 'google-maps'
const apiKey = import.meta.env.GOOGLE_MAPS_API_KEY || 'AIzaSyCWjSQkpYWRMa93lsB6UbQ8jeEWtH7J43s'
const options = { libraries: ['drawing'] }
const loader = new Loader(apiKey, options)

export default {
  name: 'googleMaps',
  mounted: async function () {
    const google = await loader.load()
    const map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: -34.88338238343086, lng: -56.14534138394627 }, // INITIAL POSITION (MONTEVIDEO)
      zoom: 10
    })
    // add drawing menu
    const drawingManager = new google.maps.drawing.DrawingManager({
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
        zIndex: 1
      },
      polygonOptions: {
        strokeWeight: 1,
        clickable: false,
        editable: true,
        zIndex: 1
      },
      polylineOptions: {
        strokeWeight: 2,
        clickable: false,
        editable: true,
        zIndex: 1
      },
      rectangleOptions: {
        strokeWeight: 2,
        clickable: false,
        editable: true,
        zIndex: 1
      }
    })
    // particular event handler a overlay object on complete
    google.maps.event.addListener(drawingManager, 'circlecomplete', function (circle) {
      const radius = circle.getRadius()
      console.log('circle overlay listener', circle)
    })
    // callback when any overlay is completed
    google.maps.event.addListener(drawingManager, 'overlaycomplete', function (event) {
      console.log('overlaycomplete event type:', event.type)

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
    drawingManager.setMap(map)
    //  CONTROLS ARE EVEN MOVABLE :
    // drawingManager.setOptions({
    //   drawingControlOptions: {
    //     position: google.maps.ControlPosition.BOTTOM_LEFT,
    //   }
    // })
  }
}
</script>

<style scoped>
#map {
  height:100%;
}
</style>
