//数据持久化
const Store = require('electron-store')
const uuidv4 = require('uuid/v4')
const path = require('path')

class DataStore extends Store {
    constructor(settings) {
        super(settings)
        this.tracks = this.get('tracks') || []
    }
    
    /**
     *保存数据
     * @returns
     * @memberof DataStore
     */
    saveTracks() {
        this.set('tracks', this.tracks)
        return this
    }

    /**
     *查询数据
     * @returns
     * @memberof DataStore
     */
    getTracks() {
        return this.get('tracks') || []
    }

    /**
     *添加数据
     * @param {*} tracks
     * @returns
     * @memberof DataStore
     */
    addTracks(tracks) {
        if (Array.isArray(tracks)) {
            const tracksWithProps = tracks.map(track => {
                return {
                    id: uuidv4(),//唯一ID
                    path: track,//文件路径
                    fileName: path.basename(track)//文件名
                }
            }).filter(track => { //过滤去重
                const currentTracksPath = this.getTracks().map(track => track.path)
                return currentTracksPath.indexOf(track.path) < 0
            })
            this.tracks = [...this.tracks, ...tracksWithProps]
            return this.saveTracks()
        }
    }

    /**
     *删除数据
     * @param {*} deletedId
     * @returns
     * @memberof DataStore
     */
    deleteTrack(deletedId) {
        this.tracks = this.tracks.filter(item => item.id !== deletedId)//过滤掉指定的条目，其他的存储
        return this.saveTracks()
    }

    /**
     * 清空
     *
     * @returns
     * @memberof DataStore
     */
    clearTrack() {
        this.tracks = []
        return this.saveTracks()
    }
}
module.exports = DataStore