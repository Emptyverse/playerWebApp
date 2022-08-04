<template>
  <div class="player" v-show="playlist.length > 0">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <div class="filter"></div>
          <img :src="currentSong.image" />
        </div>
        <div class="top">
          <div class="back">
            <i class="iconfont icon-back" @click="back"></i>
          </div>
          <h1 class="title">{{ currentSong.name }}</h1>
          <h2 class="sub-title">{{ currentSong.singer }}</h2>
        </div>
        <div
          class="middle"
          @touchstart.prevent="middleTouchStart"
          @touchmove.prevent="middleTouchMove"
          @touchend="middleTouchEnd"
        >
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" ref="imageWrapper">
                <img :src="currentSong.image" class="image" :class="cdCls" ref="image" />
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{ playingLyric }}</div>
            </div>
          </div>
          <Scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p
                  ref="lyricLine"
                  class="text"
                  :class="{ current: currentLineNum === index }"
                  v-for="(line, index) in currentLyric.lines"
                  :key="index"
                >{{ line.txt }}</p>
              </div>
              <div class="pure-music" v-show="isPureMusic">
                <p>{{ pureMusicLyric }}</p>
              </div>
            </div>
          </Scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow==='cd'}"></span>
            <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{ format(currentTime) }}</span>
            <div class="progress-bar-wrapper">
              <ProgressBar
                :percent="percent"
                @percentChange="onProgressBarChange"
                @percentChanging="onProgressBarChanging"
                ref="progressBar"
              ></ProgressBar>
            </div>
            <span class="time time-r">{{ format(this.duration) }}</span>
          </div>
          <div class="operators">
            <div class="icon left">
              <i class="iconfont icon-xunhuan1" @click="changeMode" :class="modeIcon"></i>
            </div>
            <div class="icon left" :class="disableCls">
              <i class="iconfont icon-caret-right prev indent" @click="prev"></i>
              <i class="iconfont icon-caret-right prev" @click="prev"></i>
            </div>
            <div class="icon center" :class="disableCls">
              <div class="play-bg" @click="togglePlaying"></div>
              <i class="iconfont" :class="playIcon"></i>
            </div>
            <div class="icon right" :class="disableCls">
              <i class="iconfont icon-caret-right indent" @click="next"></i>
              <i class="iconfont icon-caret-right" @click="next"></i>
            </div>
            <div class="icon right">
              <i class="iconfont" @click.stop="toggleFavorite(currentSong)" :class="favoriteIcon"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div v-show="!fullScreen" @click="open" :class="{ sidebar: showSidebar }">
        <div class="mini-player" ref="miniPlayer">
          <div class="icon">
            <div class="imgWrapper" ref="miniWrapper">
              <img :src="currentSong.image" width="40" height="40" :class="cdCls" ref="miniImage" />
            </div>
          </div>
          <div class="text">
            <h2 class="name">{{ currentSong.name }}</h2>
            <p class="desc">{{ currentSong.singer }}</p>
          </div>
          <div class="control">
            <ProgressCircle :radius="radius" :percent="percent">
              <i class="iconfont" :class="playIcon" @click.stop="togglePlaying"></i>
            </ProgressCircle>
          </div>
          <div class="control">
            <i class="iconfont icon-bofangliebiao" @click.stop="showPlayList"></i>
          </div>
          <div class="control sidebar">
            <i class="iconfont icon-cebianlan" @click.stop="closeMini"></i>
          </div>
        </div>
        <div class="sidebar-player" @click.stop="openMini">
          <div class="imgWrapper">
            <img :src="currentSong.image" width="30" height="30" :class="cdCls" />
          </div>
        </div>
      </div>
    </transition>
    <playlist ref="playlist"></playlist>
    <audio
      ref="audio"
      @playing="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="end"
      @pause="paused"
    ></audio>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { prefixStyle } from "common/js/util/dom";
