<template>
  <transition appear name="fade">
    <div class="search">
      <div class="search-wrapper">
        <div class="back">
          <i class="iconfont icon-back" @click="back"></i>
        </div>
        <div class="search-box-wrapper">
          <search-box ref="searchBox" @query="onQueryChange"></search-box>
        </div>
        <div class="shortcut-wrapper" v-show="!query">
          <scroll :data="hotKey" class="shortcut">
            <div>
              <div class="hot-key">
                <h1 class="title">热门搜索</h1>
                <ul>
                  <li
                    v-for="(item, index) in hotKey"
                    :key="index"
                    class="item"
                    @click="addQuery(item.first)"
                  >
                    <span>{{ item.first }}</span>
                  </li>
                </ul>
              </div>
              <div class="search-history" v-show="searchHistory.length">
                <h1 class="title">
                  <span class="text">搜索历史</span>
                  <span class="clear" @click="showConfirm">
                    <i class="iconfont icon-aaaziyuan"></i>
                  </span>
                </h1>
                <search-list
                  @delete="deleteSearchHistory"
                  @select="addQuery"
                  :searches="searchHistory"
                ></search-list>
              </div>
            </div>
          </scroll>
        </div>
        <div class="search-result" v-show="query">
          <suggest @listScroll="blurInput" :query="query" @select="saveSearch" ref="suggest"></suggest>
        </div>
        <confirm ref="confirm" @confirm="clearSearchHistory" text="是否清空所有搜索历史" confirmBtnText="清空"></confirm>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapActions } from "vuex";
import Scroll from "base/scroll/scroll";
import searchBox from "base/search-box/search-box";
import searchList from "base/search-list/search-list";
import confirm from "base/confirm/confirm";
import suggest from "@/suggest/suggest";
import { getSearchHot } from "api/search";
import { ERR_OK } from "api/config";
import { searchMixin } from "common/js/mixin/mixin";
export default {
  mixins: [searchMixin],
  data() {
    return {
      hotKey: []
    };
  },
  methods: {
    back() {
      this.$router.back();
    },
    _getHotKey() {
      getSearchHot().then(res => {
        if (res.data.code === ERR_OK) {
          this.hotKey = res.data.result.hots;
        }
      });
    },
    showConfirm() {
      this.$refs.confirm.show();
    },
    ...mapActions(["clearSearchHistory"])
  },
  computed: {
    shortcut() {
      return this.hotKey.concat(this.searchHistory);
    }
  },
  components: {
    Scroll,
    searchBox,
    searchList,
    confirm,
    suggest
  },
  created() {
    this._getHotKey();
  }
};
</script>

<style lang="scss" scoped>
@import "common/style/variable.scss";

.search {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: $color-bg-1;
  z-index: 97;
  .back {
    .icon-back {
      display: block;
      padding: 10px 10px 10px 16px;
      font-size: 22px;
      color: $color-orange-s;
    }
  }

  .search-box-wrapper {
    margin: 20px;
  }

  .shortcut-wrapper {
    position: fixed;
    top: 133px;
    bottom: 0;
    width: 100%;
    .hot-key {
      margin: 0 20px 20px;
      .title {
        margin-bottom: 20px;
        font-size: $font-size-medium;
        color: $color-gray;
      }
      .item {
        display: inline-block;
        padding: 5px 10px;
        margin: 0 20px 10px 0;
        border-radius: 6px;
        background: $color-white;
        font-size: $font-size-medium;
        color: $color-gray;
      }
    }
    .search-history {
      position: relative;
      margin: 0 20px;
      .title {
        display: flex;
        align-items: center;
        height: 40px;
        font-size: $font-size-medium;
        color: $color-gray;
      }
      .text {
        flex: 1;
      }
      .clear {
        color: $color-gray;
      }
    }
  }

  .search-result {
    position: fixed;
    top: 133px;
    bottom: 0;
    width: 100%;
  }
}
</style>