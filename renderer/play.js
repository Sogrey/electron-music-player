const {
    ipcRenderer,remote
} = require('electron')
const {
    $,$Selector
} = require('./helper')

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

//播放音乐
ipcRenderer.on('play-music-window', (event, musicList, music) => {
    console.log('play-music-window')
    if (aplayer) {
        console.log(musicList,music);
        if (musicList instanceof Array && musicList.length > 0) {
            var musics = [];
            var currentMusicIndex = 0;
            for (let index = 0; index < musicList.length; index++) {
                const musicItem = musicList[index];
                if (musicItem.id === music.id)
                    currentMusicIndex = index;
                musics.push({
                    id: musicItem.id,
                    name: musicItem.fileName,
                    artist: '未定义',
                    url: musicItem.path,
                    cover: '../musics/nopic.jpg',
                    theme: '#ebd0c2'
                });
            }
            aplayer.list.add(musics);

            aplayer.list.switch(currentMusicIndex);
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

function crateAPlayer() {
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
            audio: []
        });
        aplayer.on('listshow', function () {
            ipcRenderer.send('toggle-mainWindow') //显示/隐藏主窗口
        });
        aplayer.on('listhide', function () {
            ipcRenderer.send('toggle-mainWindow') //显示/隐藏主窗口
        });
        // aplayer.on('listswitch', function () {
        //     ipcRenderer.send('aplayer-listswitch',aplayer.) //显示/隐藏主窗口
        // });


        $Selector('.aplayer-button').click();
        $Selector('.aplayer-button').click();
    }
}

crateAPlayer();