import { playerMixin } from "common/js/mixin/mixin";
import { playMode } from "common/js/player/config";
import animations from "create-keyframe-animation";
import Lyric from "lyric-parser";
import Scroll from "base/scroll/scroll";
import ProgressBar from "base/progress-bar/progress-bar";
import ProgressCircle from "base/progress-circle/progress-circle";
import Playlist from "@/play-list/play-list";

const transform = prefixStyle("transform");
const transitionDuration = prefixStyle("transitionDuration");
const timeExp = /\[(\d{2}):(\d{2}):(\d{2})]/g;

export default {
  mixins: [playerMixin],
  created() {
    this.touch = {};
  },
  data() {
    return {
      // 歌曲是否可以播放
      songReady: false,
      // 歌词是否可以播放
      canLyricPlay: false,
      // 当前歌曲进度
      currentTime: 0,
      // 歌词对象
      currentLyric: null,
      currentLineNum: 0,
      playingLyric: "",
      // 是否为纯音乐
      isPureMusic: false,
      // 纯音乐显示的内容
      pureMusicLyric: "",
      // 显示的是图片还是歌词
      currentShow: "cd",
      // 歌曲url
      url: "",
      // 歌曲时长
      duration: 0,
      /// mini播放器圆形进度条宽度
      radius: 30
    };
  },
  methods: {
    back() {
      this.setFullScreen(false);
    },
    // 打开播放器
    open() {
      this.setFullScreen(true);
    },
    // 打开播放器的动画钩子函数
    enter(el, done) {
      let { x, y, scale } = this._getPosAndScale();
      let animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0,0,0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`
        }
      };
      // 使用的第三方动画库 create-keyframe-animation
      // 注册动画
      animations.registerAnimation({
        name: "move",
        animation,
        presets: {
          duration: 400,
          easing: "linear"
        }
      });
      // 执行动画
      animations.runAnimation(this.$refs.cdWrapper, "move", done);
    },
    // 打开播放器的动画钩子函数
    afterEnter() {
      // 卸载动画
      animations.unregisterAnimation("move");
      this.$refs.cdWrapper.style.animation = "";
    },
    // 打开播放器的动画钩子函数
    leave(el, done) {
      this.$refs.cdWrapper.style.transition = "all 0.4s";
      const { x, y, scale } = this._getPosAndScale();
      this.$refs.cdWrapper.style[
        transform
      ] = `translate3d(${x}px,${y}px,0) scale(${scale})`;
      this.$refs.cdWrapper.addEventListener("transitionend", done);
    },
    // 打开播放器的动画钩子函数
    afterLeave() {
      this.$refs.cdWrapper.style.transition = "";
      this.$refs.cdWrapper.style[transform] = "";
    },
    // 计算动画需要进行变化的数据
    _getPosAndScale() {
      const targetWidth = 40;
      const paddingLeft = 30;
      const paddingBottom = 20;
      const paddingTop = 103;
      const width = window.innerWidth * 0.6;
      const scale = targetWidth / width;
      const x = -(window.innerWidth / 2 - paddingLeft - targetWidth * 0.5);
      const y = window.innerHeight - paddingTop - paddingBottom - width * 0.5;
      return {
        x,
        y,
        scale
      };
    },
    ready() {
      // 监听 playing 这个事件可以确保慢网速或者快速切换歌曲导致的 DOM Exception
      this.songReady = true;
      this.canLyricPlay = true;
      // 如果歌曲的播放晚于歌词的出现，播放的时候需要同步歌词
      if (this.currentLyric && !this.isPureMusic) {
        this.currentLyric.seek(this.currentTime * 1000);
      }
    },
    error() {
      clearTimeout(this.timer);
      this.songReady = true;
    },
    updateTime(e) {
      this.currentTime = e.target.currentTime;
    },
    end() {
      this.currentTime = 0;
      if (this.mode === playMode.loop) {
        this.loop();
      } else {
        this.next();
      }
    },
    paused() {
      this.setPlayingState(false);
      if (this.currentLyric) {
        this.currentLyric.stop();
      }
    },
    middleTouchStart(e) {
      this.touch.initiated = true;
      this.touch.directionLocked = "";
      // 用来判断是否是一次移动
      this.touch.moved = false;
      const touch = e.touches[0];
      this.touch.startX = touch.pageX;
      this.touch.startY = touch.pageY;
    },
    middleTouchMove(e) {
      if (!this.touch.initiated) {
        return;
      }
      const touch = e.touches[0];
      const deltaX = touch.pageX - this.touch.startX;
      const deltaY = touch.pageY - this.touch.startY;

      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      if (!this.touch.directionLocked) {
        if (absDeltaX > absDeltaY) {
          this.touch.directionLocked = "h"; // lock horizontally
        } else if (absDeltaY >= absDeltaX) {
          this.touch.directionLocked = "v"; // lock vertically
        }
      }

      if (this.touch.directionLocked === "v") {
        return;
      }

      if (!this.touch.moved) {
        this.touch.moved = true;
      }
      const left = this.currentShow === "cd" ? 0 : -window.innerWidth;
      const offsetWidth = Math.min(
        0,
        Math.max(-window.innerWidth, left + deltaX)
      );
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth);
      this.$refs.lyricList.$el.style[
        transform
      ] = `translate3d(${offsetWidth}px,0,0)`;
      this.$refs.lyricList.$el.style[transitionDuration] = 0;
      this.$refs.middleL.style.opacity = 1 - this.touch.percent;
      this.$refs.middleL.style[transitionDuration] = 0;
    },
    middleTouchEnd() {
      if (!this.touch.moved) {
        return;
      }
      let offsetWidth;
      let opacity;
      if (this.currentShow === "cd") {
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth;
          opacity = 0;
          this.currentShow = "lyric";
        } else {
          offsetWidth = 0;
          opacity = 1;
        }
      } else {
        if (this.touch.percent < 0.9) {
          offsetWidth = 0;
          this.currentShow = "cd";
          opacity = 1;
        } else {
          offsetWidth = -window.innerWidth;
          opacity = 0;
        }
      }
      const time = 300;
      this.$refs.lyricList.$el.style[
        transform
      ] = `translate3d(${offsetWidth}px,0,0)`;
      this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`;
      this.$refs.middleL.style.opacity = opacity;
      this.$refs.middleL.style[transitionDuration] = `${time}ms`;
      this.touch.initiated = false;
    },
    _pad(num, n = 2) {
      let len = num.toString().length;
      while (len < n) {
        num = "0" + num;
        len++;
      }
      return num;
    },
    format(interval) {
      interval = interval | 0;
      const minute = (interval / 60) | 0;
      const second = this._pad(interval % 60);
      return `${minute}:${second}`;
    },
    // 获取歌曲歌词
    getLyric() {
      this.currentSong
        .getLyric()
        .then(lyric => {
          if (this.currentSong.lyric !== lyric) {
            return;
          }
          this.currentLyric = new Lyric(lyric, this.handleLyric);
          this.isPureMusic = !this.currentLyric.lines.length;
          if (this.isPureMusic) {
            this.pureMusicLyric = this.currentLyric.lrc
              .replace(timeExp, "")
              .trim();
            this.playingLyric = this.pureMusicLyric;
          } else {
            if (this.playing && this.canLyricPlay) {
              // 这个时候有可能用户已经播放了歌曲，要切到对应位置
              this.currentLyric.seek(this.currentTime * 1000);
            }
          }
        })
        .catch(() => {
          this.currentLyric = null;
          this.playingLyric = "";
          this.currentLineNum = 0;
        });
    },
    handleLyric({ lineNum, txt }) {
      if (!this.$refs.lyricLine) {
        return;
      }
      this.currentLineNum = lineNum;
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5];
        this.$refs.lyricList.scrollToElement(lineEl, 1000);
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000);
      }
      this.playingLyric = txt;
    },
    // 切换暂停播放
    togglePlaying() {
      if (!this.songReady) {
        return;
      }
      this.setPlayingState(!this.playing);
      if (this.currentLyric) {
        this.currentLyric.togglePlay();
      }
    },
    // 切换上一首歌
    prev() {
      if (!this.songReady) {
        return;
      }
      if (this.playlist.length === 1) {
        this.loop();
      } else {
        let index = this.currentIndex - 1;
        if (index < 0) {
          index = this.playlist.length - 1;
        }
        this.setCurrentIndex(index);
        if (!this.playing) {
          this.togglePlaying();
        }
      }
    },
    // 切换下一首歌
    next() {
      if (!this.songReady) {
        return;
      }
      if (this.playlist.length === 1) {
        this.loop();
      } else {
        let index = this.currentIndex + 1;
        if (index === this.playlist.length) {
          index = 0;
        }
        this.setCurrentIndex(index);
        if (!this.playing) {
          this.togglePlaying();
        }
      }
    },
    // 循环播放
    loop() {
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.play();
      this.setPlayingState(true);
      if (this.currentLyric) {
        this.currentLyric.seek(0);
      }
    },
    onProgressBarChange(percent) {
      const currentTime = this.currentSong.duration * percent;
      this.currentTime = this.$refs.audio.currentTime = currentTime;
      if (this.currentLyric) {
        this.currentLyric.seek(this.currentTime * 1000);
      }
    },
    onProgressBarChanging(percent) {
      const currentTime = this.currentSong.duration * percent;
      this.currentTime = this.$refs.audio.currentTime = currentTime;
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000);
      }
      if (!this.playing) {
        this.togglePlaying();
      }
    },
    /**
     * 计算内层Image的transform，并同步到外层容器
     * @param wrapper
     * @param inner
     */
    syncWrapperTransform(wrapper, inner) {
      if (!this.$refs[wrapper]) {
        return;
      }
      let imageWrapper = this.$refs[wrapper];
      let image = this.$refs[inner];
      let wTransform = getComputedStyle(imageWrapper)[transform];
      let iTransform = getComputedStyle(image)[transform];
      imageWrapper.style[transform] =
        wTransform === "none" ? iTransform : iTransform.concat(" ", wTransform);
    },
    showPlayList() {
      this.$refs.playlist.show();
    },
    closeMini() {
      this.setSidebar(true);
    },
    openMini() {
      this.setSidebar(false);
    },
    ...mapMutations({
      setPlayingState: "SET_PLAYING_STATE",
      setCurrentIndex: "SET_CURRENT_INDEX",
      setFullScreen: "SET_FULL_SCREEN",
      setSidebar: "SET_SHOW_SIDEBAR"
    })
  },
  computed: {
    cdCls() {
      return this.playing ? "play" : "";
    },
    disableCls() {
      return this.songReady ? "" : "disable";
    },
    playIcon() {
      return this.playing ? "icon-zanting" : "icon-icon_play";
    },
    // 播放进度的百分比
    percent() {
      return this.currentTime / this.currentSong.duration;
    },
    ...mapGetters(["playing", "fullScreen", "showSidebar", "currentIndex"])
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (!newSong.id || newSong.id === oldSong.id) {
        return;
      }
      this.currentTime = 0;
      this.songReady = false;
      this.canLyricPlay = false;

      if (this.currentLyric) {
        this.currentLyric.stop();
        // 重置为null
        this.currentLyric = null;
        this.currentTime = 0;
        this.playingLyric = "";
        this.currentLineNum = 0;
      }
      this.url = this.currentSong.url;
      this.duration = this.currentSong.duration;
      // 若歌曲 5s 未播放，则认为超时，修改状态确保可以切换歌曲。
      clearTimeout(this.timer);
      this.timer = setTimeout(function() {
        this.songReady = true;
      }, 5000);
      this.getLyric();
    },
    url(newVal) {
      this.$refs.audio.src = newVal;
      this.$refs.audio.play();
      // 若歌曲 5s 未播放，则认为超时，修改状态确保可以切换歌曲。
      clearTimeout(this.timer);
      this.timer = setTimeout(function() {
        this.songReady = true;
      }, 5000);
    },
    playing(newStatus) {
      if (!this.songReady) {
        return;
      }
      const audio = this.$refs.audio;
      this.$nextTick(function() {
        newStatus ? audio.play() : audio.pause();
      });
      if (!newStatus) {
        if (this.fullScreen) {
          this.syncWrapperTransform("imageWrapper", "image");
        } else {
          this.syncWrapperTransform("miniWrapper", "miniImage");
        }
      }
    },
    fullScreen(newVal) {
      // 监听是否全屏播放 当为true时进度条需要同步
      if (newVal) {
        setTimeout(() => {
          this.$refs.progressBar.setProgressOffset(this.percent);
        }, 20);
      }
    }
  },
  components: {
    Scroll,
    ProgressBar,
    ProgressCircle,
    Playlist
  }
};
</script>

