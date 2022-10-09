<template>
  <div class="pro-file">
    <el-row>
      <!-- 左 -->
      <el-col :span="6">
        <h3 class="title">个人信息</h3>
        <div class="vertical">
          <img
            :src="`https://iot.wumei.live/prod-api${this.avatarUrl}`"
            alt=""
            class="photo"
          />
        </div>
        <div class="listBox">
          <ul>
            <li class="listItem">
              <div><i class="el-icon-user-solid"></i>用户名称</div>
              <div>{{ tableData.userName }}</div>
            </li>
            <li class="listItem">
              <div><i class="el-icon-question"></i>用户编号</div>
              <div>{{ tableData.userId }}</div>
            </li>
            <li class="listItem">
              <div><i class="el-icon-phone"></i>手机号码</div>
              <div>{{ tableData.phonenumber }}</div>
            </li>
            <li class="listItem">
              <div><i class="el-icon-s-comment"></i>用户邮箱</div>
              <div>{{ tableData.email }}</div>
            </li>
          </ul>
        </div>
        <div class="listBox">
          <ul>
            <li class="listItem">
              <div><i class="el-icon-share"></i>所属部门</div>
              <div>{{ tableData?.dept?.deptName }}/{{ postGroup }}</div>
            </li>
            <li class="listItem">
              <div><i class="el-icon-s-check"></i>所属角色</div>
              <div>{{ roleGroup }}</div>
            </li>
            <li class="listItem">
              <div><i class="el-icon-s-claim"></i>创建日期</div>
              <div>{{ tableData.createTime }}</div>
            </li>
            <li class="listItem">
              <div><i class="el-icon-s-comment"></i>QQ</div>
              <div>
                <el-button size="mini" disabled>未绑定</el-button>
              </div>
            </li>
            <li class="listItem">
              <div><i class="el-icon-message-solid"></i>微信</div>
              <div>
                <el-button size="mini" disabled>未绑定</el-button>
              </div>
            </li>
          </ul>
        </div>
        <div></div>
      </el-col>
      <!-- 右 -->
      <el-col :span="17">
        <h3 class="title">基本资料</h3>

        <el-tabs v-model="activeName" @tab-click="handleClick" class="tabs">
          <el-tab-pane label="用户管理" name="first">
            <el-form
              :model="tableData"
              status-icon
              :rules="rules"
              ref="ruleForm"
              label-width="100px"
            >
              <el-form-item label="用户昵称" prop="nickName">
                <el-input v-model="tableData.nickName"></el-input>
              </el-form-item>
              <el-form-item label="手机号码" prop="phonenumber">
                <el-input v-model="tableData.phonenumber"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="tableData.email"></el-input>
              </el-form-item>
              <el-form-item label="性别" prop="sex">
                <el-radio-group v-model="tableData.sex">
                  <el-radio label="0">男</el-radio>
                  <el-radio label="1">女</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="mini" @click="keep"
                  >保存</el-button
                >
                <el-button type="danger" size="mini" @click="close"
                  >关闭</el-button
                >
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="配置管理" name="second">
            <el-form
              :model="Password"
              status-icon
              :rules="rulesPass"
              ref="password"
              label-width="100px"
              class="demo-ruleForm"
            >
              <el-form-item label="旧密码" prop="oldPassword">
                <el-input
                  type="password"
                  v-model="Password.oldPassword"
                  placeholder="请输入旧密码"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="新密码" prop="newPassword">
                <el-input
                  type="password"
                  v-model="Password.newPassword"
                  placeholder="请输入新密码"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="confirmPassword">
                <el-input
                  type="password"
                  v-model="Password.confirmPassword"
                  placeholder="请确认密码"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="mini" @click="keep"
                  >提交</el-button
                >
                <el-button type="danger" size="mini" @click="close"
                  >关闭</el-button
                >
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "pro-file",
  data() {
    const validateNumber = (_, value, callback) => {
      if (!value) {
        callback(new Error("手机号码不能为空"));
        return;
      }
      let reg = /^(?:(?:\+|00)86)?1\d{10}$/;
      if (!reg.test(value)) {
        callback(new Error("请输入正确的手机号码"));
        return;
      }
      callback();
    };
    var validatePass = (_, value, callback) => {
      if (this.Password.newPassword !== value) {
        callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
    };
    return {
      tableData: {},
      postGroup: "",
      roleGroup: "",
      //选项卡
      activeName: "first",
      rules: {
        nickName: [
          { required: true, message: "用户名称不能为空", trigger: "blur" },
        ],
        phonenumber: [
          { required: true, validator: validateNumber, trigger: "blur" },
        ],
        email: [{ required: true, message: "邮箱不能为空", trigger: "blur" }],
      },
      Password: {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
      rulesPass: {
        oldPassword: [
          { required: true, message: "旧密码不能为空", trigger: "blur" },
        ],
        newPassword: [
          { required: true, validator: validatePass, trigger: "blur" },
          {
            min: 6,
            max: 20,
            message: "长度在 6 到 20 个字符",
            trigger: "blur",
          },
        ],
        confirmPassword: [
          { required: true, message: "确认密码不能为空", trigger: "blur" },
          { required: true, validator: validatePass, trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    ...mapState(["avatarUrl"]),
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      try {
        let { code, data, postGroup, roleGroup } =
          await this.$api.getProfileInfo();
        if (+code == 200) {
          this.tableData = data;
          this.postGroup = postGroup;
          this.roleGroup = roleGroup;
          return;
        }
        this.$message.error("网络繁忙，请稍后再试");
        return;
      } catch (error) {
        console.log(error);
      }
    },
    //选项卡切换
    handleClick(tab, event) {
      console.log(tab, event);
    },

    //保存
    async keep() {
      try {
        this.$refs.ruleForm.validate();
        // let { nickName, phonenumber, email, sex } = this.tableData;
        // let data = {
        //   nickName,
        //   phonenumber,
        //   email,
        //   sex,
        // };
        let { code } = await this.$api.updateUserProfile(this.tableData);
        if (+code === 200) {
          this.$message.success("修改成功！");
          return;
        }
        this.$message.error("网络繁忙，请稍后再试");
        return;
      } catch (error) {
        console.log(error);
      }
    },
    //关闭
    close() {
      this.$router.push({
        path: "/home",
      });
    },
    //修改保存
    async updatePass() {
      try {
        await this.$refs.password.validate();
        let { code } = await this.$api.updatePassword(
          this.Password.oldPassword,
          this.Password.newPassword
        );
        if (+code === 200) {
          this.$message.success("修改成功!");
          return;
        }
        this.$message.error("网络繁忙，请稍后再试");
        return;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.pro-file {
  padding-bottom: 20px;
}

.el-col {
  border-radius: 4px;
  border: 1px solid #e6ebf5;
  background-color: #fff;
  overflow: hidden;
  color: #303133;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  margin-left: 10px;
}

.title {
  height: 20px;
  margin: 5px 0;
  padding-left: 30px;
  padding-bottom: 10px;
  font-weight: 400;
  font-size: 18px;
  border-bottom: 1px solid #ebeef5;
}
.vertical {
  width: 100%;
  text-align: center;
  margin: 20px 0;
}
.photo {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.listBox {
  padding: 20px;
}

.listItem {
  height: 40px;
  line-height: 40px;
  display: flex;
  justify-content: space-between;
  margin: 0 8px;
  font-size: 12px;
  font-weight: 500;
  border-bottom: 1px solid #e7eaec;
  border-top: 1px solid #e7eaec;
}
/deep/.el-tabs__header {
  padding-left: 30px;
}
</style>
