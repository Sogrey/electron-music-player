// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  ipcMain,dialog
} = require('electron');
const path = require('path');
const Store = require('electron-store')
const store = new Store();
console.log(app.getPath('userData'));
 
// store.set('unicorn', '🦄');
// console.log(store.get('unicorn'));
// //=> '🦄'
 
// // Use dot-notation to access nested properties
// store.set('foo.bar', true);
// console.log(store.get('foo'));
// //=> {bar: true}
 
// store.delete('unicorn');
// console.log(store.get('unicorn'));
// //=> undefined

class AppWindow extends BrowserWindow {
  constructor(config, fileLocation) {
    const basicConfig = {
      width: 800,
      height: 600,
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
      this.show();
    })
  }
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new AppWindow({}, './renderer/index.html');
  //窗口加载完成-显示
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  })

  ipcMain.on('add-music-window', () => { //收到添加音乐的请求
    const addWindow = new AppWindow({
      width: 500,
      height: 400,
      parent: mainWindow
    }, "./renderer/add.html")
  })

  ipcMain.on('select-music-dialog', (evnet) => { //收到选择音乐的请求
    dialog.showOpenDialog({
      properties :['openFile','multiSelections'],
      filters: [
        { name: 'Music', extensions: ['mp3'] }
      ]
    },(files)=>{
      if(files){
        evnet.sender.send('select-files',files)
      }
    })
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