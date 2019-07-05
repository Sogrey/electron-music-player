const {ipcRenderer} = require('electron')
const { $ } = require('./helper')

$('add-music-button').addEventListener('click',()=>{
    ipcRenderer.send('add-music-window')//发送添加音乐请求到主进程
})