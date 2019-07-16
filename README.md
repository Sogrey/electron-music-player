# electron-music-player

![](https://raw.githubusercontent.com/Sogrey/electron-music-player/master/screenshots/TIM%E6%88%AA%E5%9B%BE20190716013030.png)

Usage:

安装依赖：

``` bash
npm install
```



执行命令：

- `npm run dev` 监控运行
- `npm run start` 启动运行
- `npm run packager` 打包
- `npm run setup` 打包windows平台安装包
- `npm run pack`  ： `npm run packager`  & `npm run setup` 组合命令



依赖：

- `electron`
- `electron-packager` : electron 打包
- `electron-installer-windows` ：打包windows平台安装包
- `nodemon`: 监控调试
- `rimraf` : 操作本地文件
- `@fortawesome/fontawesome-free` : 字体图标
- `aplayer` :aplayer 音乐播放控件
- `bootstrap` 
- `electron-store` : electron 数据存储，保存在 json文件中
- `uuid` : 用于生成唯一id