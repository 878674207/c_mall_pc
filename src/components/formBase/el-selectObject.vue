<template>
  <!-- 自定义数据下拉框组件 -->
  <el-select v-model="selvalue" clearable :placeholder="placeholder" :disabled="disabled">
    <el-option v-for="item in options" :key="item.value" :label="item.name" :value="item.value" @click.native="change(item)">
    </el-option>
  </el-select>
</template>
<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: '请选择',
    },
    dictValue: {
      type: String,
      default: null,
    },
    valueLabel: {
      type: String,
      default: null,
    },
    options: {
      type: Array,
      default: null,
    },
    value: {
      type: Number || String,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: null,
    },
    url: {
      type: String,
      default: null,
    },
  },
  created() {
    this.selvalue = this.value
  },
  watch: {
    value(val) {
      this.selvalue = this.value
    },
  },
  data() {
    return {
      selvalue: '',
    }
  },
  methods: {
    change(e) {
      this.$emit('change', e, this.valueLabel)
    },
  },
}
</script>