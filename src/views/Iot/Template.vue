<template>
  <div class="tem-plate">
    <div class="search">
      <el-form :inline="true" :model="type" class="demo-form-inline">
        <el-form-item label="名称" size="mini">
          <el-input
            v-model="templateName.value"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="类别" size="mini">
          <el-select
            v-model="type.value"
            placeholder="请选择"
            style="width: 100px"
          >
            <el-option
              v-for="item in type.data"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item size="mini" class="buttonBox">
          <el-button type="primary" @click="search"
            ><i class="el-icon-plus"></i>查询</el-button
          >
          <el-button type="primary" @click="reset"
            ><i class="el-icon-plus"></i>重置</el-button
          >
        </el-form-item>
        <el-form-item class="addButton" size="mini">
          <el-button
            plain
            class="addMenu"
            @click="dialogVisible = true"
            size="mini"
            ><i class="el-icon-plus"></i>新增</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格区 -->
    <div class="table">
      <el-table
        :data="tableData"
        border
        stripe
        align="center"
        v-loading="tableLoading"
      >
        <el-table-column
          prop="templateName"
          label="名称"
          align="center"
          min-width="10%"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="identifier"
          label="标识符"
          min-width="10%"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="isTop"
          label="首页显示"
          align="center"
          min-width="10%"
        >
          <template slot-scope="scope">
            <div>{{ scope.row.isTop === 1 ? "是" : "否" }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="isMonitor"
          label="监测值"
          align="center"
          min-width="10%"
        >
          <template slot-scope="scope">
            <div>{{ scope.row.isMonitor === 1 ? "是" : "否" }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="isSys"
          label="系统定义"
          align="center"
          min-width="10%"
        >
          <template slot-scope="scope">
            <div>{{ scope.row.isSys === 1 ? "是" : "否" }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          label="物模型类别"
          align="center"
          min-width="10%"
          class-name="typeBox"
        >
          <template slot-scope="scope">
            <div>
              <el-tag type="success" v-if="scope.row.type === 2">{{
                scope.row.type === 1
                  ? "属性"
                  : scope.row.type === 2
                  ? "功能"
                  : "事件"
              }}</el-tag>
              <el-tag type="warning" v-if="scope.row.type === 3">{{
                scope.row.type === 1
                  ? "属性"
                  : scope.row.type === 2
                  ? "功能"
                  : "事件"
              }}</el-tag>
              <el-tag v-if="scope.row.type === 1">{{
                scope.row.type === 1
                  ? "属性"
                  : scope.row.type === 2
                  ? "功能"
                  : "事件"
              }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="datatype"
          label="数据类型"
          align="center"
          min-width="10%"
          :formatter="formatterRow"
        >
        </el-table-column>
        <el-table-column
          prop="specs"
          label="数据定义"
          min-width="15%"
          align="left"
          header-align="center"
          class-name="specsColor"
          v-slot="{ row }"
        >
          <div v-html="row.specs"></div>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          align="center"
          min-width="15%"
          :formatter="formatterTime"
        >
        </el-table-column>

        <el-table-column
          label="操作"
          min-width="10%"
          align="center"
          v-slot="{ row }"
        >
          <el-button
            type="primary"
            size="mini"
            @click="triggerUpdate(row)"
            icon="el-icon-edit"
            >修改</el-button
          >
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <el-pagination
      style="float: right"
      :total="pagination.totalCount"
      size="mini"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page-size.sync="pagination.pageSize"
      :current-page.sync="pagination.pageNum"
      @current-change="search"
      @size-change="search"
    ></el-pagination>
    <!-- 弹框 -->
    <el-dialog
      title="添加通用物模型"
      :visible.sync="dialogVisible"
      :before-close="closeDialog"
    >
      <el-form :model="ruleForm" center :rules="rules" ref="formIns">
        <el-form-item
          label="模型名称"
          :label-width="labelWidth"
          prop="templateName"
        >
          <el-input
            type="text"
            placeholder="请输入模型名称"
            class="length"
            v-model="ruleForm.templateName"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="标识符"
          :label-width="labelWidth"
          prop="identifier"
        >
          <el-input
            v-model="ruleForm.identifier"
            placeholder="请输入识别符，例如：temperatrue"
            class="length"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="模型类型" :label-width="labelWidth" prop="type">
          <el-radio-group v-model="ruleForm.type">
            <el-radio-button label="1">属性</el-radio-button>
            <el-radio-button label="2">功能</el-radio-button>
            <el-radio-button label="3">事件</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-show="ruleForm.type == 1 || ruleForm.type == 2"
          label="首页显示"
          :label-width="labelWidth"
          prop="isTop"
        >
          <el-switch v-model="ruleForm.isTop" active-color="#13ce66">
          </el-switch>
        </el-form-item>
        <el-form-item
          v-show="ruleForm.type == 1"
          label="实时监测"
          :label-width="labelWidth"
          prop="isMonitor"
        >
          <el-switch v-model="ruleForm.isMonitor" active-color="#13ce66">
          </el-switch>
        </el-form-item>
        <el-form-item
          label="数据类型"
          :label-width="labelWidth"
          prop="datatype"
        >
          <el-select
            v-model="ruleForm.datatype"
            placeholder="整数"
            style="width: 175px"
          >
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="item in selections"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="取值范围"
          :label-width="labelWidth"
          v-show="ruleForm.datatype == 1 || ruleForm.datatype == 2"
        >
          <div class="range length">
            <el-input v-model="ruleForm.min" placeholder="最小值"></el-input>
            <span style="margin: 0 10px">至</span>
            <el-input v-model="ruleForm.max" placeholder="最大值"></el-input>
          </div>
        </el-form-item>
        <el-form-item
          label="单位"
          :label-width="labelWidth"
          prop="unit"
          v-show="ruleForm.datatype == 1 || ruleForm.datatype == 2"
        >
          <el-input
            v-model="ruleForm.unit"
            placeholder="请输入单位，例如：℃"
            class="length"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="步长"
          :label-width="labelWidth"
          prop="step"
          v-show="ruleForm.datatype == 1 || ruleForm.datatype == 2"
        >
          <el-input
            v-model="ruleForm.step"
            placeholder="请输入步长，例如：1"
            class="length"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="布尔值："
          :label-width="labelWidth"
          v-show="ruleForm.datatype == 3"
        >
          <el-input
            v-model="ruleForm.trueText"
            placeholder="例如：关闭"
          ></el-input>
          <span style="margin: 0 10px">(0值对应文本)</span>
          <el-input
            v-model="ruleForm.falseText"
            placeholder="例如：打开"
          ></el-input>
          <span style="margin: 0 10px">(1值对应文本)</span>
        </el-form-item>
        <el-form-item
          label="枚举项"
          :label-width="labelWidth"
          v-show="ruleForm.datatype == 4"
        >
          <div
            v-for="(item, index) in ruleForm.enumList"
            :key="index"
            style="display: flex; margin: 0 0 10px"
          >
            <el-input
              style="width: 150px"
              v-model="item.value"
              placeholder="例如：关闭"
            ></el-input>
            <el-input
              style="width: 150px; margin: 0 10px"
              v-model="item.text"
              placeholder="例如：打开"
            ></el-input>
            <el-link
              class="del"
              type="danger"
              v-show="index > 0"
              @click="deleteEnum(index)"
              >删除</el-link
            >
          </div>
          <el-link icon="el-icon-plus" @click="addEnum">添加枚举项</el-link>
        </el-form-item>
        <el-form-item
          label="字符串"
          :label-width="labelWidth"
          v-show="ruleForm.datatype == 5"
          prop="maxLength"
        >
          <el-input
            type="number"
            v-model="ruleForm.maxLength"
            placeholder="例如：1024"
          ></el-input>
          <span>(字符串的最大长度)</span>
        </el-form-item>
        <el-form-item
          label="数组类型"
          :label-width="labelWidth"
          v-show="ruleForm.datatype == 6"
          prop="arrayType"
        >
          <el-radio-group v-model="ruleForm.arrayType">
            <el-radio label="int">int(整数)</el-radio>
            <el-radio label="double">double(双数)</el-radio>
            <el-radio label="string">string(字符串)</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import _ from "../../assets/utils";
export default {
  name: "tem-plate",
  data() {
    return {
      templateName: {
        value: "",
      },
      type: {
        value: "",
        data: [
          {
            label: "属性",
            value: "1",
          },
          { label: "功能", value: "2" },
          {
            label: "事件",
            value: "3",
          },
        ],
      },

      //表格数据
      tableData: [],
      tableLoading: false,
      pagination: {
        totalCount: 0,
        pageSize: 10,
        pageNum: 1,
      },
      //表单
      ruleForm: {
        createBy: "wumei",
        datatype: "1",
        identifier: "",
        isMonitor: 0,
        isSys: 1,
        isTop: 1,
        min: "",
        max: "",
        unit: "",
        step: "",
        trueText: "",
        falseText: "",
        enumList: [{ value: "", text: "" }],
        templateId: undefined,
        templateName: "",
        type: 1,
        maxLength: "",
        arrayType: "",
      },
      dialogVisible: false,
      labelWidth: "100px",
      // 表单校验
      rules: {
        templateName: [
          {
            required: true,
            message: "物模型名称不能为空",
            trigger: "blur",
          },
        ],
        identifier: [
          {
            required: true,
            message: "标识符，产品下唯一不能为空",
            trigger: "blur",
          },
        ],
        type: [
          {
            required: true,
            message: "模型类别不能为空",
            trigger: "change",
          },
        ],
        datatype: [
          {
            required: true,
            message: "数据类型不能为空",
            trigger: "change",
          },
        ],
        specs: [
          {
            required: true,
            message: "数据定义不能为空",
            trigger: "blur",
          },
        ],
      },
      selections: [
        {
          label: "整数",
          value: "1",
          type: "integer",
        },
        {
          label: "小数",
          value: "2",
          type: "decimal",
        },
        {
          label: "布尔",
          value: "3",
          type: "bool",
        },
        {
          label: "枚举",
          value: "4",
          type: "enum",
        },
        {
          label: "字符串",
          value: "5",
          type: "string",
        },
        {
          label: "数组",
          value: "6",
          type: "array",
        },
      ],
    };
  },
  created() {
    this.init();
  },
  methods: {
    //重置
    reset() {
      this.templateName.value=""
      this.type.value=""
      this.init();
    },
    //搜索
    search() {
      let obj = {};
      obj.templateName = this.templateName.value;
      obj.type = this.type.value;
      this.init(obj);
    },
    async init(obj = {}) {
      //获取数据
      this.tableLoading = true;
      let { pageNum, pageSize } = this.pagination;
      try {
        let { code, rows, total } =
          await this.$api.template.handlerTemplateSearch({
            pageNum,
            pageSize,
            ...obj,
          });
        if (+code == 200) {
          rows.map((item) => {
            const specs = JSON.parse(item.specs);

            if (specs.type === "integer" || specs.type === "decimal") {
              item.specs = `最大值：<span>${specs.max}</span> 最小值:<span>${specs.min}</span> 步长:<span>${specs.step}</span> 单位:<span>${specs.unit}</span>`;
            }
            if (specs.type === "array") {
              item.specs = `数组类型:<span>${specs.arrayType}</span>`;
            }
            if (specs.type === "bool") {
              item.specs = `0:<span>${specs.trueText}</span> 1:<span>${specs.falseText}</span>`;
            }
            if (specs.type === "enum" && specs.enumList.length) {
              let str = ``;
              specs.enumList.map((item) => {
                str += `${item.value}:<span>${item.text}</span>`;
              });
              item.specs = str;
            }
            if (specs.type === "string") {
              item.specs = `最大长度:<span>${specs.maxLength}</span>`;
            }
          });
          this.tableData = rows;
          this.pagination.totalCount = total;
          this.tableLoading = false;
          return;
        }
        this.$message.error("网络繁忙，请稍后再试");
        return;
      } catch (error) {
        console.log();
      }
    },

    //格式化日期
    formatterTime(row) {
      let createTime = row.createTime;
      return _.formatTime(createTime, "{0}-{1}-{2}");
    },
    formatterRow(row) {
      let { datatype } = row;
      const findResult = this.selections.find((item) => {
        return item.type == datatype;
      });
      return (datatype = findResult.label);
    },
    closeDialog() {
      this.dialogVisible = false;
      this.$refs.formIns.resetFields();
      this.ruleForm.templateId = 0;
    },
    //新增修改
    async submit() {
      try {
        await this.$refs.formIns.validate();
        let {
          createBy,
          datatype,
          identifier,
          isMonitor,
          isSys,
          isTop,
          min,
          max,
          unit,
          step,
          trueText,
          falseText,
          maxLength,
          arrayType,
          templateId,
          templateName,
          type,
          enumList,
        } = this.ruleForm;
        datatype =
          this.selections.find((item) => {
            return item.value == datatype;
          })?.type || "";
        let specs;
        if (datatype == "integer" || datatype == "decimal") {
          specs = JSON.stringify({
            type: datatype,
            min,
            max,
            unit,
            step,
          });
        }
        if (datatype == "bool") {
          specs = JSON.stringify({
            type: datatype,
            trueText,
            falseText,
          });
        }
        if (datatype == "enum") {
          specs = JSON.stringify({
            type: datatype,
            enumList,
          });
        }
        if (datatype == "string") {
          specs = JSON.stringify({
            type: datatype,
            maxLength,
          });
        }
        if (datatype == "array") {
          specs = JSON.stringify({
            type: datatype,
            arrayType,
          });
        }
        let handler = this.$api.template.insertTemplate,
          data = {
            datatype,
            identifier,
            isMonitor: isMonitor ? 1 : 0,
            isSys,
            isTop: isTop ? 1 : 0,
            specs,
            templateName,
            type,
            createBy,
          };
        if (!templateId == 0) {
          handler = this.$api.template.updateTemplate;
          data.templateId = templateId;
        }
        let { code } = await handler(data);
        if (+code === 200) {
          this.$message.success("当前操作成功~");
          if (!templateId == 0) {
            this.search();
          } else {
            this.reset();
          }
          this.closeDialog();
          return;
        }
        this.$message.error("当前操作失败，请稍后再试~");
      } catch (error) {
        console.log(error);
      }
    },
    async triggerUpdate(row) {
      let { templateId } = row;

      try {
        let { data, code } = await this.$api.template.queryTemplateInfo(
          templateId
        );
        if (+code === 200) {
          this.dialogVisible = true;
          const specs = JSON.parse(data.specs);
          delete specs.type;
          const obj = {
            ...data,
            ...specs,
            datatype:
              this.selections.find((item) => {
                return item.type == data.datatype;
              })?.value || "",
          };
          for (const key in this.ruleForm) {
            if (key === "isTop" || key === "isMonitor") {
              this.ruleForm[key] = !!obj[key];
            } else {
              this.ruleForm[key] = obj[key];
            }
          }
          return;
        }
        this.$message.error("网络繁忙，请稍后再试");
        return;
      } catch (error) {
        console.log(error);
      }
    },
    addEnum() {
      this.ruleForm.enumList.push({ value: "", text: "" });
    },
    deleteEnum(index) {
      this.ruleForm.enumList.splice(index, 1);
    },
  },
};
</script>

<style lang="less" scoped>
.search {
  width: 99%;
  padding: 0 10px;
}
.demo-form-inline {
  width: 100%;
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  border: 1px solid #e6ebf5;
  background-color: #fff;
  margin: 5px 0;
  .el-form-item {
    margin-bottom: 5px;
  }
}
.buttonBox {
  flex: 1;
  i {
    margin-right: 5px;
  }
}
.addMenu {
  margin-right: 100px;
}

.tem-plate {
  margin-bottom: 100px;
  .table {
    box-sizing: border-box;
    width: 99%;
    margin-left: 10px;
    margin-top: 10px;
    border: 1px solid #e6ebf5;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    padding: 15px;
    .el-table {
      width: 100%;
      .el-table-column {
        font-size: 18px;
        text-align: center;
      }
    }
  }
  .el-pagination {
    margin-top: 20px;
  }
}

/deep/ .el-dialog {
  width: 40%;
}
/deep/ .el-form-item__label {
  font-weight: 700;
}
.length {
  width: 385px;
}
.range {
  display: flex;
}
/deep/ .specsColor span {
  color: red;
  margin-right: 5px;
}
</style>
