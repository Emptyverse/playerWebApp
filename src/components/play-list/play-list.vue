<template>
  <transition name="list-fade">
    <div class="player-list" v-show="showFlag" @click="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="iconfont mode" :class="modeIcon" @click="changeMode"></i>
            <span class="text">{{ modeText }}</span>
            <span class="clear" @click="showConfirm">
              <i class="iconfont icon-aaaziyuan"></i>
            </span>
          </h1>
        </div>
        <Scroll
          class="list-content"
          :data="sequenceList"
          ref="listContent"
          :refreshDelay="refreshDelay"
        >
          <transition-group ref="list" name="list" tag="ul">
            <li
              :key="item.id"
              class="item"
              v-for="(item,index) in sequenceList"
              @click="selectItem(item,index)"
            >
              <i class="iconfont current" :class="getCurrentIcon(item)"></i>
              <span class="text" v-html="item.name"></span>
              <span @click.stop="toggleFavorite(item)" class="like">
                <i class="iconfont" :class="getFavoriteIcon(item)"></i>
              </span>
              <span class="delete" @click.stop="deleteOne(item)">
                <i class="iconfont icon-guanbi"></i>
              </span>
            </li>
          </transition-group>
        </Scroll>
        <div class="list-operate">
          <div class="add">
            <i class="iconfont icon-jia"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="confirm" @confirm="confirmClear" text="是否清空播放列表" confirmBtnText="清空"></confirm>
    </div>
  </transition>
</template>

<script>
import { mapActions } from "vuex";
import Confirm from "base/confirm/confirm";
import Scroll from "base/scroll/scroll";
import { playerMixin } from "common/js/mixin/mixin";
import { playMode } from "common/js/player/config";

export default {
  mixins: [playerMixin],
  data() {
    return {
      showFlag: false,
      refreshDelay: 120
    };
  },
  methods: {
    hide() {
      this.showFlag = false;
    },
    show() {
      this.showFlag = true;
      setTimeout(() => {
        this.$refs.listContent.refresh();
        this.scrollToCurrent(this.currentSong);
      }, 20);
    },
    showConfirm() {
      this.$refs.confirm.show();
    },
    confirmClear() {
      this.deleteSongList();
      this.hide();
    },
    getCurrentIcon(item) {
      if (this.currentSong.id === item.id) {
        return "icon-icon_play";
      }
      return "";
    },
    scrollToCurrent(current) {
      const index = this.sequenceList.findIndex(song => {
        return current.id === song.id;
      });
      this.$refs.listContent.scrollToElement(
        this.$refs.list.$el.children[index],
        300
      );
    },
    deleteOne(item) {
      if (item.deleting) {
        return;
      }
      item.deleting = true;
      this.deleteSong(item);
      if (!this.playlist.length) {
        this.hide();
      }
      setTimeout(() => {
        item.deleting = false;
      }, 300);
    },
    selectItem(item, index) {
      if (this.mode === playMode.random) {
        index = this.playlist.findIndex(song => {
          return song.id === item.id;
        });
      }
      this.setCurrentIndex(index);
      this.setPlayingState(true);
    },
    ...mapActions(["deleteSong", "deleteSongList"])
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (!this.showFlag || newSong.id === oldSong.id) {
        return;
      }
      setTimeout(() => {
        this.scrollToCurrent(newSong);
      }, 20);
    }
  },
  computed: {
    modeText() {
      return this.mode === playMode.sequence
        ? "顺序播放"
        : this.mode === playMode.random
        ? "随机播放"
        : "单曲循环";
    }
  },
  components: {
    Confirm,
    Scroll
  }
};
</script>

<style lang="scss" scoped>
@import "common/style/variable.scss";
@import "common/style/mixins.scss";

.player-list {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 200;
  background-color: rgba(0, 0, 0, 0.3);

  &.list-fade-enter-active,
  &.list-fade-leave-active {
    transition: opacity 0.3s;
    .list-wrapper {
      transition: all 0.3s;
    }
  }

  &.list-fade-enter,
  &.list-fade-leave-to {
    opacity: 0;
    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }

  .list-wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: $color-white;
    .list-header {
      position: relative;
      padding: 20px 30px 10px 20px;
      .title {
        display: flex;
        align-items: center;
        .mode {
          margin-right: 10px;
          font-size: 30px;
          color: $color-light-black;
        }
        .text {
          flex: 1;
          line-height: 1;
          font-size: $font-size-medium;
          color: $color-light-black;
        }
        .clear {
          .iconfont {
            font-size: $font-size-large;
            color: $color-gray;
          }
        }
      }
    }
    .list-content {
      max-height: 280px;
      overflow: hidden;
      height: 100%;
      .item {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;
        &.list-enter-active,
        &.list-leave-active {
          transition: all 0.1s;
        }
        &.list-enter,
        &.list-leave-to {
          height: 0;
        }
        .current {
          flex: 0 0 20px;
          width: 20px;
        }
        .text {
          flex: 1;
          @include no-wrap();
          font-size: $font-size-medium;
          color: $color-black;
        }
        .like {
          position: relative;
          margin-right: 15px;
          .iconfont {
            font-weight: bold;
            color: $color-orange-l;
          }
        }
        .delete {
          .iconfont {
            font-weight: bold;
            color: $color-orange-l;
          }
        }
      }
    }
  }

  .list-operate {
    width: 140px;
    margin: 20px auto 30px auto;
    .add {
      display: flex;
      align-items: center;
      padding: 8px 16px;
      border: 1px solid $color-orange-l;
      border-radius: 100px;

      .icon-jia {
        margin-right: 5px;
        font-size: $font-size-small-s;
        color: $color-orange-l;
      }
      .text {
        font-size: $font-size-small;
        color: $color-orange-l;
      }
    }
  }

  .list-close {
    text-align: center;
    line-height: 50px;
    background: $color-bg-1;
    color: $color-gray;
    font-size: $font-size-medium-x;
  }
}
</style>