export const CURRENT_CONFIG = {

  // license
  appId: '122684', // You need to go to the development website to apply.
  appKey: '35e9fe0afa21d0efa2ef1b06816dea7', // You need to go to the development website to apply.
  appLicense: 'X/1CY3hvLnVyJyh+Yedw9oWENHMEg4iGgz9dhUbGA6f9BBCpqQmlSQ1RR1p/5ycEbeAxCXyZciTRlx8gGnOG7Kdoh0ioRxIeDYeBRd137wv9ZFr4aBIxQ6BffsACGM1VzuicOWNmeT+hiRQQ11hLU+oLrkT3o1GGH7OxdlbMdW0=', // You need to go to the development website to apply.

  // http
  baseURL: 'http://192.168.1.17:6789/', // This url must end with "/". Example: 'http://192.168.1.1:6789/'
  websocketURL: 'ws://192.168.1.17:6789/api/v1/ws', // Example: 'ws://192.168.1.1:6789/api/v1/ws'

  // livestreaming
  // RTMP  Note: This IP is the address of the streaming server. If you want to see livestream on web page, you need to convert the RTMP stream to WebRTC stream.
  rtmpURL: 'rtmp://192.168.1.17/live/', // Example: 'rtmp://192.168.1.1/live/'
  // GB28181 Note:If you don't know what these parameters mean, you can go to Pilot2 and select the GB28181 page in the cloud platform. Where the parameters same as these parameters.
  gbServerIp: 'Please enter the server ip.',
  gbServerPort: 'Please enter the server port.',
  gbServerId: 'Please enter the server id.',
  gbAgentId: 'Please enter the agent id',
  gbPassword: 'Please enter the agent password',
  gbAgentPort: 'Please enter the local port.',
  gbAgentChannel: 'Please enter the channel.',
  // RTSP
  rtspUserName: 'Please enter the username.',
  rtspPassword: 'Please enter the password.',
  rtspPort: '8554',
  // Agora
  agoraAPPID: 'Please enter the agora app id.',
  agoraToken: 'Please enter the agora temporary token.',
  agoraChannel: 'Please enter the agora channel.',

  // map
  // You can apply on the AMap website.
  amapKey: 'c0ee23ad2324c26661065de94f5b5676',
   // Google map key
  gmapKey: 'AIzaSyCWjSQkpYWRMa93lsB6UbQ8jeEWtH7J43s',

}
