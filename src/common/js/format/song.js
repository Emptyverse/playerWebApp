import { getSongUrl, getSongDetail, getLyric } from 'api/song';
import { ERR_OK } from "api/config";

export class Song {
  constructor({ id, singer, name, album, duration, image, url, aliaName }) {
    this.id = id;
    this.singer = singer;
    this.name = name;
    this.album = album;
    this.duration = duration;
    this.image = image;
    this.url = url;
    this.aliaName = aliaName;
  }

  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric);
    }

    return new Promise((resolve, reject) => {
      getLyric(this.id).then(res => {
        if (res.data.code === ERR_OK) {
          if (res.data.lrc) {
            this.lyric = res.data.lrc.lyric;
          } else {
            this.lyric = '此歌曲为没有填词的纯音乐，请您欣赏';
          }
          resolve(this.lyric);
        } else {
          reject(new Error('no lyric'))
        }
      })
    })
  }
}

function singerName(arr) {
  let name = [];
  name = arr.map((item) => {
    return item.name
  })

  return name.join('/')
}

export function createSong(music) {
  return new Song({
    id: music.id,
    singer: singerName(music.ar),
    aliaName: music.alia.join('-'),
    name: music.name,
    album: music.al.name,
    image: music.al.picUrl
  })
}

export function createSearchSong (music) {
  return new Song({
    id: music.id,
    singer: singerName(music.artists),
    name: music.name,
    album: music.album.name
  })
}

export function processSongsUrl(songs) {
  if (!songs.length) {
    return Promise.resolve(songs);
  }
  // 获取歌曲id数组
  let ids = [];
  songs.map(song => {
    ids.push(song.id);
  })

  return new Promise((resolve, reject) => {
    addSongUrl(ids, songs).then(songs => {
      resolve(addSongDuration(ids, songs))
    });
  })
}

function addSongUrl(ids, songs) {
  return getSongUrl(ids.join(',')).then((res) => {
    const purlMap = {};

    if (res.data.code === ERR_OK) {
      let response = res.data.data;
      if (response) {
        response.forEach(item => {
          if (item.url) {
            purlMap[item.id] = item.url;
          }
        });
      }
    }
    songs = songs.filter((song) => {
      const purl = purlMap[song.id];
      if (purl) {
        song.url = purl;
        return true
      }
      return false
    })
    return songs
  })
}

function addSongDuration(ids, songs) {
  return getSongDetail(ids.join(',')).then((res) => {
    const durationMap = {};

    if (res.data.code === ERR_OK) {
      let response = res.data.songs;
      if (response) {
        response.forEach(item => {
          if (item.dt) {
            durationMap[item.id] = Math.round(item.dt / 1000);
          }
        });
      }
    }
    songs = songs.filter((song) => {
      const duration = durationMap[song.id];
      if (duration) {
        song.duration = duration;
        return true
      }
      return false
    })
    return songs
  })
}