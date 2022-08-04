<template>
  <transition name="fade" appear>
    <div class="recommend">
      <Scroll class="recommend-content" :data="refrenshData">
        <div>
          <div class="recommend-item recommend-header">
            <div class="back-btn">
              <i class="iconfont icon-back" @click="goback"></i>
            </div>
            <Search></Search>
          </div>
          <div class="recommend-item recommend-newest-album">
            <h2>Album</h2>
            <Scroll :scrollX="true" class="album-wrapper" :data="newestAlbum">
              <div class="newest-album" ref="newestAlbum">
                <div class="album-item" v-for="item in newestAlbum" :key="item.albumId">
                  <img v-lazy="item.coverUrl" width="120" height="120" />
                  <p class="album-name">{{ item.albumName }}</p>
                  <p class="album-artist">{{ item.artistName}}</p>
                </div>
              </div>
            </Scroll>
          </div>
          <div class="recommend-item recommend-songs">
            <h2>For you</h2>
            <ul>
              <li v-for="song in recommendSongs" :key="song.id" class="song">
                <div class="image">
                  <img v-lazy="song.al.picUrl" width="60" height="60" />
                </div>
                <div class="text">
                  <p class="song-name">{{ song.name }}</p>
                  <p class="singer">{{ _getSongSinger(song.ar)}}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="loading-container" v-show="!newestAlbum.length || !recommendSongs.length">
          <loading></loading>
        </div>
      </Scroll>
    </div>
  </transition>
</template>

<script>
import Scroll from "base/scroll/scroll";
import Search from "@/search-input/search-input";
import loading from "base/loading/loading";
import { getAlbum, getRecommendSongs } from "api/discovery";
import { ERR_OK } from "api/config";
export default {
  data() {
    return {
      newestAlbum: [],
      recommendSongs: []
    };
  },
  created() {
    this._getAlbum();
    this._getRecommendSongs();
  },
  methods: {
    _getAlbum() {
      getAlbum().then(res => {
        if (res.data.code === ERR_OK) {
          // console.log(res.data);
          this.newestAlbum = res.data.products.slice(0, 10);
        }
      });
    },
    _getRecommendSongs() {
      getRecommendSongs().then(res => {
        if (res.data.code === ERR_OK) {
          // console.log(res.data);
          this.recommendSongs = res.data.data.dailySongs;
        }
      });
    },
    _getSongSinger(ar) {
      let singer = "";
      ar.forEach(item => {
        singer = singer + item.name + "/";
      });
      return singer.substr(0, singer.length - 1);
    },
    goback() {
      this.$router.go(-1);
    }
  },
  computed: {
    refrenshData() {
      return this.newestAlbum.concat(this.recommendSongs);
    }
  },
  watch: {
    newestAlbum() {
      let length = this.newestAlbum.length;
      let width = 140 * length;
      this.$refs.newestAlbum.style.width = width + "px";
    }
  },
  components: {
    Scroll,
    Search,
    loading
  }
};
</script>

<style lang="scss" scoped>
@import "common/style/variable.scss";
.recommend {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 80px;
  z-index: 2;
  background-color: $color-bg-7;
  .recommend-content {
    height: 100%;
    overflow: hidden;
    h2 {
      margin: 20px auto;
      width: 90%;
      color: $color-black;
    }
    .recommend-header {
      .icon-back {
        display: inline-block;
        padding: 10px;
        font-size: 22px;
        color: $color-orange;
      }
    }
    .recommend-newest-album {
      .album-wrapper {
        width: 90%;
        margin: 0 auto;
        // white-space: nowrap;
      }
      .newest-album {
        display: flex;
      }
      .album-item {
        display: inline-block;
        padding-right: 20px;
        width: 140px;
        height: 210px;
        img {
          border-radius: 10%;
        }
        .album-name {
          width: 90%;
          margin-top: 10px;
          font-size: 15px;
          line-height: 1.5;
        }
        .album-artist {
          width: 90%;
          margin-top: 10px;
          font-size: $font-size-medium;
          color: $color-gray;
        }
      }
    }
    .recommend-songs {
      .song {
        display: flex;
        padding: 0 20px 20px 20px;
        .image {
          width: 60px;
          height: 60px;
          flex: 0 0 60px;
          margin-right: 20px;
          img {
            border-radius: 10px;
          }
        }
        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          .song-name {
            margin-bottom: 10px;
            font-size: 16px;
            line-height: 20px;
          }
          .singer {
            font-size: 14px;
            color: $color-gray;
          }
        }
      }
    }
  }
}
</style>