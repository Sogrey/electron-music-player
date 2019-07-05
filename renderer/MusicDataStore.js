//数据持久化
const Store = require('electron-store')
const uuidv4 = require('uuid/v4')
const path = require('path')

class DataStore extends Store {
    constructor(settings) {
        super(settings)
        this.tracks = this.get('tracks') || []
    }
    saveTracks() {
        this.set('tracks', this.tracks)
        return this
    }
    getTracks() {
        return this.get('tracks') || []
    }
    addTracks(tracks) {
        if (Array.isArray(tracks)) {
            const tracksWithProps = tracks.map(track => {
                return {
                    id: uuidv4(),
                    path: track,
                    fileName: path.basename(track)
                }
            }).filter(track => {//过滤去重
                const currentTracksPath = this.getTracks().map(track => track.path)
                return currentTracksPath.indexOf(track.path) < 0
            })
            this.tracks=[...this.tracks,...tracksWithProps]
            return this.saveTracks()
        }
    }
}
module.exports = DataStore