<template>
  <div style="margin-top: 50px">
    <el-form :model="value" ref="productAttrForm" label-width="120px" class="form-inner-container" size="small">
      <h1>商品属性</h1>
      <el-form-item label="属性类型：" prop="productAttributeCategoryId">
        <el-select v-model="value.productAttributeCategoryId" placeholder="请选择属性类型" @change="handleProductAttrChange" :disabled="!isEdit">
          <el-option v-for="item in productAttributeCategoryOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品规格：">
        <el-card shadow="never" class="cardBg">
          <div v-for="(productAttr, idx) in selectProductAttr" :key="idx">
            {{ productAttr.name }}：
            <el-checkbox-group v-if="productAttr.handAddStatus === 0" v-model="selectProductAttr[idx].values" :disabled="!isEdit">
              <el-checkbox v-for="item in getInputListArr(productAttr.inputList)" :label="item" :key="item" class="littleMarginLeft"></el-checkbox>
            </el-checkbox-group>
            <div v-else>
              <el-checkbox-group v-model="selectProductAttr[idx].values" :disabled="!isEdit">
                <el-checkbox v-for="item in getInputListArr(productAttr.inputList)" :label="item" :key="item" class="littleMarginLeft"></el-checkbox>
                <div v-for="(item, index) in selectProductAttr[idx].options" style="display: inline-block" :key="index" class="littleMarginLeft">
                  <el-checkbox :label="item" :key="item"></el-checkbox>
                  <el-button type="text" class="littleMarginLeft" @click="handleRemoveProductAttrValue(idx, index,item)" :disabled="!isEdit">删除
                  </el-button>
                </div>
              </el-checkbox-group>
              <el-input v-model="addProductAttrValue[idx]" style="width: 160px; margin-left: 10px" clearable :disabled="!isEdit"></el-input>
              <el-button class="littleMarginLeft" @click="handleAddProductAttrValue(idx)" :disabled="!isEdit">增加</el-button>
            </div>
          </div>
        </el-card>
        <el-table style="width: 100%; margin-top: 20px" :data="value.skuStockList" border>
          <el-table-column v-for="(item, index) in selectProductAttr" :label="item.name" :key="item.id" align="center">
            <template slot-scope="scope">
              {{ getProductSkuSp(scope.row, index) }}
            </template>
          </el-table-column>
          <el-table-column label="销售价格" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.price" :disabled="!isEdit"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="促销价格" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.promotionPrice" :disabled="!isEdit"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="商品库存" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.stock" :disabled="!isEdit"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="库存预警值" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.lowStock" :disabled="!isEdit"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="SKU编号" align="center" prop="skuCode" width="200">
            <template slot-scope="scope">
              <el-input v-model="scope.row.skuCode" :disabled="true"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="属性图片" align="center" prop="skuCode">
            <template slot-scope="scope">
              <ImageUpload :limit="1" :value="scope.row.pic" @input="selectImages(scope.$index, $event)" :imgStyle="{ width: '80px', height: '80px' }" :isShowTip="false" :disabled="!isEdit" />
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="handleRemoveProductSku(scope.$index, scope.row)" :disabled="!isEdit">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" style="margin-top: 20px" @click="handleRefreshProductSkuList" :disabled="!isEdit">刷新列表
        </el-button>
        <el-button type="primary" style="margin-top: 20px" @click="handleSyncProductSkuPrice" :disabled="!isEdit">同步价格
        </el-button>
        <el-button type="primary" style="margin-top: 20px" @click="handleSyncProductSkuStock" :disabled="!isEdit">同步库存
        </el-button>
      </el-form-item>
      <el-form-item label="商品参数：">
        <el-card shadow="never" class="cardBg">
          <div v-for="(item, index) in selectProductParam" :class="{ littleMarginTop: index !== 0 }" :key="index">
            <div class="paramInputLabel">{{ item.name }}:</div>
            <el-select v-if="item.inputType === 'select'" class="paramInput" v-model="selectProductParam[index].value" :disabled="!isEdit">
              <el-option v-for="item in getParamInputList(item.inputList)" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
            <el-input v-else class="paramInput" v-model="selectProductParam[index].value" :disabled="!isEdit"></el-input>
          </div>
        </el-card>
      </el-form-item>
      <el-form-item label="商品详情">
        <editor v-model="value.detailHtml" :min-height="192" :readOnly="!isEdit" />
      </el-form-item>
      <!-- <el-form-item label="商品详情：">
        <el-tabs v-model="activeHtmlName" type="card">
          <el-tab-pane label="电脑端详情" name="pc">
            <tinymce :width="595" :height="300" v-model="value.detailHtml"></tinymce>
          </el-tab-pane>
          <el-tab-pane label="移动端详情" name="mobile">
            <tinymce :width="595" :height="300" v-model="value.detailMobileHtml"></tinymce>
          </el-tab-pane>
        </el-tabs>
      </el-form-item> -->
      <!-- <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev">上一步，填写商品促销</el-button>
        <el-button type="primary" size="medium" @click="handleNext">下一步，选择商品关联</el-button>
      </el-form-item> -->
    </el-form>
  </div>
