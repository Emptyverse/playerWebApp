<template>
  <div class="header">
    <div class="icon">
      <i class="iconfont icon-list" @click="show"></i>
    </div>
    <div>
      <p class="title">Guang</p>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  methods: {
    show() {
      this.setShowUserCenter(true);
      this.$emit('show');
    },
    ...mapMutations({
      setShowUserCenter: 'SET_SHOW_USER_CENTER'
    })
  },
  computed: {
    ...mapGetters(['showUserCenter'])
  }
};
</script>

<style lang="scss" scoped>
@import "common/style/variable.scss";
.header {
  position: relative;
  height: 44px;
  .icon {
    position: absolute;
    top: 0;
    left: 0;
    .icon-list {
      display: block;
      padding: 11px;
      font-size: 22px;
      font-weight: bold;
      color: $color-orange;
    }
  }
  .title {
    width: 100%;
    line-height: 44px;
    font-size: $font-size-large;
    color: $color-orange;
    font-weight: bold;
    text-align: center;
    letter-spacing: 3px;
  }
}
</style>