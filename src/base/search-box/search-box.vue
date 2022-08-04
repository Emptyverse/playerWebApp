<template>
  <div class="search-box">
    <i class="iconfont icon-chazhao"></i>
    <input type="text" class="search-input" :placeholder="placeholder" v-model="query" ref="query"/>
    <i class="iconfont icon-guanbi" v-show="query" @click="clear"></i>
  </div>
</template>

<script>
import { debounce } from "common/js/util/debouce";

export default {
  props: {
    placeholder: {
      type: String,
      default: "搜索歌曲、歌手"
    }
  },
  data() {
    return {
      query: ""
    };
  },
  methods: {
    clear() {
      this.query = "";
    },
    setQuery(query) {
      this.query = query;
    },
    blur() {
      this.$refs.query.blur();
    }
  },
  created() {
    this.$watch(
      "query",
      debounce(newQuery => {
        this.$emit("query", newQuery);
      }, 200)
    );
  }
};
</script>

<style lang="scss" scoped>
@import "common/style/variable.scss";
.search-box {
  position: relative;
  width: 100%;
  .iconfont {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    color: $color-gray;
  }
  .icon-chazhao {
    left: 20px;
  }
  .icon-guanbi {
    right: 20px;
    font-size: $font-size-small;
  }
  .search-input {
    padding: 20px 20px 20px 45px;
    width: 100%;
    color: $color-gray;
    background-color: $color-bg-7;
    outline: none;
    border: none;
    border-radius: 20px;
    &::-webkit-input-placeholder {
      color: $color-gray;
    }
  }
}
</style>