<style lang="scss" scoped>
@import "common/style/variable.scss";
@import "common/style/mixins.scss";

.normal-player {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  background-color: $color-bg-7;
  .background {
    position: absolute;
    left: -50%;
    top: -50%;
    width: 300%;
    height: 300%;
    z-index: -1;
    opacity: 0.6;
    filter: blur(30px);
    .filter {
      position: absolute;
      width: 100%;
      height: 100%;
      background: black;
      opacity: 0.6;
    }
    img {
      width: 100%;
      height: 100%;
    }
  }
  .top {
    position: relative;
    margin-bottom: 45px;
    .back {
      position: absolute;
      top: 0;
      left: 6px;
      .icon-back {
        display: block;
        padding: 10px 5px;
        font-size: $font-size-large-x;
        color: $color-white;
      }
    }
    .title {
      width: 70%;
      margin: 0 auto;
      font-size: $font-size-large;
      color: $color-white;
      line-height: 42px;
      text-align: center;
      @include no-wrap();
    }
    .sub-title {
      font-size: $font-size-small;
      font-weight: 400;
      color: $color-white;
      text-align: center;
      line-height: 16px;
    }
  }
  .middle {
    position: fixed;
    width: 100%;
    top: 103px;
    bottom: 170px;
    white-space: nowrap;
    font-size: 0;
    .middle-l {
      display: inline-block;
      vertical-align: top;
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 60%;
      .cd-wrapper {
        position: absolute;
        left: 20%;
        top: 0;
        width: 60%;
        box-sizing: border-box;
        height: 100%;
        .cd {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          .image {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border-radius: 50%;
          }
          .play {
            animation: rotate 20s linear infinite;
          }
        }
      }
      .playing-lyric-wrapper {
        width: 66%;
        margin: 30px auto 0 auto;
        overflow: hidden;
        text-align: center;
        .playing-lyric {
          height: 20px;
          line-height: 20px;
          font-size: $font-size-medium;
          color: hsla(0, 0%, 100%, 0.5);
        }
      }
    }
    .middle-r {
      display: inline-block;
      vertical-align: top;
      width: 100%;
      height: 100%;
      overflow: hidden;
      .lyric-wrapper {
        width: 80%;
        margin: 0 auto;
        overflow: hidden;
        text-align: center;
        .text {
          line-height: 32px;
          color: hsla(0, 0%, 100%, 0.5);
          font-size: $font-size-medium;
          &.current {
            color: $color-white;
          }
        }
        .pure-music {
          padding-top: 50%;
          line-height: 32px;
          color: hsla(0, 0%, 100%, 0.5);
          font-size: $font-size-medium;
        }
      }
    }
  }
  .bottom {
    position: absolute;
    bottom: 50px;
    width: 100%;
    .dot-wrapper {
      text-align: center;
      font-size: 0;
      .dot {
        display: inline-block;
        vertical-align: middle;
        margin: 0 4px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: hsla(0, 0%, 100%, 0.5);
        &.active {
          width: 20px;
          border-radius: 5px;
          background-color: hsla(0, 0%, 100%, 0.8);
        }
      }
    }
    .progress-wrapper {
      display: flex;
      align-items: center;
      width: 80%;
      padding: 10px 0 20px;
      margin: 0 auto;
      .time {
        flex: 0 0 30px;
        width: 30px;
        line-height: 30px;
        color: $color-white;
        font-size: $font-size-small;
        &.time-l {
          text-align: left;
        }
        &.time-r {
          text-align: right;
        }
      }
      .progress-bar-wrapper {
        flex: 1;
      }
    }
    .operators {
      display: flex;
      .icon {
        flex: 1;
        .iconfont {
          font-size: 20px;
          font-weight: bold;
          color: $color-orange-l;
        }
        .prev {
          display: inline-block;
          &::before {
            display: inline-block;
            transform: rotate(-180deg);
          }
        }
        .indent {
          margin-right: -6px;
        }
        .play-bg {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 40px;
          height: 40px;
          margin: -21px 0 0 -20px;
          background-color: $color-orange-l;
          border-radius: 50%;
          opacity: 0.3;
        }
        &.left {
          text-align: right;
        }
        &.center {
          position: relative;
          padding: 0 20px;
          text-align: center;
        }
        &.right {
          text-align: left;
        }
        &.disable {
          opacity: 0.5;
        }
      }
    }
  }
  &.normal-enter-active,
  &.normal-leave-active {
    transition: all 0.4s;
    .top,
    .bottom {
      transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
    }
  }

  &.normal-enter,
  &.normal-leave-to {
    opacity: 0;
    .top {
      transform: translate3d(0, -100px, 0);
    }
    .bottom {
      transform: translate3d(0, 100px, 0);
    }
  }
}

