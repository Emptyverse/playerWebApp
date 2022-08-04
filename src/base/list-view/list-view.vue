<template>
  <Scroll
    class="list-view"
    :data="data"
    :probeType="probeType"
    :listenScroll="listenScroll"
    @scroll="scroll"
    ref="listview"
  >
    <ul>
      <li v-for="(group, index) in data" :key="index" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{ group.title }}</h2>
        <ul>
          <li
            v-for="(item, index) in group.items"
            class="list-group-item"
            :key="index"
            @click="selectItem(item)"
          >
            <img v-lazy="item.avatar" class="avatar" width="50" height="50" />
            <span class="singer-name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut">
      <ul
        @touchstart.stop.prevent="onShortcutTouchStart"
        @touchmove.stop.prevent="onShortcutTouchMove"
        @touchend.stop
      >
        <li
          v-for="(item, index) in shortcutList"
          class="item"
          :key="index"
          :data-index="index"
          :class="{ current: currentIndex === index }"
        >{{ item }}</li>
      </ul>
    </div>
    <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <div class="fixed-title">{{fixedTitle}}</div>
    </div>
    <div class="loading-container" v-show="!data.length">
      <Loading></Loading>
    </div>
  </Scroll>
</template>

<script>
import Loading from "base/loading/loading";
import Scroll from "base/scroll/scroll";
import { getData } from "common/js/util/dom";

const TITLE_HEIGHT = 25;
const ANCHOR_HEIGHT = 18;
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: -1
    };
  },
  created() {
    this.probeType = 3;
    this.listenScroll = true;
    this.touch = {};
    this.listHeight = [];
  },
  methods: {
    _calculateHeight() {
      this.listHeight = [];
      const listGroup = this.$refs.listGroup;
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < listGroup.length; i++) {
        let item = listGroup[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    },
    scroll(pos) {
      this.scrollY = pos.y;
    },
    onShortcutTouchStart(e) {
      let anchorIndex = getData(e.target, "index");
      let firstTouch = e.touches[0];
      this.touch.y1 = firstTouch.pageY;
      this.touch.anchorIndex = anchorIndex;

      this._scrollTo(anchorIndex);
    },
    onShortcutTouchMove(e) {
      let firstTouch = e.touches[0];
      this.touch.y2 = firstTouch.pageY;
      let delta = ((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT) | 0;
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta;

      this._scrollTo(anchorIndex);
    },
    _scrollTo(index) {
      if (!index && index !== 0) {
        return false;
      }

      if (index < 0) {
        index = 0;
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2;
      }

      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0);
      this.scrollY = this.$refs.listview.scroll.y;
    },
    selectItem(item) {
      this.$emit("select", item);
    }
  },
  computed: {
    shortcutList() {
      return this.data.map(group => {
        return group.title.substr(0, 1);
      });
    },
    fixedTitle() {
      if (this.scrollY > 0) {
        return "";
      }
      return this.data[this.currentIndex]
        ? this.data[this.currentIndex].title
        : "";
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this._calculateHeight();
      }, 20);
    },
    scrollY(newY) {
      const listHeight = this.listHeight;
      if (newY > 0) {
        this.currentIndex = 0;
        return
      }

      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i];
        let height2 = listHeight[i + 1];
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i;
          this.diff = height2 + newY;
          return;
        }
      }

      this.currentIndex = listHeight.length - 2;
    },
    diff(newVal) {
      let fixedTop =
        newVal > 0 && newVal < TITLE_HEIGHT ? newVal - TITLE_HEIGHT : 0;
      if (this.fixedTop === fixedTop) {
        return;
      }
      this.fixedTop = fixedTop;
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`;
    }
  },
  components: {
    Scroll,
    Loading
  }
};
</script>

<style lang="scss" scoped>
@import "common/style/variable.scss";
.list-view {
  position: relative;
  height: 100%;
  overflow: hidden;
  background-color: $color-bg-4;
  .list-group {
    .list-group-title {
      margin-bottom: 10px;
      padding-left: 12px;
      height: 25px;
      line-height: 25px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-orange-l;
    }
    .list-group-item {
      display: flex;
      align-items: center;
      margin: 0 5px;
      padding: 5px 0;
      border-bottom: 1px solid $color-bg-5;
      .avatar {
        border-radius: 5px;
      }

      .singer-name {
        margin-left: 20px;
        color: $color-black;
        font-size: $font-size-medium;
      }
      &:last-child {
        border: none;
        padding-bottom: 15px;
      }
    }
  }
  .list-shortcut {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 0;
    padding: 20px 0;
    width: 20px;
    border-radius: 10px;
    text-align: center;
    background-color: $color-orange-l;
    .item {
      padding: 3px;
      line-height: 1;
      font-size: $font-size-small;
      color: $color-text-l;
      &.current {
        color: $color-red-s;
      }
    }
  }
  .list-fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    .fixed-title {
      padding-left: 12px;
      height: 25px;
      line-height: 25px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-orange-l;
    }
  }
}
</style>