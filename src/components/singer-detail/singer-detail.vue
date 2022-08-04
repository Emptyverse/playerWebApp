<template>
  <transition appear name="fade">
    <music-list :title="title" :bgImage="bgStyle" :songs="songList" :show-type="showType"></music-list>
  </transition>
</template>

<script>
import MusicList from "@/music-list/music-list";
import { getSingerDetail } from "api/singer";
import { ERR_OK } from "api/config";
import { createSong, processSongsUrl } from "common/js/format/song";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      songList: []
    };
  },
  created() {
    this._getDetail();
    this.showType = 1;
  },
  methods: {
    _getDetail() {
      if (!this.singer.id) {
        this.$router.push("/singer");
      }
      getSingerDetail(this.singer.id)
        .then(res => {
          if (res.data.code === ERR_OK) {
             processSongsUrl(this._normalizeSong(res.data.hotSongs)).then(songs => {
               this.songList = songs;
             })
          }
        })
        .catch(error => {
          console.log(error);
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
      return this.singer.name;
    },
    bgStyle() {
      return `background-image: url(${this.singer.avatar})`;
    },
    ...mapGetters(["singer"])
  },
  components: {
    MusicList
  }
};
</script>
<style lang="scss" scoped>
</style>
