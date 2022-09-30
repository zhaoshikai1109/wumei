<template>
  <div class="register">
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
                <el-button type="danger">查看文档</el-button>
                <el-button @click="toggle"> 账号登录 </el-button>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="24" :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
          <div class="registerRight">
            <el-form :model="ruleForm" :rules="rules" ref="formIns">
              <h3 class="title">账号注册</h3>
              <el-form-item prop="userName">
                <el-input
                  v-model.trim="ruleForm.userName"
                  placeholder="账号"
                  prefix-icon="el-icon-user-solid"
                ></el-input>
              </el-form-item>
              <el-form-item prop="phone">
                <el-input
                  v-model.trim="ruleForm.phone"
                  placeholder="手机号码"
                  prefix-icon="el-icon-mobile"
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

              <el-form-item prop="confirmPassword">
                <el-input
                  show-password
                  v-model.trim="ruleForm.confirmPassword"
                  placeholder="确认密码"
                  prefix-icon="el-icon-lock"
                ></el-input>
              </el-form-item>

              <el-form-item class="verifyForm" prop="captchaImageResult">
                <el-input
                  class="verifyInput"
                  v-model="ruleForm.captchaImageResult"
                  placeholder="验证码"
                  prefix-icon="el-icon-key"
                ></el-input>
                <img
                  class="verifyImg"
                  v-if="codeImg"
                  @click="createImgUrl"
                  :src="codeImg"
                  alt=""
                />
              </el-form-item>

              <el-form-item>
                <el-button
                  type="primary"
                  @click="submit"
                  :loading="confirmLoading"
                  >注册</el-button
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
import { effectScope } from "vue";
import _ from "vuex";
export default {
  name: "Register",
  data() {
    const validateUserName = (_, value, callback) => {
      if (!value) {
        callback(new Error("账号不能为空"));
        return;
      }
      let reg1 = /^[a-zA-Z0-9_-]{4,16}$/;
      if (!reg1.test(value)) {
        callback(new Error("账号格式错误~"));
        return;
      }
      callback();
    };
    const validatePhone = (_, value, callback) => {
      if (!value) {
        callback(new Error("手机号不能为空~"));
        return;
      }
      let reg2 = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;
      if (!reg2.test(value)) {
        callback(new Error("手机号格式错误~"));
        return;
      }
      callback();
    };
    const validatePassword = (_, value, callback) => {
      if (!value) {
        callback(new Error("密码不能为空~"));
        return;
      }
      let reg3 = /^[a-zA-Z0-9]{6,16}$/;
      if (!reg3.test(value)) {
        callback(new Error("密码格式错误"));
        return;
      }
      callback();
    };
    const validateResPassword = (_, value, callback) => {
      if (!value) {
        callback(new Error("确认密码不能为空~"));
        return;
      }
      // if (value !== this.passWord) {
      //   callback(new Error("两次密码输入不一致~"));
      //   return;
      // }
      callback();
    };
    return {
      ruleForm: {
        userName: "",
        passWord: "",
        confirmPassword: "",
        phone: "",
        captchaImageResult: "",
      },
      rules: {
        userName: [{ validator: validateUserName, trigger: "blur" }],
        phone: [{ validator: validatePhone, trigger: "blur" }],
        passWord: [{ validator: validatePassword, trigger: "blur" }],
        confirmPassword: [{ validator: validateResPassword, trigger: "blur" }],
        captchaImageResult: [
          { required: true, message: "请填写验证码", trigger: "blur" },
        ],
      },
      codeImg: "",
      uuid: "",
      confirmLoading: false,
    };
  },
  mounted() {
    this.createImgUrl();
  },
  methods: {
    toggle() {
      this.$router.replace("/login");
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
        this.confirmLoading = true;
        await this.$refs.formIns.validate();
        let { code, msg } = await this.$api.register(
          this.ruleForm.captchaImageResult,
          this.ruleForm.userName,
          this.ruleForm.phone,
          this.ruleForm.passWord,
          this.ruleForm.confirmPassword,
          this.uuid
        );
        if (+code === 200) {
          this.$message.success("注册成功~");
          this.$router.replace("/login");
        } else {
          this.$message.error(msg);
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
.register {
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

.registerRight {
  width: 370px;
  height: 365px;
  .el-form {
    box-shadow: 0 20px 20px 0 rgb(0 0 0 / 10%);
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
    /deep/ .el-input__inner {
      height: 38px;
      background-color: rgba(0, 0, 0, 0.1);
      color: #333;
      line-height: 38px;
    }
    /deep/ .el-input__icon {
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
