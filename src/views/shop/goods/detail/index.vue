<template>
  <div class="app-container">
    <div style="margin-top: 50px">
      <el-form :model="productParam" ref="productAttrForm" label-width="120px" class="form-inner-container" size="small" :rules="rules">
        <h1>基本信息</h1>
        <el-row :gutter="20" class="mb8">
          <el-col :span="10">
            <el-form-item label="商品分类" prop="productCategoryId">
              <el-cascader style="width:100%" clearable v-model="productParam.productCategoryId" :options="productCateOptions" :show-all-levels="false" @change="handleCascaderChange" ref="cascader" :disabled="disabled">
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="商品名称" prop="productName">
              <el-input v-model="productParam.productName" placeholder="请输入商品名称" :disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="mb8">
          <el-col :span="10">
            <el-form-item label="副标题" prop="subTitle">
              <el-input type="textarea" :rows="2" placeholder="请输入副标题" v-model="productParam.subTitle" :disabled="disabled">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="商品介绍" prop="description">
              <el-input type="textarea" :rows="2" placeholder="请输入商品介绍" v-model="productParam.description" :disabled="disabled">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="mb8">
          <el-col :span="10">
            <el-form-item label="商品货号" prop="productSn">
              <el-input v-model="productParam.productSn" placeholder="请输入商品货号" :disabled="true">
                <el-button slot="append" @click="generate" :disabled="disabled">一键生成</el-button>
                <!-- <template v-slot:append>
                  <el-button type="text" @click="generate">一键生成</el-button>
                </template> -->
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="计量单位">
              <el-input v-model="productParam.unit" placeholder="请输入计量单位" :disabled="disabled">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="mb8">
          <el-col :span="10">
            <el-form-item label="商品售价" prop="price">
              <el-input v-model="productParam.price" placeholder="请输入商品售价" :disabled="disabled">
                <template v-slot:append>
                  <span>(元)</span>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="市场价">
              <el-input v-model="productParam.originalPrice" placeholder="请输入市场价" :disabled="disabled">
                <template v-slot:append>
                  <span>(元)</span>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="mb8">
          <el-col :span="10">
            <el-form-item label="商品库存" prop="stock">
              <el-input v-model="productParam.stock" placeholder="商品总库存仅用于展示" disabled>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="商品重量">
              <el-input v-model="productParam.weight" placeholder="请输入商品重量" :disabled="disabled">
                <template v-slot:append>
                  <span>(克)</span>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="mb8">
          <el-col :span="10">
            <el-form-item label="排序">
              <el-input v-model="productParam.sort" placeholder="请输入排序序号" type="number" :disabled="disabled">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="mb8">
          <el-col :span="10">
            <el-form-item label="商品轮播图：">
              <ImageUpload :limit="5" :value="productParam.carouselImages" @input="selectMainImage" :disabled="disabled" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="商品封面图：">
              <ImageUpload :limit="1" :value="productParam.pic" @input="selectImages" :disabled="disabled" />
            </el-form-item>
          </el-col>
        </el-row>
        <product-attr-detail ref="childComponentRef" :value="productParam" :is-edit="!disabled" :route-id="routeId"></product-attr-detail>
        <el-form-item style="text-align: center">
          <el-button size="medium" @click="submit" v-if="!disabled">保存</el-button>
          <el-button type="primary" size="medium" @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import ProductAttrDetail from './ProductAttrDetail'
