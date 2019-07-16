const {
    ipcRenderer,
    remote
} = require('electron')
const {
    $,
    $Selector
} = require('./helper')

//这将使网页在 `el` 外面时穿透，在它内部正常。
let win = remote.getCurrentWindow()
let el = $('play-content')
el.addEventListener('mouseenter', () => {
    win.setIgnoreMouseEvents(false)
  
})
el.addEventListener('mouseleave', () => {
    win.setIgnoreMouseEvents(true, { forward: true })
})

// const jsmediatags = require('jsmediatags');

const {
    Menu,
    MenuItem
} = remote;

//右键餐单
const menu = new Menu();
menu.append(new MenuItem({
    label: '主窗口',
    click: function () {
        ipcRenderer.send('toggle-mainWindow') //显示/隐藏主窗口
    }
}));
menu.append(new MenuItem({
    type: 'separator'
})); //分割线
menu.append(new MenuItem({
    label: '关闭播放器',
    role: 'close'
})); //选中
menu.append(new MenuItem({
    label: '退出',
    click: function () {
        ipcRenderer.send('exit') //退出
    }
})); //选中

window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    menu.popup({
        window: remote.getCurrentWindow()
    })
}, false)

$('play-menu').addEventListener('click', () => {
    // e.preventDefault();
    menu.popup({
        window: remote.getCurrentWindow()
    })
})

let aplayer;
let allTracks = [];

//播放音乐
ipcRenderer.on('play-music-window', (event, music) => {
    console.log('play-music-window')
    if (aplayer) {
        console.log(music);
        if (allTracks instanceof Array && allTracks.length > 0) {
            let isInclude = false;
            let musicIndex = -1;
            for (let index = 0; index < allTracks.length; index++) {
                const track = allTracks[index];
                if (track.id == music.id) {
                    isInclude = true;
                    musicIndex = index;
                    break;
                }
            }

            if(!isInclude){
                isInclude.push(music);
                musicIndex = allTracks.length;
                ap.list.add([{
                    id: music.id,
                    name: music.fileName,
                    artist: '未定义',
                    url: music.path,
                    cover: '../musics/nopic.jpg',
                    theme: '#ebd0c2'
                }]);
            }
            aplayer.list.switch(musicIndex);
        }

        aplayer.play();
    }
})
//暂停播放音乐
ipcRenderer.on('pause-music-window', (event, music) => {
    console.log('pause-music-window')
    if (aplayer) {
        aplayer.pause();
    }
})
//继续播放音乐
ipcRenderer.on('continue-music-window', (event, music) => {
    console.log('continue-music-window')
    if (aplayer) {
        aplayer.play();
    }
})


ipcRenderer.on('update-musics', (event, updateTracks) => {
    if (Array.isArray(updateTracks)) {
        allTracks = updateTracks
        // renderListHTML(updateTracks)

        var audios = [];

        for (let index = 0; index < updateTracks.length; index++) {
            const track = updateTracks[index];
            if (track) {
                audios.push({
                    id: track.id,
                    name: track.fileName,
                    artist: '未定义',
                    url: track.path,
                    cover: '../images/nopic.jpg',
                    theme: '#ebd0c2'
                });
            }
        }
        console.log(audios);
        if (!aplayer) {
            aplayer = new APlayer({
                container: $('aplayer'),
                theme: '#FADFA3',
                fixed: true,
                mini: true,
                loop: 'all',
                order: 'list',
                preload: 'auto',
                listFolded: true,
                audio: audios
            });
            // aplayer.on('listshow', function () {
            //     ipcRenderer.send('toggle-mainWindow') //显示/隐藏主窗口
            // });
            // aplayer.on('listhide', function () {
            //     ipcRenderer.send('toggle-mainWindow') //显示/隐藏主窗口
            // });
            // aplayer.on('listswitch', function () {
            //     ipcRenderer.send('aplayer-listswitch',aplayer.) //显示/隐藏主窗口
            // });


            $Selector('.aplayer-button').click();
            $Selector('.aplayer-button').click();
        }
    }
})


// function crateAPlayer() {
//     if (!aplayer) {
//         aplayer = new APlayer({
//             container: $('aplayer'),
//             theme: '#FADFA3',
//             fixed: true,
//             mini: true,
//             loop: 'all',
//             order: 'list',
//             preload: 'auto',
//             listFolded: true,
//             audio: []
//         });
//         aplayer.on('listshow', function () {
//             ipcRenderer.send('toggle-mainWindow') //显示/隐藏主窗口
//         });
//         aplayer.on('listhide', function () {
//             ipcRenderer.send('toggle-mainWindow') //显示/隐藏主窗口
//         });
//         // aplayer.on('listswitch', function () {
//         //     ipcRenderer.send('aplayer-listswitch',aplayer.) //显示/隐藏主窗口
//         // });


//         $Selector('.aplayer-button').click();
//         $Selector('.aplayer-button').click();
//     }
// }

// crateAPlayer();