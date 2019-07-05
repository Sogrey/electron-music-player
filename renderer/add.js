const {
    ipcRenderer
} = require('electron')
const {$} = require('./helper')
const path = require('path')

let musicFileList = [];

$('select-music-button').addEventListener('click', () => {
    ipcRenderer.send('select-music-dialog') //发送选择音乐请求到主进程
})
$('import-music-button').addEventListener('click', () => {
    ipcRenderer.send('import-music',musicFileList) //发送导入音乐请求到主进程
})
const rendererMusic = (pathes) => {
    const musicList = $('musicList')
    const musicItemsHtml = pathes.reduce((html, music) => {
        html += `<li class="list-group-item">${path.basename(music)}</li>`
        return html
    }, '');
    musicList.innerHTML = `<ul class="list-group">${musicItemsHtml}</ul>`
};

ipcRenderer.on('select-files', (event, paths) => {
    if (Array.isArray(paths)){
        rendererMusic(paths);
        musicFileList = paths
    }        
})