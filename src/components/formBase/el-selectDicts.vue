<template>
  <!-- 字典下拉选项 -->
  <el-select v-model="selvalue" clearable :placeholder="placeholder" style="width: 202px">
    <el-option v-for="item in options" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue" @click.native="change(item)">
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
    value: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      options: [],
      selvalue: null,
    }
  },
  created() {
    this.selvalue = this.value
  },
  watch: {
    value(val) {
      this.selvalue = this.value
    },
  },
  mounted() {
    this.getlist()
  },
  methods: {
    change(e) {
      this.$emit('change', e, this.valueLabel)
    },
    getlist() {
      this.getDicts(this.dictValue).then((res) => {
        this.options = res.data
      })
    },
  },
}
</script>