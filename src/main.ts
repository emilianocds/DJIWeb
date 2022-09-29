import App from './App.vue'
import router from './router'
import { antComponents } from './antd'
import { CommonComponents } from './use-common-components'
import 'virtual:svg-icons-register'
import store, { storeKey } from './store'
import { createInstance } from '/@/root'
import '/@/styles/index.scss'

import VueGoogleMaps from '@fawmi/vue-google-maps'

const app = createInstance(App)
app.use(store, storeKey)
app.use(router)
app.use(CommonComponents)
app.use(antComponents)
app.use(VueGoogleMaps, {
  load: {
    key: '',
  },
})
app.mount('#demo-app')

// const app = createApp(App);
// app.use(VueGoogleMaps, {
//     load: {
//         key: 'YOUR_API_KEY_COMES_HERE',
//     },
// }).mount('#app')
