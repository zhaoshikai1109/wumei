<template>
  <div class="login">
    <div class="main">
      <el-row>
        <el-col :span="24" :xs="24" :sm="24" :md="14" :lg="14" :xl="14">
          <div class="loginLeft">
            <h1>
              <a href="https://wumei.live/" target="_blank">物美智能 </a> -
              <a href="https://wumei.live/" target="_blank">物联美好生活</a>
            </h1>
            <h2>
              <a href="https://wumei.live/">wumei smart</a> open source living
              iot platform
            </h2>
            <div class="loginMain">
              <div class="loginType">
                <span>登录方式</span>
                <el-button type="success" size="mini" disabled>微信</el-button>
                <el-button type="danger" size="mini" disabled>QQ</el-button>
                <el-button type="primary" size="mini" disabled
                  >支付宝</el-button
                >
              </div>
              <div class="loginOfficial">
                <el-button type="warning">返回官网</el-button>
                <el-button type="success">查看文档</el-button>
                <el-button @click="toggle"> 账号注册 </el-button>
              </div>
              <div class="loginAccount">
                <div class="loginAccountLeft">
                  <p>账号</p>
                  <p>演示</p>
                </div>
                <div class="loginAccountRight">
                  <div class="userFirst">
                    <p>受限管理</p>
                    <p>租户账号</p>
                    <p>普通用户</p>
                  </div>
                  <div class="userSecond">
                    <p>wumei</p>
                    <p>wumei-t1</p>
                    <p>wumei-u1</p>
                  </div>
                  <div class="userThird">
                    <p>123456</p>
                    <p>123456</p>
                    <p>123456</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="24" :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
          <div class="loginRight">
            <el-form :model="ruleForm" :rules="rules" ref="formIns">
              <h3 class="title">账号登录</h3>
              <el-form-item prop="userName">
                <el-input
                  v-model.trim="ruleForm.userName"
                  placeholder="账号"
                  prefix-icon="el-icon-user-solid"
                  autofocus
                ></el-input>
              </el-form-item>
              <el-form-item prop="passWord">
                <el-input
                  show-password
                  v-model.trim="ruleForm.passWord"
                  placeholder="密码"
                  prefix-icon="el-icon-lock"
                ></el-input>
              </el-form-item>
              <el-form-item class="verifyForm" prop="captchaImageResult">
                <el-input
                  class="verifyInput"
                  v-model="ruleForm.captchaImageResult"
                  placeholder="验证码"
                  prefix-icon="el-icon-key"
                  @keydown.enter.native="submit"
                ></el-input
                ><img
                  class="verifyImg"
                  v-if="codeImg"
                  @click="createImgUrl"
                  :src="codeImg"
                  alt=""
                />
              </el-form-item>
              <el-form-item>
                <el-checkbox v-model="remember" label="记住密码"></el-checkbox>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  :loading="confirmLoading"
                  @click="submit"
                  >登录</el-button
                >
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="footer">
      <span>
        Copyright © 2018-2021
        <a href="https://wumei.live/">wumei smart</a>
        All Rights Reserved.
      </span>
    </div>
  </div>
</template>

