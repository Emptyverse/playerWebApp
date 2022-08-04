<template>
  <div class="login popup-wrapper">
    <div class="login-header">
      <h1>Welcome Back</h1>
    </div>
    <div class="login-content">
      <div class="field-item">
        <label>Phone</label>
        <div class="item-content" :class="{ error: phoneNumberError }">
          <i class="iconfont icon-phone2"></i>
          <input type="text" placeholder="输入手机号码" v-model="phoneNumber" @native.enter="login" />
        </div>
        <div class="error-message" v-show="phoneNumberError">手机号码格式不正确</div>
      </div>
      <div class="field-item">
        <label>Password</label>
        <div class="item-content" :class="{ error: passwordError }">
          <i class="iconfont icon-key"></i>
          <input type="password" placeholder="输入密码" v-model="password" @native.enter="login" />
        </div>
        <div class="error-message" v-show="passwordError">密码为8-20位, 含有数字、字母、符号 至少两种且不能含有空格</div>
      </div>
      <button class="normal-btn bg-orange" @click="login">Sign in</button>
    </div>
  </div>
</template>

<script>
import * as Util from "common/js/util/validate";
import { encrypt } from "common/js/util/md5";
import { loginCellphone } from "api/user/login";
import { ERR_OK } from "api/config";
export default {
  data() {
    return {
      phoneNumber: "",
      password: "",
      phoneNumberError: false,
      passwordError: false
    };
  },
  methods: {
    login() {
      if (!this.phoneNumber || !Util.isPhoneNumber(this.phoneNumber)) {
        this.phoneNumberError = true;
      } else {
        this.phoneNumberError = false;
      }

      if (!this.password || !Util.validatePassword(this.password)) {
        this.passwordError = true;
      } else {
        this.passwordError = false;
      }

      if (this.phoneNumberError || this.passwordError) {
        this.$message({
          type: "error",
          message: "手机号或者密码不正确"
        });
        return false;
      }
      loginCellphone(this.phoneNumber, encrypt(this.password))
        .then(res => {
          if (res.data.code === ERR_OK) {
            this.$message({
              type: "success",
              message: "登录成功"
            });
            this.phoneNumber = "";
            this.password = "";
            this.$router.push("/home");
          } else {
            this.$message({
              type: "error",
              message: "密码错误"
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  watch: {
    phoneNumber(newValue, oldValue) {
      if (!newValue || !Util.isPhoneNumber(newValue)) {
        this.phoneNumberError = true;
      } else {
        this.phoneNumberError = false;
      }
    },
    password(newValue, oldValue) {
      if (!newValue || !Util.validatePassword(newValue)) {
        this.passwordError = true;
      } else {
        this.passwordError = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.login {
  .login-header {
    h1 {
      font-size: 28px;
    }
  }
  .login-content {
    margin-top: 50px;
  }
}
</style>