<template>
  <div class="block">
    <el-date-picker
      clearable
      v-model="value"
      :type="type"
      :value-format="valueformat"
      :picker-options="pickerOptions"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      @change="change"
    >
    </el-date-picker>
  </div>
</template> 

<script>
export default {
  props: {
    // 后台需要的 日期格式
    valueformat: {
      type: String,
      default: "yyyy-MM-dd",
    },
    // 调整日期控件的 种类
    type: {
      type: String,
      default: "daterange",
    },
    // 组件中传过来的 开始时间 用这个时间将时间组件清空
    begDate: {
      type: String,
      default: null,
    },
  },
  watch: {
    begDate(value) {
      // 用于重置 表单的时间控件
      if (value === null) {
        this.value = null;
      }
    },
  },
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      value: [],
    };
  },
  methods: {
    change(e) {
      // 由于后台需要 开始和结束时间 分开的两个字段 所以加这个判断用于组件中容易取值
      this.$emit("change", e ? e : [null, null]);
    },
  },
};
</script>