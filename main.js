// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  ipcMain,
  dialog
} = require('electron');
// const sqlite3 = require('sqlite3').verbose()
const path = require('path');
const DataStore = require('./renderer/MusicDataStore')

const musicStore = new DataStore({
  'name': 'musicData'
})

// musicStore.clearTrack()

// const db = new sqlite3.Database(path.join(__dirname, '../data/info.db'))
// db.run('create table test(name varchar(15))', function () {
//   db.run('insert into test values("hello,world")', function () {
//     db.all('select * from test', function (err, res) {
//       if (!err) {
//         console.log(JSON.stringify(res))
//       } else {
//         console.log(err)
//       }
//     })
//   })
// })


class AppWindow extends BrowserWindow {
  constructor(config, fileLocation) {
    const basicConfig = {
      width: 800,
      height: 600,
      icon: "./icon.ico",
      show: false, //暂不显示，等窗口加载完成再显示      
      webPreferences: {
        nodeIntegration: true
      }
    }
    // const finalConfig = Object.assign(basicConfig,config)
    const finalConfig = {
      ...basicConfig,
      ...config
    }
    super(finalConfig)
    this.loadFile(fileLocation)
    //窗口加载完成-显示
    this.once('ready-to-show', () => {
      if (!finalConfig.notAutoShow)
        this.show();
    })
  }
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, addWindow, playWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new AppWindow({}, './renderer/index.html');
  playWindow = new AppWindow({
    x: 0,
    y: 600,
    width: 500,
    height: 60,
    notAutoShow: true,//自定义，不主动显示窗口，需要时 .show() 再显示
    resizable: false,
    useContentSize: true,
    transparent: true,
    backgroundColor: "#00000000",
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true
    }
  }, './renderer/play.html');

  // mainWindow.webContents.openDevTools()
  // playWindow.webContents.openDevTools()

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.send('update-musics', musicStore.getTracks())
  })

  ipcMain.on('add-music-window', () => { //收到添加音乐的请求
    addWindow = new AppWindow({
      width: 500,
      height: 400,
      parent: mainWindow,
      modal: true
    }, "./renderer/add.html")
  })

  ipcMain.on('select-music-dialog', (evnet) => { //收到选择音乐的请求
    dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [{
        name: 'Music',
        extensions: ['mp3']
      }]
    }, (files) => {
      if (files) {
        evnet.sender.send('select-files', files)
      }
    })
  })
  ipcMain.on('import-music', (evnet, musicFileList) => { //收到导入音乐的请求
    const updateTracks = musicStore.addTracks(musicFileList).getTracks()
    addWindow.close()
    mainWindow.send('update-musics', updateTracks)
  })

  ipcMain.on('delete-track', (evnet, musicId) => { //删除音乐的请求
    musicStore.deleteTrack(musicId)
    mainWindow.send('update-musics', musicStore.getTracks())
  })

  ipcMain.on('toggle-mainWindow', () => { //显示/隐藏主窗口
    if (!mainWindow || mainWindow.isDestroyed()) {
      console.log(1)
      mainWindow = new AppWindow({}, './renderer/index.html');

      mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.send('update-musics', musicStore.getTracks())
      })
    } else if (mainWindow && !mainWindow.isVisible()) {
      console.log(2)
      mainWindow.show();
    } else if (mainWindow && mainWindow.isVisible()) {
      console.log(3)
      mainWindow.close();
    }
  })

  ipcMain.on('exit', () => { //退出程序
    app.quit();
  })


  ipcMain.on('play-music', (event, arg) => { //播放音乐
    if (playWindow) {
      playWindow.show();
      playWindow.send('play-music-window', musicStore.getTracks(), arg)
    }
  })
  ipcMain.on('pause-music', (event, arg) => { //暂停播放音乐
    if (playWindow) {
      playWindow.show();
      playWindow.send('pause-music-window', arg)
    }
  })
  ipcMain.on('continue-music', (event, arg) => { //继续播放音乐
    if (playWindow) {
      playWindow.show();
      playWindow.send('continue-music-window', arg)
    }
  })


  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  });
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.