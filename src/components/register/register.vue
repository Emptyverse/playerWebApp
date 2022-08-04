<template>
  <div class="popup-wrapper">
    <Scroll class="register-wrapper" ref="registerWrapper">
      <div class="register">
        <div class="register-header">
          <h1>New Account</h1>
        </div>
        <div class="register-content">
          <div class="field-item">
            <label>Phone</label>
            <div class="item-content" :class="{ error: registerForm.phoneNumber.error }">
              <i class="iconfont icon-9kaobei"></i>
              <input type="text" placeholder="输入手机号码" v-model="registerForm.phoneNumber.value" />
            </div>
            <div class="error-message" v-show="registerForm.phoneNumber.error">手机号码格式不正确</div>
          </div>
          <div class="field-item">
            <label>Nickname</label>
            <div class="item-content" :class="{ error: registerForm.nickname.error }">
              <i class="iconfont icon-username"></i>
              <input placeholder="输入昵称" v-model="registerForm.nickname.value" />
            </div>
            <div
              class="error-message"
              v-show="registerForm.nickname.error"
            >昵称为4-30个字,且不包含除-和_以外的特殊字符</div>
          </div>
          <div class="field-item">
            <label>Password</label>
            <div class="item-content" :class="{ error: registerForm.password.error }">
              <i class="iconfont icon-key"></i>
              <input type="password" placeholder="输入密码" v-model="registerForm.password.value" />
            </div>
            <div class="error-message" v-show="registerForm.password.error">密码为8-20位, 含有数字、字母、符号 至少两种且不能含有空格</div>
          </div>
          <div class="field-item">
            <label>Verification code</label>
            <div class="item-content" :class="{ error: registerForm.code.error }">
              <i class="iconfont icon-mima"></i>
              <input type="text" placeholder="输入验证码" v-model="registerForm.code.value" />
              <span
                class="sent-captcha"
                type="text"
                v-show="showSentCaptcha"
                @click="sentCaptcha"
              >获取验证码</span>
              <span v-show="!showSentCaptcha" class="resentTime">{{ resentTime }} s</span>
            </div>
            <div class="error-message" v-show="registerForm.code.error">验证码需为4位数字</div>
          </div>
          <button class="normal-btn bg-orange" @click="registerUser">Sign up</button>
        </div>
      </div>
    </Scroll>
  </div>
</template>

<script>
import Scroll from "base/scroll/scroll";
import { captchaSent, captchaVerify } from "api/user/register";
import { ERR_OK } from "api/config";
import * as Util from "common/js/util/validate";
const TIME_COUNT = 60;

