import { mapGetters, mapMutations, mapActions } from 'vuex'
import { playMode } from "common/js/player/config";
import { shuffle } from "common/js/util/shuffle";

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  mounted() {
    this.handlePlaylist(this.playlist)
  },
  activated() {
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist(newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    handlePlaylist() {
      throw new Error('component must implement handlePlaylist method')
    }
  }
}

export const playerMixin = {
  computed: {
    // 控制播放模式的class
    modeIcon() {
      return this.mode === playMode.sequence
        ? "icon-xunhuan1"
        : this.mode === playMode.loop
          ? "icon-hanhan-01-01"
          : "icon-suijibofang";
    },
    ...mapGetters([
      "playlist",
      "mode",
      "currentSong",
      "sequenceList",
      "favoriteList"
    ]),
    favoriteIcon() {
      return this.getFavoriteIcon(this.currentSong)
    }
  },
  methods: {
    changeMode() {
      let index = (this.mode + 1) % 3;
      this.setMode(index);
      let list = null;
      if (this.mode === playMode.random) {
        list = shuffle(this.sequenceList);
      } else {
        list = this.sequenceList;
      }
      this.resetCurrentIndex(list);
      this.setPlayList(list);
    },
    resetCurrentIndex(list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    toggleFavorite(song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song);
      } else {
        this.saveFavoriteList(song);
      }
    },
    getFavoriteIcon(song) {
      if (Object.keys(song).length === 0) {
        return
      }
      if (this.isFavorite(song)) {
        return 'icon-aixin1'
      }
      return 'icon-aixin'
    },
    isFavorite(song) {
      const index = this.favoriteList.findIndex((item) => {
        return item.id === song.id
      })
      return index > -1
    },
    ...mapMutations({
      setPlayingState: "SET_PLAYING_STATE",
      setCurrentIndex: "SET_CURRENT_INDEX",
      setMode: "SET_MODE",
      setPlayList: "SET_PLAYLIST"
    }),
    ...mapActions([
      'saveFavoriteList',
      'deleteFavoriteList'
    ])
  }
}

export const searchMixin = {
  data() {
    return {
      query: '',
      refreshDelay: 120
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    onQueryChange(query) {
      // 处理带空格的情况
      this.query = query.trim();
    },
    blurInput() {
      this.$refs.searchBox.blur();
    },
    addQuery(query) {
      this.$refs.searchBox.setQuery(query);
    },
    saveSearch() {
      this.saveSearchHistory(this.query);
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ])
  }
}