<template>
  <Scroll
    class="suggest"
    ref="suggest"
    :data="result"
    :pullup="pullup"
    :beforeScroll="beforeScroll"
    @scrollToEnd="searchMore"
    @beforeScroll="listScroll"
  >
    <ul class="suggest-list">
      <li
        class="suggest-item"
        v-for="(item, index) in result"
        :key="index"
        @click="selectItem(item)"
      >
        <div class="icon">
          <i class="iconfont icon-yinle"></i>
        </div>
        <div class="name">
          <p class="text">{{ item.name }}</p>
          <p class="singer">{{ item.singer }}</p>
        </div>
      </li>
      <Loading v-show="hasMore"></Loading>
    </ul>
    <div v-show="!hasMore && !result.length && query" class="no-result-wrapper">抱歉，暂无搜索结果</div>
  </Scroll>
</template>

<script>
import { mapActions } from "vuex";
import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";
import { createSearchSong, processSongsUrl } from "common/js/format/song";
import { search } from "api/search";
import { ERR_OK } from "api/config";
export default {
  props: {
    query: {
      type: String,
      default: ""
    },
    searchType: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      page: 0,
      pullup: true,
      beforeScroll: true,
      hasMore: false,
      result: []
    };
  },
  methods: {
    search(query) {
      this.hasMore = true;
      search(query, this.page)
        .then(res => {
          let list = res.data.result.songs;
          if (!list) {
            this.hasMore = false;
            return;
          }
          if (res.data.code === ERR_OK) {
            processSongsUrl(this._normalizeSong(list)).then(result => {
              this.result = result;
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    searchMore() {
      if (!this.hasMore) {
        return;
      }
      if (!this.result.length) {
        return;
      }

      search(this.query, this.page).then(res => {
        let list = res.data.result.songs;
        if (!list) {
          this.hasMore = false;
          return;
        }
        processSongsUrl(this._normalizeSong(list)).then(result => {
          this.result = this.result.concat(result);
        });
        this.page += 30;
      });
    },
    _normalizeSong(list) {
      let ret = [];
      list.map(item => {
        ret.push(createSearchSong(item));
      });
      return ret;
    },
    selectItem(item) {
      this.insertSong(item);
      this.$emit("select", item);
    },
    listScroll() {
      this.$emit("listScroll");
    },
    ...mapActions(["insertSong"])
  },
  watch: {
    query(newQuery) {
      if (!newQuery) {
        this.result = [];
        this.hasMore = true;
        return;
      }
      this.result = [];
      this.hasMore = true;
      this.page = 0;
      this.search(newQuery);
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
@import "common/style/mixins.scss";

.suggest {
  height: 100%;
  overflow: hidden;
  .suggest-list {
    .suggest-item {
      display: flex;
      align-items: center;
      padding: 10px 20px;
      // height: 50px;
      border-bottom: 1px solid #e4e4e4;
      .icon {
        width: 30px;
        flex: 0 0 30px;
        color: $color-gray;
      }
      .name {
        flex: 1;
        overflow: hidden;
        .text {
          padding: 3px 0;
          font-size: $font-size-medium-x;
          color: $color-black;
          @include no-wrap();
        }
        .singer {
          padding: 3px 0;
          font-size: $font-size-small;
          color: $color-gray;
          @include no-wrap();
        }
      }
    }
  }
  .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
    color: $color-gray;
    text-align: center;
  }
}
</style>