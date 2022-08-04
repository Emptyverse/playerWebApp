import storage from 'good-storage';

const SEARCH_KEY = '__search__';
const SEARCH_MAX_LEN = 15;

const FAVORITE_KEY = '__favorite__';
const FAVORITE_MAX_LEN = 200;

function insertArray(arr, val, compare, maxLen) {
  // 查找数组里是否已经存在搜索结果
  const index = arr.findIndex(compare)
  // 如果只有一个结果 则不处理
  if (index === 0) {
    return
  }
  // 如果不止一个搜索结果 则删除原先的搜索结果 并在数组的头部插入
  if (index > 0) {
    arr.splice(index, 1);
  }
  arr.unshift(val);
  // 如果数组达到最大值限制，删除一个最早的搜索结果
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare);
  if (index > -1) {
    arr.splice(index, 1);
  }
}

export function saveSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LEN)
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function deleteSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return []
}

export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}

// 添加歌曲到我最喜欢列表
export function saveFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, []);
  insertArray(songs, song, (item) => {
    return item.id === song.id
  }, FAVORITE_MAX_LEN)
  storage.set(FAVORITE_KEY, songs);
  return songs
}

// 从我最喜欢列表删除歌曲
export function deleteFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, []);

  deleteFromArray(songs, (item) => {
    return item.id === song.id
  })
  storage.set(FAVORITE_KEY, songs);
  return songs
}

// 加载我最喜欢歌曲列表
export function loadFavorite() {
  return storage.get(FAVORITE_KEY, [])
}