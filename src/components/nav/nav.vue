<template>
  <transition name="nav" appear>
    <div class="nav">
      <div class="nav-content">
        <div class="search-container" @click="gotoSeach">
          <span class="iconfont icon-chazhao"></span>
          <span class="text">Search</span>
        </div>
        <div class="nav-list">
          <div class="nav-item">
            <router-link tag="span" class="nav-icon iconfont icon-yinle" to="/home"></router-link>
          </div>
          <div class="nav-item">
            <router-link tag="span" class="nav-icon iconfont icon-paihang" to="/rank"></router-link>
          </div>
          <div class="nav-item">
            <router-link tag="span" class="nav-icon iconfont icon-flyme_icon-" to="/singer"></router-link>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  methods: {
    gotoSeach() {
      this.$router.push({
        path: "/search"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "common/style/variable.scss";

.nav-enter-active,
.nav-leave-active {
  transition: all 0.5s;
}

.nav-enter,
.nav-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  height: 60px;

  .nav-content {
    display: flex;
    padding: 0 10px 0 40px;
    height: 100%;
    background-color: $color-orange-l;

    .search-container {
      position: relative;
      width: 30%;
      padding-top: 15px;

      .icon-chazhao {
        position: absolute;
        top: 23px;
        left: 5px;
        color: $color-white;
        font-size: 20px;
      }

      .text {
        display: inline-block;
        width: 100%;
        height: 35px;
        line-height: 35px;
        font-size: $font-size-medium;
        padding-left: 35px;
        border-radius: 15px;
        background-color: #f29a67;
        color: $color-white;
      }
    }

    .nav-list {
      display: flex;
      width: 70%;
      justify-content: center;

      .nav-item {
        flex: 1;
        padding-top: 23px;
        color: $color-white;
        text-align: center;
      }

      .nav-icon {
        font-size: $font-size-large-x;
        font-weight: bold;
      }
    }
  }
}
</style>
