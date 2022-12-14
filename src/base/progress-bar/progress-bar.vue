<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div
        class="progress-btn-wrapper"
        ref="progressBtn"
        @touchstart.prevent="progressTouchStart"
        @touchmove.prevent="progressTouchMove"
        @touchend="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { prefixStyle } from "common/js/util/dom";

const progressBtnWidth = 16;
const transform = prefixStyle("transform");

export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  created() {
    this.touch = {};
  },
  methods: {
    _offset(width) {
      this.$refs.progress.style.width = `${width}px`;
      this.$refs.progressBtn.style[transform] = `translate3d(${width}px, 0, 0)`;
    },
    _getPercent() {
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
      return this.$refs.progress.clientWidth / barWidth;
    },
    _triggerPercent() {
      this.$emit("percentChange", this._getPercent());
    },
    progressClick(e) {
      const rect = this.$refs.progressBar.getBoundingClientRect();
      const offsetWidth = e.pageX - rect.left;

      this._offset(offsetWidth);
      // 这里当我们点击 progressBtn 的时候，e.offsetX 获取不对
      // this._offset(e.offsetX)
      this._triggerPercent();
    },
    progressTouchStart(e) {
      this.touch.initiated = true;
      this.touch.startX = e.touches[0].pageX;
      this.touch.left = this.$refs.progress.clientWidth;
    },
    progressTouchMove(e) {
      if (!this.touch.initiated) {
        return;
      }
      const deltaX = e.touches[0].pageX - this.touch.startX;
      const offsetWidth = Math.min(
        this.$refs.progressBar.clientWidth - progressBtnWidth,
        Math.max(0, this.touch.left + deltaX)
      );
      this._offset(offsetWidth);
      this.$emit("percentChanging", this._getPercent());
    },
    progressTouchEnd() {
      this.touch.initiated = false;
      this._triggerPercent();
    },
    setProgressOffset(percent) {
      // 如果是在拖动 则不自动更新
      if (percent >= 0 && !this.touch.initiated) {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
        const offsetWidth = percent * barWidth;
        this._offset(offsetWidth);
      }
    }
  },
  watch: {
    percent(newVal) {
      this.setProgressOffset(newVal);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "common/style/variable.scss";
.progress-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    .progress {
      position: absolute;
      height: 100%;
      background-color: $color-orange-l;
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $color-white;
        border-radius: 50%;
        background: $color-orange-l;
      }
    }
  }
}
</style>