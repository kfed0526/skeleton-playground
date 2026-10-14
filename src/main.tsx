import React from 'react'
import {createRoot} from 'react-dom/client'
import App from './App'
import './style.css'
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>)
if('serviceWorker' in navigator&&import.meta.env.PROD){const controlled=!!navigator.serviceWorker.controller;let refreshing=false;navigator.serviceWorker.addEventListener('controllerchange',()=>{if(controlled&&!refreshing){refreshing=true;location.reload()}});window.addEventListener('load',()=>{void navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js?v=${__BUILD_ID__}`,{updateViaCache:'none'}).then(r=>r.update()).catch(()=>{})})}