import {
  categorylist,
  getGenerate,
  productList,
  getDetails,
} from '@/api/shop/goods'
export default {
  name: 'GoodsDetail',
  components: {
    ProductAttrDetail,
  },
  data() {
    return {
      productParam: {
        productCategoryId: null,

        productCategoryName: null,

        productName: null,

        subTitle: null,

        description: null,

        productSn: null,

        unit: null,

        price: null,

        originalPrice: null,

        stock: null,

        weight: null,

        sort: null,

        pic: null,

        carouselImages: [],

        skuStockList: [],

        productAttributeValueList: [],

        productAttributeCategoryId: null,

        detailHtml: null,
      },
      rules: {
        productCategoryId: [
          { required: true, message: '请选择商品分类', trigger: 'change' },
        ],
        productName: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        subTitle: [
          {
            type: 'date',
            required: true,
            message: '请输入 副标题',
            trigger: 'blur',
          },
        ],
        description: [
          {
            type: 'date',
            required: true,
            message: '请输入商品介绍',
            trigger: 'blur',
          },
        ],
        productSn: [
          {
            type: 'array',
            required: true,
            message: '请输入商品货号',
            trigger: 'blur',
          },
        ],
        price: [{ required: true, message: '请输入商品售价', trigger: 'blur' }],
        // stock: [{ required: true, message: '请输入商品库存', trigger: 'blur' }],
        productAttributeCategoryId: [
          { required: true, message: '请选择商品属性', trigger: 'change' },
        ],
      },
      productCateOptions: [],
      disabled: false,
      routeId: null,
      rowsId: null,
    }
  },
  computed: {},
  created() {
    this.routeId = Number(this.$route.query.id)
    if (this.routeId === 3) {
      this.disabled = true
      this.getDetails(this.$route.query.rowsId)
    }
    if (this.routeId === 2) {
      this.disabled = false
      this.getDetails(this.$route.query.rowsId)
    }
    this.categorylist()
  },
  methods: {
    /**详情编辑列表 */
    getDetails(rowsId) {
      getDetails(rowsId).then((res) => {
        if (res.code === 200) {
          const data = res.data
          this.productParam = {
            productCategoryId: data.productCategoryId,

            productCategoryName: data.productCategoryName,

            productName: data.productName,

            subTitle: data.subTitle,

            description: data.description,

            productSn: data.productSn,

            unit: data.unit,

            price: data.price,

            originalPrice: data.originalPrice,

            stock: data.stock,

            weight: data.weight,

            sort: data.sort,

            pic: data.pic,

            carouselImages: data.carouselImages,

            skuStockList: data.skuStockList,

            productAttributeValueList: data.productAttributeValueList,

            productAttributeCategoryId: data.productAttributeCategoryId,

            detailHtml: data.detailHtml,
          }
        }
      })
    },
    /**商品分类列表 */
    categorylist() {
      categorylist().then((response) => {
        let list = response.data
        this.productCateOptions = []
        for (let i = 0; i < list.length; i++) {
          let children = []
          if (list[i].children != null && list[i].children.length > 0) {
            for (let j = 0; j < list[i].children.length; j++) {
              children.push({
                label: list[i].children[j].categoryName,
                value: list[i].children[j].id,
              })
            }
          }
          this.productCateOptions.push({
            label: list[i].categoryName,
            value: list[i].id,
            children: children,
          })
        }
      })
    },
    //一键生成货号
    generate() {
      getGenerate().then((res) => {
        if (res.code === 200) {
          this.productParam.productSn = res.data
        }
      })
    },
    /**获取最后一级id */
    handleCascaderChange(value) {
      const checkedNodes = this.$refs.cascader.getCheckedNodes()
      const lastNode = checkedNodes[checkedNodes.length - 1]
      console.log('lastNode', lastNode)
      this.productParam.productCategoryId = lastNode.value
      this.productParam.productCategoryName = lastNode.label
      // return lastNode ? lastNode.label : '';
    },
    /**选择小图 */
    selectMainImage(e) {
      console.log('e', e)
      this.productParam.carouselImages = e
    },
    /**选择背景 */
    selectImages(e) {
      this.productParam.pic = e[0].fileUrl
    },
    //保存数据
    submit() {
      this.$refs.childComponentRef.mergeProductAttrValue()
      const Params = Object.assign({}, this.productParam)
      Params.id = this.$route.query.rowsId
      productList(Params).then((res) => {
        if (res.code === 200) {
          this.$modal.msgSuccess('保存成功')
          this.close()
        }
      })
    },
    /** 关闭按钮 */
    close() {
      const obj = {
        path: '/good',
        query: { t: Date.now(), pageNum: this.$route.query.pageNum },
      }
      this.$tab.closeOpenPage(obj)
    },
    //取消
    cancel() {
      this.$router.go(-1)
    },
  },
}
</script>

<style scoped lang="scss"></style>
