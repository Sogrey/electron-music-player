const {ipcRenderer} = require('electron')

document.getElementById('select-music-button').addEventListener('click',()=>{
    ipcRenderer.send('select-music-dialog')//发送选择音乐请求到主进程
})
document.getElementById('import-music-button').addEventListener('click',()=>{
    ipcRenderer.send('import-music')//发送导入音乐请求到主进程
})