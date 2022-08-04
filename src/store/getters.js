export const user = state => state.user;

export const singer = state => state.singer;

export const playing = state => state.playing;

export const fullScreen = state => state.fullScreen;

export const showUserCenter = state => state.showUserCenter;

export const showSidebar = state => state.showSidebar;

export const mode = state => state.mode;

export const playlist = state => state.playlist;

export const sequenceList = state => state.sequenceList;

export const topList = state => state.topList;

export const currentIndex = state => state.currentIndex;

export const favoriteList = state => state.favoriteList;

export const searchHistory = state => state.searchHistory;

export const currentSong = (state) => {
  return state.playlist[state.currentIndex] || {};
}