export default {
  data() {
    return {
      registerForm: {
        phoneNumber: {
          value: "",
          error: false
        },
        nickname: {
          value: "",
          error: false
        },
        password: {
          value: "",
          error: false
        },
        code: {
          value: "",
          error: false
        }
      },
      isError: false,
      resentTime: 0,
      showSentCaptcha: true
    };
  },
  methods: {
    // 发送手机验证码
    sentCaptcha() {
      // 防抖
      if (!this.timer) {
        this.resentTime = TIME_COUNT;
        // 验证手机号码格式
        if (!Util.isPhoneNumber(this.registerForm.phoneNumber.value)) {
          this.$message({
            type: "error",
            message: "手机格式不正确"
          });
          return false;
        }
        // 发送验证码 成功之后 倒计时60s后可重新发送
        captchaSent(this.registerForm.phoneNumber.value)
          .then(res => {
            if (res.data.code === ERR_OK) {
              this.$message({
                type: "success",
                message: "验证码发送成功!"
              });
              this.showSentCaptcha = false;
              this.timer = setInterval(() => {
                if (this.resentTime > 0 && this.resentTime <= TIME_COUNT) {
                  this.resentTime--;
                } else {
                  this.showSentCaptcha = true;
                  clearInterval(this.timer);
                  this.timer = null;
                }
              }, 1000);
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    // 验证表单和验证码
    validateForm() {
      for (let key in this.registerForm) {
        let val = this.registerForm[key].value;
        switch (key) {
          case "phoneNumber":
            if (!val || !Util.isPhoneNumber(val)) {
              this.registerForm[key].error = true;
            } else {
              this.registerForm[key].error = false;
            }
            break;
          case "nickname":
            if (!val || !Util.validateNickName(val)) {
              this.registerForm[key].error = true;
            } else {
              this.registerForm[key].error = false;
            }
            break;
          case "password":
            if (!val || !Util.validatePassword(val)) {
              this.registerForm[key].error = true;
            } else {
              this.registerForm[key].error = false;
            }
            break;
          case "code":
            if (!val || !Util.validateVerificationCode(val)) {
              this.registerForm[key].error = true;
            } else {
              this.registerForm[key].error = false;
            }
            break;
        }
      }
      this.refresh();
    },
    // 提交表单
    registerUser() {
      let registerForm = this.registerForm;
      this.validateForm();
      if (
        registerForm.phoneNumber.error ||
        registerForm.nickname.error ||
        registerForm.password.error ||
        registerForm.code.error
      ) {
        this.$message({
          message: "信息填写不正确",
          type: "error"
        });
        return false;
      }
      // 验证验证码
      captchaVerify(
        this.registerForm.phoneNumber.value,
        this.registerForm.code.value
      )
        .then(res => {
          if (res.data.code === ERR_OK) {
            this.$message({
              message: "注册成功",
              type: "success"
            });
          }
        })
        .catch(error => {
          console.log(error);
          this.$message({
            message: "验证码错误",
            type: "error"
          });
        });
    },
    // 刷新scroll组件
    refresh() {
      setTimeout(() => {
        this.$refs.registerWrapper.refresh();
      }, 20);
    }
  },
  watch: {
    "registerForm.phoneNumber.value"(newValue, oldValue) {
      if (!newValue || !Util.isPhoneNumber(newValue)) {
        this.registerForm.phoneNumber.error = true;
      } else {
        this.registerForm.phoneNumber.error = false;
      }
      this.refresh();
    },
    "registerForm.nickname.value"(newValue, oldValue) {
      if (!newValue || !Util.validateNickName(newValue)) {
        this.registerForm.nickname.error = true;
      } else {
        this.registerForm.nickname.error = false;
      }
      this.refresh();
    },
    "registerForm.password.value"(newValue, oldValue) {
      if (!newValue || !Util.validatePassword(newValue)) {
        this.registerForm.password.error = true;
      } else {
        this.registerForm.password.error = false;
      }
      this.refresh();
    },
    "registerForm.code.value"(newValue, oldValue) {
      if (!newValue || !Util.validateVerificationCode(newValue)) {
        this.registerForm.code.error = true;
      } else {
        this.registerForm.code.error = false;
      }
      this.refresh();
    }
  },
  components: {
    Scroll
  }
};
</script>

<style lang="scss" scoped>
@import "common/style/variable.scss";
.register-wrapper {
  height: 100%;
  position: relative;
  overflow: hidden;
  .register {
    .register-header {
      h1 {
        font-size: 28px;
      }
    }
    .register-content {
      margin-top: 50px;
      padding-bottom: 40px;

      .sent-captcha {
        font-size: 14px;
        color: $color-orange-l;
      }
      .resentTime {
        font-size: 14px;
        color: #8590a6;
      }
    }
  }
  .scroll-item {
    height: 50px;
    line-height: 50px;
    font-size: 24px;
    font-weight: bold;
    border-bottom: 1px solid #eee;
    text-align: center;
    &:nth-child(2n) {
      background-color: #f3f5f7;
    }
    &:nth-child(2n + 1) {
      background-color: #42b983;
    }
  }
}

.popup-wrapper {
  top: 110px;
}
</style>