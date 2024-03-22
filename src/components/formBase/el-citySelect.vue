<template>
  <div class="flex align-c">
    <el-select v-model="queryParams.province" placeholder="省级" :size="size" clearable filterable style="width:auto">
      <el-option v-for="item in provinceList" :key="item.code" :label="item.name" :value="item.code" @click.native="changeProvince(item)" />
    </el-select>
    <el-select v-model="queryParams.city" placeholder="市级" :size="size" :disabled="citydisable" clearable filterable style="width:auto">
      <el-option v-for="item in cityList" :key="item.code" :label="item.name" :value="item.code" @click.native="changeCity(item)" />
    </el-select>
    <el-select v-model="queryParams.region" placeholder="区县" :size="size" :disabled="regiondisable" clearable filterable style="width:auto">
      <el-option v-for="item in regionList" :key="item.code" :label="item.name" :value="item.code" @click.native="changeRegion(item)" />
    </el-select>

    <i class="el-icon-circle-close" v-if="queryParams.province&&queryParams.city&&queryParams.region" @click="removeRegion"></i>

  </div>
</template>
<script>
import { getAddressList } from '@/api/organizaManagement/organizationInformation'
export default {
  props: {
    province: {
      type: String,
      default: null,
    },
    city: {
      type: String,
      default: null,
    },
    region: {
      type: String,
      default: null,
    },
    size: {
      type: String,
      default: null,
    },
  },
  watch: {
    province(val) {
      this.queryParams.province = val
    },
    city(val) {
      this.queryParams.city = val
    },
    region(val) {
      this.queryParams.region = val
    },
    'queryParams.province': {
      handler: function (newValue) {
        this.getCityList(newValue)
      },
      deep: true,
    },
    'queryParams.city': {
      handler: function (newValue) {
        console.log(2, newValue)
        this.getRegionList(newValue)
      },
      deep: true,
    },
  },
  created() {
    this.getProvince()
    this.queryParams.province = this.province
    this.queryParams.city = this.city
    this.queryParams.region = this.region
  },
  data() {
    return {
      citydisable: true,
      regiondisable: true,
      provinceList: [],
      cityList: [],
      regionList: [],
      props: {
        value: 'value',
        label: 'label',
        children: 'children',
      },
      queryParams: {
        region: null,
        regionLabel: null,
        city: null,
        cityLabel: null,
        province: null,
        provinceLabel: null,
      },
    }
  },
  methods: {
    //获取省份列表
    async getProvince() {
      this.provinceList = await getAddressList({
        level: 1,
      }).then((res) => {
        return res.data
      })
    },
    //获取城市列表
    async getCityList(paramsCode) {
      this.cityList = await getAddressList({
        level: 2,
        parentCode: paramsCode,
      }).then((res) => {
        return res.data
      })
    },
    //获取区域列表
    async getRegionList(paramsCode) {
      this.regionList = await getAddressList({
        level: 3,
        parentCode: paramsCode,
      }).then((res) => {
        return res.data
      })
    },
    //选择省份
    changeProvince(e) {
      this.queryParams.provinceLabel = e.name
      this.queryParams.city = null
      this.queryParams.cityLabel = null
      this.queryParams.region = null
      this.queryParams.regionLabel = null
      this.citydisable = false
    },
    //选择城市
    changeCity(e) {
      this.queryParams.cityLabel = e.name
      this.queryParams.region = null
      this.queryParams.regionLabel = null
      this.regiondisable = false
    },
    changeRegion(e) {
      this.queryParams.regionLabel = e.name
      this.$emit('change', this.queryParams)
    },
    removeRegion() {
      this.queryParams = {
        region: null,
        regionLabel: null,
        city: null,
        cityLabel: null,
        province: null,
        provinceLabel: null,
      }
      this.$emit('change', this.queryParams)
    },
  },
}
</script>
<style rel="stylesheet/scss" lang="scss">
.el-icon-circle-close {
  margin-left: 10px;
  cursor: pointer;
  color: red;
}
</style>