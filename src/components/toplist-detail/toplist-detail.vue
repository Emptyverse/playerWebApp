<template>
  <transition name="fade" appear>
    <music-list :title="title" :bgImage="bgStyle" :songs="songs"></music-list>
  </transition>
</template>

<script>
import { mapGetters } from "vuex";
import MusicList from "@/music-list/music-list";
import { getPlayListDetail } from "api/rank";
import { ERR_OK } from "api/config";
import { createSong, processSongsUrl } from "common/js/format/song";
export default {
  name: "topListDeatil",
  data() {
    return {
      songs: []
    };
  },
  methods: {
    _getListDetail() {
      if (!this.topList.id) {
        if (this.$route.path.indexOf('disc') !== -1) {
          this.$router.push("/home");
        } else if (this.$route.path.indexOf('rank') !== -1) {
          this.$router.push("/rank");
        } else {
          this.$router.push("/home");
        }
      }
      getPlayListDetail(this.topList.id).then(res => {
        if (res.data.code === ERR_OK) {
          processSongsUrl(
            this._normalizeSong(res.data.playlist.tracks)
          ).then(songs => {
            this.songs = songs;
          });
        }
      });
    },
    _normalizeSong(list) {
      let ret = [];
      list.map(item => {
        ret.push(createSong(item));
      });
      return ret;
    }
  },
  computed: {
    title() {
      return this.topList.name;
    },
    bgStyle() {
      return `background-image: url(${this.topList.image})`;
    },
    ...mapGetters(["topList"])
  },
  watch: {
    topList(newList) {
      this._getListDetail();
    }
  },
  components: {
    MusicList
  },
  created() {
    this._getListDetail();
  }
};
</script>

<style lang="scss" scoped>
</style>