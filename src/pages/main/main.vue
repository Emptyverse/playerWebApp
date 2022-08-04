<template>
  <div class="main">
    <Mheader @show="getUserDetail"></Mheader>
    <UserCenter ref="userCenter"></UserCenter>
    <keep-alive exclude="topListDeatil">
      <router-view />
    </keep-alive>
    <Player></Player>
    <Nav></Nav>
  </div>
</template>

<script>
import Mheader from "@/header/header";
import UserCenter from "@/user-center/user-center";
import Nav from "@/nav/nav";
import Player from "@/player/player";

export default {
  methods: {
    getUserDetail() {
      this.$refs.userCenter._getUserDetail();
    }
  },
  components: {
    Mheader,
    UserCenter,
    Nav,
    Player
  }
};
</script>
<style lang="scss" scoped>
</style>
