<template>
  <div class="dreawer_box">
    <el-dialog :title="title" :visible.sync="dialog" :before-close="handleClose" :width="width">
      <div class="form-box">
        <!-- 表单的控件直接通过 slot 插入 form-box 可以给表单添加样式-->
        <slot name="form"></slot>
      </div>
      <div slot="footer" class="dialog-footer">
        <!-- 
        直接复制到 引用组件中
        <el-button slot="submit" type="primary" @click="submitForm">确 定</el-button>
       -->
        <!-- 用于自定义的按钮功能 一般是 确认 / 提交 按钮 -->
        <slot name="submit"></slot>
        <!-- 取消按钮是固定的  关闭页面 -->
        <el-button @click="handleClose">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '标题',
    },
    valueLabel: {
      type: String,
      default: null,
    },
    width: {
      type: String || Number,
      default: '30%',
    },
  },
  data() {
    return {
      direction: 'rtl',
      dialog: false,
    }
  },
  mounted() {
    // this.getlist();
  },
  methods: {
    handleClose(done) {
      this.dialog = false
    },
    close() {
      this.dialog = false
    },
  },
}
</script>
<style scoped lang="scss">
.form-box {
  width: 70%;
  margin: 0 auto;
}
</style>