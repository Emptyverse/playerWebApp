<template>
  <div class="home">
    <div class="content">
      <Discovery></Discovery>
    </div>
    <keep-alive exclude="topListDeatil">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import Discovery from "@/discovery/discovery";
export default {
  components: {
    Discovery
  }
};
</script>

<style lang="scss" scoped>
@import "common/style/variable.scss";

.home {
  position: fixed;
  top: 44px;
  left: 0;
  right: 0;
  bottom: 80px;
  z-index: 15;
  .tab {
    display: flex;
    margin: 0 5vw;
    padding: 10px 0;
    height: 60px;
    line-height: 40px;
    font-size: $font-size-medium-x;
    text-align: center;
    .tab-item {
      flex: 1;
    }
  }
}
</style>