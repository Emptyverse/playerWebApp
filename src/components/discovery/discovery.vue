<template>
  <div class="discovery">
    <Scroll class="discovery-content" :data="discoveryList" ref="scroll">
      <div>
        <div class="slider-wrapper">
          <div v-if="bannerList.length" class="slider-content">
            <Slider>
              <div class="slider-item" v-for="(item, index) in bannerList" :key="index">
                <a :href="item.url">
                  <img @load="loadImage" :src="item.imageUrl" />
                </a>
              </div>
            </Slider>
          </div>
        </div>
        <Scroll :scrollX="true" :data="iconList" :click="false">
          <div class="tab">
            <div class="tab-item" v-for="icon in iconList" :key="icon.id">
              <div class="icon-image" @click="navigate(navIconUrl[icon.name])">
                <img :src="icon.iconUrl" width="40" height="40" />
              </div>
              <router-link tag="div" class="nav-icon" :to="navIconUrl[icon.name]">{{ icon.name }}</router-link>
            </div>
          </div>
        </Scroll>
        <div class="personalized-list">
          <h1>推荐歌单</h1>
          <ul>
            <li v-for="item in personalizedList" :key="item.id" class="list-item" @click="selectList(item)">
              <div class="image">
                <div class="gradients"></div>
                <img v-lazy="item.picUrl" />
              </div>
              <div class="play-count">
                <span class="iconfont icon-shiting"></span>
                <span>{{ Math.floor(item.playCount / 10000) }}万</span>
              </div>
              <div class="text">
                <p class="name">{{ item.name }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!personalizedList.length">
        <loading></loading>
      </div>
    </Scroll>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import Scroll from "base/scroll/scroll";
import Slider from "base/slider/slider";
import loading from "base/loading/loading";
import { getBanner, getDragonBall, getPersonalized } from "api/discovery";
import { ERR_OK } from "api/config";
import { navIconUrl } from "common/js/url/nav-icon";
export default {
  data() {
    return {
      a: "a",
      bannerList: [],
      iconList: [],
      personalizedList: [],
      navIconUrl: ""
    };
  },
  created() {
    this.navIconUrl = navIconUrl;
    setTimeout(() => {
      this._getBanner();
      this._getDragonBall();
      this._getPersonalized();
    }, 20);
  },
  methods: {
    _getBanner() {
      getBanner().then(res => {
        if (res.data.code === ERR_OK) {
          this.bannerList = res.data.banners.slice(0, 5);
        }
      });
    },
    _getDragonBall() {
      getDragonBall().then(res => {
        if (res.data.code === ERR_OK) {
          // console.log(res.data);
          this.iconList = res.data.data;
        }
      });
    },
    _getPersonalized() {
      getPersonalized().then(res => {
        if (res.data.code === ERR_OK) {
          // console.log(res.data);
          this.personalizedList = res.data.result;
        }
      });
    },
    loadImage() {
      if (!this.checkLoaded) {
        this.checkloaded = true;
        setTimeout(() => {
          this.$refs.scroll.refresh();
        }, 20);
      }
    },
    navigate(path) {
      this.$router.push(path);
    },
    selectList(list) {
      list.image = list.picUrl;
      this.setTopList(list);
      this.$router.push({
        path: `/disc/${list.id}`
      });
    },
    ...mapMutations({
      setTopList: "SET_TOP_LIST"
    })
  },
  computed: {
    discoveryList() {
      return this.personalizedList.concat(this.iconList);
    },
    ...mapGetters(["topList"])
  },
  components: {
    Scroll,
    Slider,
    loading
  }
};
</script>

<style lang="scss" scoped>
@import "common/style/variable.scss";
.discovery {
  position: fixed;
  top: 44px;
  left: 0;
  right: 0;
  bottom: 80px;
  z-index: 1;
  .discovery-content {
    height: 100%;
    overflow: hidden;
    .slider-wrapper {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 37%;
      overflow: hidden;
      .slider-content {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    }
    .tab {
      display: inline-block;
      white-space: nowrap;
      border-bottom: 1px solid $color-bg-3;
      .tab-item {
        display: inline-block;
        padding: 10px;
        width: 70px;
        text-align: center;
        border: 1px solid #DCDCDC;
        img {
          background-color: $color-orange;
          border-radius: 20%;
        }
        .nav-icon {
          margin-top: 5px;
          font-size: 12px;
          color: $color-light-black;
        }
      }
    }
    .personalized-list {
      h1 {
        height: 50px;
        line-height: 50px;
        text-align: center;
        font-size: $font-size-large;
        color: $color-orange;
      }
      .list-item {
        position: relative;
        display: inline-block;
        box-sizing: border-box;
        width: 33%;
        padding: 0 1%;
        .image {
          position: relative;
          display: inline-block;
          width: 100%;
          margin-bottom: 5px;
          .gradients {
            position: absolute;
            top: 0;
            width: 100%;
            height: 35px;
            border-radius: 3px;
            background: linear-gradient(
              rgba(109, 109, 109, 0.4),
              rgba(255, 255, 255, 0)
            );
          }
          img {
            width: 100%;
            height: 100%;
            border-radius: 3px;
          }
        }
        .play-count {
          position: absolute;
          top: 5px;
          right: 8px;
          font-size: 10px;
          color: #f1f1f1;
          .icon-shiting {
            margin-right: 5px;
            font-size: 12px;
          }
        }
        .text {
          float: left;
          margin-bottom: 10px;
          text-align: left;
          height: 40px;
          line-height: 16px;
          overflow: hidden;
          font-size: 12px;
        }
      }
    }
  }
}
</style>