.mini-player {
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 100;
  width: 100%;
  height: 60px;
  background: $color-white;
  box-shadow: 0px 2px 10px 1px rgba(0, 0, 0, 0.2);
  transition: all 1s;
  .icon {
    flex: 0 0 40px;
    width: 40px;
    height: 40px;
    padding: 0 10px 0 20px;
    box-sizing: content-box;
    .imgWrapper {
      width: 100%;
      height: 100%;
      img {
        border-radius: 50%;
      }
      .play {
        animation: rotate 20s linear infinite;
      }
    }
  }
  .text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    line-height: 20px;
    overflow: hidden;
    .name {
      color: $color-black;
      font-size: $font-size-medium;
      @include no-wrap();
      margin-bottom: 2px;
    }
    .desc {
      color: $color-gray;
      font-size: $font-size-small;
      @include no-wrap();
    }
  }
  .control {
    flex: 0 0 30px;
    width: 30px;
    padding: 0 10px;
    box-sizing: content-box;
    .icon-zanting,
    .icon-icon_play {
      position: absolute;
      top: 6px;
      left: 6px;
      font-size: $font-size-large;
      color: $color-orange-l;
    }
    .icon-bofangliebiao {
      font-size: 26px;
      color: $color-orange-l;
    }

    &.sidebar {
      flex: 0 0 20px;
      width: 20px;
      .icon-cebianlan {
        color: $color-orange-l;
      }
    }
  }

  .sidebar & {
    transform: translateX(150%);
    // display: none;
  }
}

.sidebar-player {
  position: fixed;
  right: 0px;
  top: 2px;
  z-index: 100;
  opacity: 0;
  visibility: hidden;
  transform: translateX(100%);
  transition: all 1s;
  .imgWrapper {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    text-align: center;
    background-color: $color-orange-l;
    img {
      margin-top: 5px;
      border-radius: 50%;
    }
    .play {
      animation: rotate 20s linear infinite;
    }
  }
  .sidebar & {
    opacity: 1;
    visibility: visible;
    transform: translateX(0);
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>