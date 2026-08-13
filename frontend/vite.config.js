import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
export default defineConfig({ plugins:[react(), VitePWA({registerType:'autoUpdate',manifest:{name:'DhabaPOS',short_name:'DhabaPOS',theme_color:'#b94016',background_color:'#fffaf5',display:'standalone',icons:[{src:'/favicon.jpg',sizes:'any',type:'image/jpeg',purpose:'any'}]},workbox:{navigateFallback:'/index.html'}})] })
