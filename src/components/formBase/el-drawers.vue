<template>
  <div class="dreawer_box">
    <el-drawer
      :title="title"
      :visible.sync="drawer"
      :before-close="handleClose"
      :wrapperClosable="true"
      :size="650"
    >
      <div class="form-box">
        <!-- 表单的控件直接通过 slot 插入 form-box 可以给表单添加样式-->
        <slot name="form"></slot>
      </div>

      <div class="dialog-footer">
        <!-- 
        直接复制到 引用组件中
        <el-button slot="submit" type="primary" @click="submitForm">确 定</el-button>
       -->
        <!-- 用于自定义的按钮功能 一般是 确认 / 提交 按钮 -->
        <slot name="submit"></slot>
        <!-- 取消按钮是固定的  关闭页面 -->
        <el-button @click="handleClose">取 消</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "标题",
    },
    valueLabel: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      direction: "rtl",
      drawer: false,
    };
  },
  mounted() {
    // this.getlist();
  },
  methods: {
    handleClose(done) {
      this.drawer = false;
    },
    close() {
      this.drawer = false;
    },
  },
};
</script>
<style scoped lang="scss">
.dreawer_box {
  .form-box {
    padding: 0 20px;
    margin-bottom: 50px;
  }
  .dialog-footer {
    position: fixed;
    padding: 10px 20px;
    bottom: 0;
    width: 100%;
    border-top: 1px solid #dfe6ec;
    background: #fff;
  }
  ::v-deep .el-drawer__header {
    margin-bottom: 10px;
    padding: 20px;
    border-bottom: 1px solid #dfe6ec;
  }
}
</style>