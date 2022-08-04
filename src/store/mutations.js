import * as type from './mutations-type';

const mutations = {
  [type.SET_USER](state, user) {
    state.user = user;
  },

  [type.SET_SINGER](state, singer) {
    state.singer = singer;
  },

  [type.SET_PLAYING_STATE](state, playing) {
    state.playing = playing;
  },

  [type.SET_SHOW_USER_CENTER](state, showUserCenter) {
    state.showUserCenter = showUserCenter;
  },

  [type.SET_FULL_SCREEN](state, fullScreen) {
    state.fullScreen = fullScreen;
  },

  [type.SET_SHOW_SIDEBAR](state, showSidebar) {
    state.showSidebar = showSidebar;
  },

  [type.SET_MODE](state, mode) {
    state.mode = mode;
  },

  [type.SET_PLAYLIST](state, list) {
    state.playlist = list;
  },

  [type.SET_SEQUENCE_LIST](state, list) {
    state.sequenceList = list;
  },

  [type.SET_TOP_LIST](state, list) {
    state.topList = list;
  },

  [type.SET_CURRENT_INDEX](state, index) {
    state.currentIndex = index;
  },

  [type.SET_FAVORITE_LIST](state, list) {
    state.favoriteList = list;
  },

  [type.SET_SEARCH_HISTORY](state, history) {
    state.searchHistory = history;
  }
}

export default mutations