</template>

<script>
import { commoditiList, getListDetails } from '@/api/shop/goods'

export default {
  name: 'ProductAttrDetail',
  props: {
    value: Object,
    isEdit: {
      type: Boolean,
      default: false,
    },
    routeId: {
      type: null,
      default: null,
    },
  },
  data() {
    return {
      //编辑模式时是否初始化成功
      hasEditCreated: false,
      //商品属性分类下拉选项
      productAttributeCategoryOptions: [],
      //选中的商品属性
      selectProductAttr: [],
      //选中的商品参数
      selectProductParam: [],
      //选中的商品属性图片
      selectProductAttrPics: [],
      //可手动添加的商品属性
      addProductAttrValue: [],
      //商品富文本详情激活类型
    }
  },
  watch: {
    value(newValue) {
      if (this.routeId === 2 || this.routeId === 3) {
        this.getProductAttrList(newValue.productAttributeCategoryId)
      }
    },
  },
  created() {
    this.getProductAttrCateList()
    // if (this.routeId === 2 || this.routeId === 3) {
    //   console.log(1212, this.$parent)
    //   this.getProductAttrList(this.value.productAttributeCategoryId)
    // }
  },
  methods: {
    getProductAttrCateList() {
      this.productAttributeCategoryOptions = []
      commoditiList().then((res) => {
        let list = res.data
        for (let i = 0; i < list.length; i++) {
          this.productAttributeCategoryOptions.push({
            label: list[i].attributeCategoryName,
            value: list[i].id,
          })
        }
      })
    },
    // handleEditCreated() {
    //   //根据商品属性分类id获取属性和参数
    //   if (this.value.productAttributeCategoryId != null) {
    //     this.handleProductAttrChange(this.value.productAttributeCategoryId);
    //   }
    //   this.hasEditCreated = true;
    // },
    getProductAttrList(cid) {
      this.selectProductAttr = []
      this.selectProductParam = []
      getListDetails(cid).then((res) => {
        let list = res.data
        if (list.length === 0) {
          this.selectProductAttr = []
          this.selectProductParam = []
          this.value.skuStockList = []
        } else {
          list.forEach((item, index) => {
            if (item.type === 'attribute') {
              let options = []
              let values = []
              // if (item.handAddStatus === 1) {
              //编辑状态下获取手动添加编辑属性
              options = this.getEditAttrOptions(item.id)
              // }
              //编辑状态下获取选中属性
              values = this.getEditAttrValues(item)
              this.selectProductAttr.push({
                id: item.id,
                name: item.productAttributeName,
                handAddStatus: item.handAddStatus,
                inputList: item.inputList,
                values: values,
                options: options,
                type: item.type,
              })
              // if (this.isEdit) {
              //   //编辑模式下刷新商品属性图片
              //   this.refreshProductAttrPics();
              // }
            } else {
              let value = null
              //编辑模式下获取参数属性
              value = this.getEditParamValue(item.id)
              this.selectProductParam.push({
                productAttributeId: item.id,
                name: item.productAttributeName,
                value: value,
                inputType: item.inputType,
                inputList: item.inputList,
                type: item.type,
              })
            }
          })
        }
      })
    },
    //获取设置的可手动添加属性值
    getEditAttrOptions(id) {
      let options = []
      for (let i = 0; i < this.value.productAttributeValueList.length; i++) {
        let attrValue = this.value.productAttributeValueList[i]
        if (attrValue.productAttributeId === id) {
          let strArr = attrValue.value.split(',')
          for (let j = 0; j < strArr.length; j++) {
            options.push(strArr[j])
          }
          break
        }
      }
      return options
    },
    //获取选中的属性值
    getEditAttrValues(item) {
      let values = new Set()
      for (let i = 0; i < this.value.skuStockList.length; i++) {
        let sku = JSON.parse(this.value.skuStockList[i].spData)
        values.add(
          sku.filter((i) => i.key === item.productAttributeName)[0].value
        )
      }
      return Array.from(values)
    },
    //获取属性的值
    getEditParamValue(id) {
      for (let i = 0; i < this.value.productAttributeValueList.length; i++) {
        if (id === this.value.productAttributeValueList[i].productAttributeId) {
          return this.value.productAttributeValueList[i].value
        }
      }
    },
    handleProductAttrChange(value) {
      this.getProductAttrList(value)
    },
    getInputListArr(inputList) {
      return inputList.split(',')
    },
    handleAddProductAttrValue(idx) {
      let options = this.selectProductAttr[idx].options
      if (
        this.addProductAttrValue[idx] == null ||
        this.addProductAttrValue[idx] == ''
      ) {
        this.$message({
          message: '属性值不能为空',
          type: 'warning',
          duration: 1000,
        })
        return
      }
      if (options.indexOf(this.addProductAttrValue[idx]) !== -1) {
        this.$message({
          message: '属性值不能重复',
          type: 'warning',
          duration: 1000,
        })
        return
      }
      this.selectProductAttr[idx].options.push(this.addProductAttrValue[idx])
      this.addProductAttrValue[idx] = null
    },
    handleRemoveProductAttrValue(idx, index, item) {
      this.selectProductAttr[idx].options.splice(index, 1)
      this.selectProductAttr[idx].values.splice(
        this.selectProductAttr[idx].values.indexOf(item),
        1
      )
    },
    //生成自定义列表
    getProductSkuSp(row, index) {
      let spData = JSON.parse(row.spData)
      if (spData != null && index < spData.length) {
        return spData[index].value
      } else {
        return null
      }
    },
    //刷新列表
    handleRefreshProductSkuList() {
      this.$confirm('刷新列表将导致sku信息重新生成，是否要刷新', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.refreshProductSkuList()
        // this.refreshProductAttrPics();
        // if (this.productSn === null) {
        //   this.$message.error('请先生成货码!')
        //   return
        // } else {
        //   this.refreshProductSkuList()
        // }
      })
    },
    handleSyncProductSkuPrice() {
      this.$confirm('将同步第一个sku的价格到所有sku,是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        if (
          this.value.skuStockList !== null &&
          this.value.skuStockList.length > 0
        ) {
          let tempSkuList = []
          tempSkuList = tempSkuList.concat(tempSkuList, this.value.skuStockList)
          let price = this.value.skuStockList[0].price
          for (let i = 0; i < tempSkuList.length; i++) {
            tempSkuList[i].price = price
          }
          this.value.skuStockList = []
          this.value.skuStockList = this.value.skuStockList.concat(
            this.value.skuStockList,
            tempSkuList
          )
        }
      })
    },
    handleSyncProductSkuStock() {
      this.$confirm('将同步第一个sku的库存到所有sku,是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        if (
          this.value.skuStockList !== null &&
          this.value.skuStockList.length > 0
        ) {
          let tempSkuList = []
          tempSkuList = tempSkuList.concat(tempSkuList, this.value.skuStockList)
          let stock = this.value.skuStockList[0].stock
          let lowStock = this.value.skuStockList[0].lowStock
          for (let i = 0; i < tempSkuList.length; i++) {
            tempSkuList[i].stock = stock
            tempSkuList[i].lowStock = lowStock
          }
          this.value.skuStockList = []
          this.value.skuStockList = this.value.skuStockList.concat(
            this.value.skuStockList,
            tempSkuList
          )
        }
      })
    },
    refreshProductSkuList() {
      this.value.skuStockList = []
      let skuList = this.value.skuStockList
      function generateSkuList(attrs, spData) {
        if (attrs.length === 0) {
          skuList.push({
            spData: JSON.stringify(spData),
          })
          return
        }

        let attr = attrs[0]
        let remainingAttrs = attrs.slice(1)

        for (let i = 0; i < attr.values.length; i++) {
          let newSpData = spData.concat({
            key: attr.name,
            value: attr.values[i],
          })
          generateSkuList(remainingAttrs, newSpData)
        }
      }

      generateSkuList(this.selectProductAttr, [])
    },
    // //获取商品相关属性的图片
    // getProductSkuPic(name) {
    //   for (let i = 0; i < this.value.skuStockList.length; i++) {
    //     let spData = JSON.parse(this.value.skuStockList[i].spData);
    //     if (name === spData[0].value) {
    //       return this.value.skuStockList[i].pic;
    //     }
    //   }
    //   return null;
    // },
    //合并商品属性
    mergeProductAttrValue() {
      this.value.productAttributeValueList = []
      console.log('0000', this.selectProductAttr, this.selectProductParam)
      for (let i = 0; i < this.selectProductAttr.length; i++) {
        let attr = this.selectProductAttr[i]
        if (
          attr.handAddStatus === 1 &&
          attr.options != null &&
          attr.options.length > 0 &&
          attr.type === '"params"'
        ) {
          this.value.productAttributeValueList.push({
            productAttributeId: attr.id,
            value: this.getOptionStr(attr.options),
          })
        }
      }
      for (let i = 0; i < this.selectProductParam.length; i++) {
        let param = this.selectProductParam[i]
        this.value.productAttributeValueList.push({
          productAttributeId: param.productAttributeId,
          value: param.value,
          productAttributeName: param.name,
        })
      }
      // for (let i = 0; i < this.value.productAttributeValueList.length; i++) {
      //   let param = this.value.productAttributeValueList[i];
      //   this.value.productAttributeValueList.push({
      //     productAttributeId: param.id,
      //     value: param.value
      //   });
      // }
    },
    //合并商品属性图片
    // mergeProductAttrPics() {
    //   for (let i = 0; i < this.selectProductAttrPics.length; i++) {
    //     for (let j = 0; j < this.value.skuStockList.length; j++) {
    //       let spData = JSON.parse(this.value.skuStockList[j].spData);
    //       if (spData[0].value === this.selectProductAttrPics[i].name) {
    //         this.value.skuStockList[j].pic = this.selectProductAttrPics[i].pic;
    //       }
    //     }
    //   }
    // },
    getOptionStr(arr) {
      let str = ''
      for (let i = 0; i < arr.length; i++) {
        str += arr[i]
        if (i != arr.length - 1) {
          str += ','
        }
      }
      return str
    },
    handleRemoveProductSku(index, row) {
      let list = this.value.skuStockList
      if (list.length === 1) {
        list.pop()
      } else {
        list.splice(index, 1)
      }
    },
    getParamInputList(inputList) {
      console.log('inputList', inputList)
      return inputList.split(',')
    },
    selectImages(index, e) {
      console.log(index)
      this.value.skuStockList[index].pic = e[0].fileUrl
    },
  },
}
</script>

<style scoped>
.littleMarginLeft {
  margin-left: 10px;
}

.littleMarginTop {
  margin-top: 10px;
}

.paramInput {
  width: 250px;
}

.paramInputLabel {
  display: inline-block;
  width: 100px;
  text-align: right;
  padding-right: 10px;
}

.cardBg {
  background: #f8f9fc;
}
</style>
