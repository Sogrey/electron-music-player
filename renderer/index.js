const {
    ipcRenderer
} = require('electron')
const {
    $
} = require('./helper')


const renderListHTML = (tracks) => {
    const tracksList = $('tracksList')
    const tracksListHTML = tracks.reduce((html, track) => {
        html += `<li class="row music-track list-group-item d-flex justify-content-between align-items-center">
        <div class="col-10">
          <i class="fas fa-music mr-2 text-secondary"></i>
          <b>${track.fileName}</b>
        </div>
        <div class="col-2">
          <i class="fas fa-play mr-3" data-id="${track.id}"></i>
          <i class="fas fa-trash-alt" data-id="${track.id}"></i>
        </div>
      </li>`
        return html
    }, '')
    const emptyTrackHTML = '<div class="alert alert-primary">还没有添加任何音乐</div>'
    tracksList.innerHTML = tracks.length ? `<ul class="list-group">${tracksListHTML}</ul>` : emptyTrackHTML
}


$('add-music-button').addEventListener('click', () => {
    ipcRenderer.send('add-music-window') //发送添加音乐请求到主进程
})

// let allTracks = [];
ipcRenderer.on('update-musics', (event, updateTracks) => {
    if (Array.isArray(updateTracks)) {
        // alert(updateTracks);
        // allTracks = tracks
        renderListHTML(updateTracks)
    }
})