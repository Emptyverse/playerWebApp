import { playMode } from 'common/js/player/config';
import { loadFavorite, loadSearch } from 'common/js/util/cache'
const state = {
  // 用户信息
  user: {},
  // 歌手信息
  singer: {},
  // 播放
  playing: false,
  // 全屏
  fullScreen: false,
  // 个人中心
  showUserCenter: false,
  // sidebar模式
  showSidebar: false,
  // 播放模式
  mode: playMode.sequence,
  // 顺序播放列表
  playlist: [],
  // 其他排序列表
  sequenceList: [],
  // 榜单或歌单信息
  topList: {},
  // 当前播放索引
  currentIndex: -1,
  // 我喜爱的歌曲
  favoriteList: loadFavorite(),
  // 搜索历史
  searchHistory: loadSearch()
}

export default state