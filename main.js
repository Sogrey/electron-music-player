// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  ipcMain
} = require('electron');
const path = require('path');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false, //暂不显示，等窗口加载完成再显示
    backgroundColor: '#2e2c29', //窗口背景色
    webPreferences: {
      //预加载。
      //界面的其它脚本运行之前预先加载一个指定脚本. 
      //这个脚本将一直可以使用 node APIs 无论 node integration 是否开启. 
      //脚本路径为绝对路径. 当 node integration 关闭, 预加载的脚本将从全局范围重新引入node的全局引用标志.
      //__dirname : 当前目录
      // preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  });
  //窗口加载完成-显示
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  })

  // and load the index.html of the app.
  mainWindow.loadFile('./renderer/index.html');

  ipcMain.on('add-music-window', () => { //收到添加音乐的请求
    const addWindow = new BrowserWindow({
      width: 500,
      height: 400,
      webPreferences: {
        nodeIntegration: true
      },
      parent: mainWindow
    });
    addWindow.loadFile("./renderer/add.html")
  })

  ipcMain.on('select-music-dialog', () => { //收到选择音乐的请求
    console.log('select-music-dialog');
  })
  ipcMain.on('import-music', () => { //收到导入音乐的请求
    console.log('import-music');
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