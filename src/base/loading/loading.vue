<template>
  <div class="loading">
    <img src="./loading.gif" width="24" height="24" />
    <p class="desc">{{title}}</p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "正在载入..."
    }
  },
  data() {
    return {};
  }
};
</script>
<style lang="scss" scoped>
@import "common/style/variable.scss";
.loading {
  width: 100%;
  height: 40px;
  text-align: center;
  .desc {
    line-height: 20px;
    font-size: 12px;
    color: $color-orange;
  }
  img {
    margin-top: 10px;
  }
}
</style>