<script>
import _ from "../assets/utils";
let seat = "######";
export default {
  name: "Login",
  data() {
    //账号校验规则
    const validateUsername = (_, value, callback) => {
      if (!value) {
        callback(new Error("账号不能为空~"));
        return;
      }
      let reg1 = /^[a-zA-Z0-9_-]{4,16}$/;
      if (!reg1.test(value)) {
        callback(new Error("账号格式错误~"));
        return;
      }
      callback();
    };
    // 密码校验规则
    const validatePassword = (_, value, callback) => {
      if (!value) {
        callback(new Error("密码不能为空~"));
        return;
      }
      let reg2 = /^[a-zA-Z0-9]{6,16}$/;
      if (!reg2.test(value) && value !== seat) {
        callback(new Error("密码格式错误"));
        return;
      }
      callback();
    };
    return {
      ruleForm: {
        userName: "",
        passWord: "",
        captchaImageResult: "",
      },
      rules: {
        userName: [{ validator: validateUsername, trigger: "blur" }],
        passWord: [{ validator: validatePassword, trigger: "blur" }],
        captchaImageResult: [
          { required: true, message: "请填写验证码", trigger: "blur" },
        ],
      },
      codeImg: "",
      uuid: "",
      remember: true,
      confirmLoading: false,
    };
  },
  created() {
    this.createImgUrl();
    // 把记住的账号密码放到文本框
    let remember = _.storage.get("remember");
    if (!remember) return;
    this.ruleForm.userName = remember.userName;
    this.ruleForm.passWord = seat;
    this.rempassWord = remember.passWord;
  },

  methods: {
    toggle() {
      this.$router.replace("/register");
    },
    async createImgUrl() {
      try {
        let { code, img, uuid } = await this.$api.captchaImage();
        if (+code === 200) {
          this.codeImg = "data:image/gif;base64," + img;
          this.uuid = uuid;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async submit() {
      try {
        await this.$refs.formIns.validate();
        this.confirmLoading = true;
        if (this.ruleForm.passWord === seat) {
          this.ruleForm.passWord = this.rempassWord;
        }
        // this.$message.success("校验通过")
        let { code, msg, token } = await this.$api.login(
          this.ruleForm.captchaImageResult,
          this.ruleForm.passWord,
          this.ruleForm.userName,
          this.uuid
        );
        if (+code === 200) {
          //登录成功  存储Token、获取登录者信息(存储到vuex中)、记住账号和密码、提示&&跳转
          _.storage.set("token", token);
          await this.$store.dispatch("setProfileAsync");
          if (this.remember) {
            _.storage.set("remember", {
              userName: this.ruleForm.userName,
              passWord: this.ruleForm.passWord,
            });
          } else {
            _.storage.remove("remember");
          }
          this.$message.success("登陆成功~");
          let { to } = this.$route.query;
          to ? this.$router.replace(to) : this.$router.push("/home");
        } else {
          this.$message.error(msg);
          this.createImgUrl()
        }
      } catch (error) {
        console.log(error);
      }
      this.confirmLoading = false;
    },
  },
};
</script>

<style lang="less" scoped>
.login {
  background: linear-gradient(303deg, #48c6ef 10%, #6f86d6 80%);
  height: 100%;
  overflow: auto;
  padding-top: 150px;
  box-sizing: border-box;
  .el-row {
    padding: 20px;
  }
}
.loginLeft {
  text-align: center;
  color: #fff;
  h1 {
    font-size: 46px;
    margin: 24px 0;
    font-weight: 500;
  }
  h2 {
    font-size: 26px;
    margin-top: -25px;
    font-weight: 500;
  }
  a {
    color: #fff;
  }
}

.loginMain {
  max-width: 330px;
  text-align: left;
  margin: 0 auto;
  .loginType {
    padding: 25px 0;
    vertical-align: middle;
    span {
      margin-right: 10px;
      font-size: 16px;
    }
    .el-button {
      border: 1px solid #fff;
    }
    .el-button--mini {
      padding: 7px 10px;
    }
  }
}

.loginAccount {
  line-height: 20px;
  border: 1px solid #fff;
  color: rgb(238, 238, 238);
  margin-top: 30px;
  width: 316px;
  display: flex;
  justify-content: space-between;
  .loginAccountLeft {
    width: 60px;
    font-weight: bold;
    color: rgb(255, 255, 255);
    line-height: 28px;
    background-color: rgb(245, 108, 108);
    text-align: center;
    font-size: 18px;
    padding: 20px 0;
  }
  .loginAccountRight {
    display: flex;
    font-size: 16px;
    justify-content: space-between;
    width: 230px;
    padding: 0 20px;
    p {
      margin-top: 10px;
    }
  }
}

.loginRight {
  width: 370px;
  height: 365px;
  .el-form {
    box-shadow: 0 20px 30px 0 rgb(0 0 0 / 10%);
    border-radius: 10px;
    background-color: #d9ebf6;
    border: 1px solid #fff;
    padding: 25px 25px 5px 25px;
    margin: 0 auto;
    z-index: 1000;
    max-width: 370px;
    margin-bottom: 100px;
    .title {
      text-align: center;
      color: #333;
      margin: 0 auto 20px auto;
      font-size: 28px;
    }
    .el-form-item {
      margin-bottom: 22px;
    }
    /deep/.el-input__inner {
      height: 38px;
      background-color: rgba(0, 0, 0, 0.1);
      color: #333;
      line-height: 38px;
    }
    /deep/.el-input__icon {
      color: #fff;
      height: 39px;
      width: 14px;
    }
    .el-input {
      width: 100%;
    }
    .el-input ::placeholder {
      color: #666;
    }

    .verifyForm {
      display: flex;
      justify-content: space-between;
      align-content: center;
      vertical-align: middle;
    }
    .verifyInput {
      width: 65%;
    }
    .verifyImg {
      display: inline-block;
      width: 33%;
      height: 38px;
      background: #333;
      cursor: pointer;
      vertical-align: middle;
      margin-left: 5px;
    }
    .el-button {
      width: 100%;
    }
  }
}

.footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-size: 12px;
}
</style>
