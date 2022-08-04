<template>
  <div class="music-list">
    <div class="header">
      <div class="header-bg" ref="headerBg">
        <div class="back">
          <i class="iconfont icon-back" @click="back" ref="backBtn"></i>
        </div>
        <h1 class="title">{{ title }}</h1>
      </div>
      <div class="bg-image" :style="bgImage" ref="bgImage">
        <div class="filter" ref="filter"></div>
      </div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <div class="list" ref="list">
      <Scroll
        :data="songs"
        :probe-type="probeType"
        :listen-scroll="listenScroll"
        @scroll="scroll"
        class="sub-list"
      >
        <div class="song-list-wrapper">
          <song-list :songs="songs" @select="selectItem" :list-type="showType"></song-list>
        </div>
        <div v-show="!songs.length" class="loading-container">
          <loading></loading>
        </div>
      </Scroll>
    </div>
  </div>
</template>

<script>
import Scroll from "base/scroll/scroll";
import SongList from "base/song-list/song-list";
import Loading from "base/loading/loading";
import { prefixStyle } from "common/js/util/dom";
import { mapActions } from "vuex";
const RESERVED_HEIGHT = 42;
const transform = prefixStyle("transform");
const backdrop = prefixStyle("backdrop-filter");
export default {
  props: {
    title: {
      type: String,
      default: ""
    },
    bgImage: {
      type: String,
      default: ""
    },
    showType: {
      type: Number,
      default: 0
    },
    songs: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      scrollY: -1
    };
  },
  created() {
    this.probeType = 3;
    this.listenScroll = true;
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight;
    this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT + 51;
  },
  methods: {
    back() {
      this.$router.back();
    },
    scroll(pos) {
      this.scrollY = pos.y;
    },
    selectItem(item, index) {
      this.selectPlay({
        list: this.songs,
        song: item,
        index
      });
    },
    ...mapActions(["selectPlay"])
  },
  watch: {
    scrollY(newY) {
      let translateY = Math.max(this.minTranslateY, newY);
      let scale = 1;
      let zIndex = 0;
      let blur = 0;
      let percent = Math.abs(newY / this.imageHeight);
      if (newY > 0) {
        scale = 1 + percent;
        this.$refs.list.style[transform] = `translate3d(0,${translateY}px,0)`;
        this.$refs.headerBg.style.background = `rgba(247, 127, 86, 0)`;
      } else {
        blur = Math.min(20, percent * 20);
        this.$refs.list.style["box-shadow"] = "none";
        this.$refs.headerBg.style.background = `rgba(247, 127, 86, ${percent})`;
      }

      this.$refs.layer.style[transform] = `translate3d(0,${translateY -
        51}px,0)`;

      if (newY < this.minTranslateY) {
        zIndex = 10;
        this.$refs.bgImage.style.paddingTop = 0;
        this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`;
      } else {
        this.$refs.bgImage.style.paddingTop = "75%";
        this.$refs.bgImage.style.height = 0;
      }

      this.$refs.bgImage.style[transform] = `scale(${scale})`;
      this.$refs.bgImage.style.zIndex = zIndex;
      this.$refs.filter.style[backdrop] = `blur(${blur}px)`;
    }
  },
  components: {
    Scroll,
    SongList,
    Loading
  }
};
</script>

<style lang="scss" scoped>
@import "common/style/variable.scss";
@import "common/style/mixins.scss";

.music-list {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: $color-bg-7;
  z-index: 99;
  .header-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 42px;
    z-index: 15;
    .back {
      position: absolute;
      top: 0;
      left: 6px;
      z-index: 50;
      .icon-back {
        display: block;
        padding: 10px;
        font-size: $font-size-large-x;
        color: $color-white;
      }
    }
    .title {
      position: absolute;
      top: 0;
      left: 10%;
      z-index: 40;
      width: 80%;
      @include no-wrap();
      text-align: center;
      line-height: 42px;
      font-size: 18px;
      font-weight: normal;
      color: $color-white;
    }
  }

  .bg-layer {
    position: relative;
    height: 100%;
    background-color: $color-white;
    border-top-left-radius: 50px;
    border-top-right-radius: 50px;
    box-shadow: 0px 2px 10px 1px rgba(0, 0, 0, 0.2);
  }
  .bg-image {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 75%;
    transform-origin: top;
    background-size: cover;
    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgb(0, 0, 0);
      opacity: 0.2;
    }
  }
  .list {
    position: absolute;
    top: 230px;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: $color-white;
    border-top-left-radius: 50px;
    border-top-right-radius: 50px;
    box-shadow: 0px 2px 10px 1px rgba(0, 0, 0, 0.2);
    z-index: 9;
    .sub-list {
      height: 100%;
    }
    .song-list-wrapper {
      padding: 20px 30px;
    }
  }
}
</style>