const {
    ipcRenderer
} = require('electron')
const {
    $
} = require('./helper')

// const jsmediatags = require('jsmediatags');

const {
    remote
} = require('electron');
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

var allTracks = [] //所有音乐
var currentTrack = {} //当前音乐


const ap = new APlayer({
    container: $('aplayer'),
    theme: '#FADFA3',
    fixed: true,
    mini: true,
    loop: 'all',
    order: 'list',
    preload: 'auto',
    listFolded: true,
    audio: [{
        name: 'Victory',
        artist: 'Two Steps From Hell',
        url: '../musics/Victory.mp3',
        cover: '../musics/Victory.jpg'
    }, {
        name: '38.6（Cover：黑龙）',
        artist: '黑龙',
        url: '../musics/38.6（Cover：黑龙）.mp3',
        cover: '../musics/nopic.jpg'
    }, {
        name: 'Victory',
        artist: 'Two Steps From Hell',
        url: '../musics/Victory.mp3',
        cover: '../musics/Victory.jpg'
    }, {
        name: '38.6（Cover：黑龙）',
        artist: '黑龙',
        url: '../musics/38.6（Cover：黑龙）.mp3',
        cover: '../musics/nopic.jpg'
    }, {
        name: 'Victory',
        artist: 'Two Steps From Hell',
        url: '../musics/Victory.mp3',
        cover: '../musics/Victory.jpg'
    }, {
        name: '38.6（Cover：黑龙）',
        artist: '黑龙',
        url: '../musics/38.6（Cover：黑龙）.mp3',
        cover: '../musics/nopic.jpg'
    }, {
        name: 'Victory',
        artist: 'Two Steps From Hell',
        url: '../musics/Victory.mp3',
        cover: '../musics/Victory.jpg'
    }, {
        name: '38.6（Cover：黑龙）',
        artist: '黑龙',
        url: '../musics/38.6（Cover：黑龙）.mp3',
        cover: '../musics/nopic.jpg'
    }, {
        name: 'Victory',
        artist: 'Two Steps From Hell',
        url: '../musics/Victory.mp3',
        cover: '../musics/Victory.jpg'
    }, {
        name: '38.6（Cover：黑龙）',
        artist: '黑龙',
        url: '../musics/38.6（Cover：黑龙）.mp3',
        cover: '../musics/nopic.jpg'
    }, {
        name: 'Victory',
        artist: 'Two Steps From Hell',
        url: '../musics/Victory.mp3',
        cover: '../musics/Victory.jpg'
    }, {
        name: '38.6（Cover：黑龙）',
        artist: '黑龙',
        url: '../musics/38.6（Cover：黑龙）.mp3',
        cover: '../musics/nopic.jpg'
    }]
});

ap.on('listshow', function () {
    ipcRenderer.send('toggle-mainWindow') //显示/隐藏主窗口
});
ap.on('listhide', function () {
    ipcRenderer.send('toggle-mainWindow') //显示/隐藏主窗口
});
ap.play();