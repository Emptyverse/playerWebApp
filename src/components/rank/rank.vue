<template>
  <div class="rank">
    <Scroll :data="rankList" class="toplist" ref="toplist">
      <ul>
        <li v-for="(list, index) in rankList" :key="index" class="item">
          <div class="icon">
            <img v-lazy="list.image" width="100" height="100" />
          </div>
          <ul class="song-list" @click="selectList(list)">
            <li v-for="(item, index) in list.tracks" :key="index" class="song">
              <span>{{ index + 1 }}.</span>
              <span>{{ item.name }}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="!rankList.length">
        <loading></loading>
      </div>
    </Scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { getRankList, getPlayListDetail } from "api/rank";
import { ERR_OK } from "api/config";
import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";

export default {
  data() {
    return {
      rankList: [],
      track: []
    };
  },
  methods: {
    findIndex(list, id) {
      let index = list.findIndex(item => {
        return item.id === id;
      });
      return index;
    },
    _getTopList() {
      getRankList().then(res => {
        if (res.data.code === ERR_OK) {
          let list = [];
          res.data.list.forEach(item => {
            list.push({
              name: item.name,
              id: item.id,
              image: item.coverImgUrl,
              tracks: []
            });
          });
          list.forEach(item => {
            getPlayListDetail(item.id).then(res => {
              if (res.data.code === ERR_OK) {
                let index = this.findIndex(list, item.id);
                list[index].tracks = res.data.playlist.tracks.slice(0, 3);
                this.rankList = list;
              }
            });
          });
        }
      });
    },
    selectList(list) {
      this.$router.push({
        path: `/rank/${list.id}`
      });
      this.setTopList(list);
    },
    ...mapMutations({
      setTopList: "SET_TOP_LIST"
    })
  },
  computed: {
    ...mapGetters(["topList"])
  },
  components: {
    Scroll,
    Loading
  },
  created() {
    this._getTopList();
  }
};
</script>

<style lang="scss" scoped>
@import "common/style/variable.scss";
@import "common/style/mixins.scss";

.rank {
  position: fixed;
  top: 44px;
  left: 0;
  right: 0;
  bottom: 80px;
  width: 100%;
  z-index: 15;
  .toplist {
    height: 100%;
    overflow: hidden;
    background: $color-bg-2;

    .item {
      display: flex;
      margin: 0 10px;
      padding-top: 20px;
      height: 100px;
      box-sizing: content-box;
      &:last-child {
        padding-bottom: 20px;
      }
      .icon {
        flex: 0 0 100px;
        width: 100px;
        height: 100px;
        img {
          border-radius: 3px;
        }
      }
      .song-list {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 20px;
        height: 100px;
        overflow: hidden;
        color: $color-black;
        font-size: $font-size-small-s;
        // background-color: #dde4ef;
        background-color: #f1e5e3;
        // background-color: #fe9e6836;
        .song {
          @include no-wrap();
          line-height: 30px;
        }
      }
    }
  }
}
</style>