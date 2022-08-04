<template>
  <div class="singer">
    <ListView :data="singerList" @select="selectSinger"></ListView>
    <router-view></router-view>
  </div>
</template>

<script>
import ListView from "base/list-view/list-view";
import { getTopArtists } from "api/singer";
import { ERR_OK } from "api/config";
import Singer from "common/js/format/singer";
import { mapMutations } from "vuex";
const pinyin = require("pinyin");
const HOT_NAME = "热门";
const HOT_SINGERS = 10;

export default {
  data() {
    return {
      singerList: []
    };
  },
  created() {
    this._getTopArtists();
  },
  methods: {
    _getTopArtists() {
      getTopArtists(100)
        .then(res => {
          if (res.data.code === ERR_OK) {
            let artists = res.data.artists;
            artists.map(item => {
              let py = pinyin(item.name[0], {
                style: pinyin.STYLE_FIRST_LETTER
              });
              item.initial = py[0][0].toUpperCase();
            });
            this.singerList = this._normalizeSinger(artists);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    _normalizeSinger(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      };
      list.forEach((item, index) => {
        if (index < HOT_SINGERS) {
          map.hot.items.push(
            new Singer({
              id: item.id,
              name: item.name,
              avatar: item.img1v1Url,
              aliasName: item.alias.join(" / ")
            })
          );
        }
        const key = item.initial;
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          };
        }

        map[key].items.push(
          new Singer({
            id: item.id,
            name: item.name,
            avatar: item.img1v1Url,
            aliasName: item.alias[0]
          })
        );
      });
      let hot = [];
      let ret = [];

      for (const key in map) {
        let val = map[key];
        if (val.title === HOT_NAME) {
          hot.push(val);
        } else if (val.title.match(/[A-Z]/)) {
          ret.push(val);
        }
      }

      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });
      return hot.concat(ret);
    },
    selectSinger(singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      });
      this.setSinger(singer);
    },
    ...mapMutations({
      setSinger: "SET_SINGER"
    })
  },
  components: {
    ListView
  }
};
</script>

<style lang="scss" scoped>
.singer {
  position: fixed;
  top: 44px;
  left: 0;
  right: 0;
  bottom: 80px;
  z-index: 15;
}
</style>