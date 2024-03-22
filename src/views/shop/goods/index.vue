<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="商品名称" prop="productName">
        <el-input v-model="queryParams.productName" placeholder="请输入套餐ID" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="商品货号" prop="productSn">
        <el-input v-model="queryParams.productSn" placeholder="请输入名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="商品分类">
        <el-cascader clearable v-model="queryParams.productCategoryId" :options="productCateOptions" :show-all-levels="false" @change="handleCascaderChange">
        </el-cascader>
      </el-form-item>
      <el-form-item label="上架状态" prop="publishStatus">
        <el-select v-model="queryParams.publishStatus" placeholder="请选择">
          <el-option v-for="item in statusList" :key="item.value" :label="item.name" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审核状态" prop="approveStatus">
        <el-select v-model="queryParams.approveStatus" placeholder="请选择">
          <el-option v-for="item in seasonList" :key="item.value" :label="item.name" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['goods:list:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete()" v-hasPermi="['goods:list:remove']">批量删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="delist()" v-hasPermi="['goods:list:delist']">批量下架</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="listing()" v-hasPermi="['goods:list:delist']">批量上架</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" plain size="mini" @click="approveHandler('approved')" v-hasPermi="['goods:list:approve']">批量通过</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain size="mini" @click="approveHandler('rejected')" v-hasPermi="['goods:list:approve']">批量退回</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" ref="multipleTable" :row-key="getRowKeys" :data="mealList" @selection-change="handleSelectionChange">
      <el-table-column fixed type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" prop="id" width="60" />
      <el-table-column label="商品图片" align="center" width="100">
        <template slot-scope="scope">
          <img :src="scope.row.pic" style="width: 80px; height: 80px" />
        </template>
      </el-table-column>
      <el-table-column label="商品名称" align="center" prop="productName" />
      <el-table-column label="商品货号" align="center" prop="productSn" width="180" />
      <el-table-column label="商品分类" align="center" prop="productCategoryName" />
      <el-table-column label="价格" align="center" prop="price" />
      <el-table-column label="标签" align="center" width="190">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.publishStatus" inactive-text="上架" :active-value="1" :inactive-value="0" active-color="#13ce66" v-if="scope.row.mealStatus !== 1" v-hasPermi="['goods:list:delist']" @change="openor($event, scope.row)">
          </el-switch>
          <el-switch v-model="scope.row.newStatus" inactive-text="新品" :active-value="1" :inactive-value="0" active-color="#13ce66" style="display: block" @change="saveData($event, scope.row.id, 1)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="库存" align="center">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" @click="openInventoryList(scope.$index, scope.row)" type="primary"></el-button>
        </template>
      </el-table-column>
      <el-table-column label="销量" align="center" prop="sale" />
      <el-table-column label="访问量" align="center" width="120">
        <template slot-scope="scope">
          <span> 浏览量:{{ scope.row.visitCount }} </span>
        </template>
      </el-table-column>
      <el-table-column label="展示序号" align="center" prop="sort" width="80" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="150" />
      <el-table-column label="审核状态" align="center" width="90">
        <template slot-scope="scope">
          <span>{{ goSTATUS(seasonList, scope.row.approveStatus) }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width" width="120">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="handleDetail(scope.row)" v-hasPermi="['goods:list:detail']">详情</el-button>
          <el-button size="mini" type="text" @click="handleUpdate(scope.row)" v-if="scope.row.mealStatus !== 1" v-hasPermi="['goods:list:edit']">编辑</el-button>
          <el-button size="mini" type="text" @click="handleDelete(scope.row)" v-hasPermi="['goods:list:remove']">删除</el-button>
          <template v-if="
              scope.row.approveFlag &&
              scope.row.approveStatus === 'pending_approval'
            ">
            <el-button size="mini" type="text" @click="approveHandler('approved', scope.row)" v-hasPermi="['goods:list:approve']">通过</el-button>
            <el-button size="mini" type="text" @click="approveHandler('rejected', scope.row)" v-hasPermi="['goods:list:approve']">退回</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="编辑货品信息" :visible.sync="editSkuInfo.dialogVisible" width="80%">
      <span>商品货号：</span>
      <span>{{ editSkuInfo.productSn }}</span>
      <el-input placeholder="按sku编号搜索" v-model="editSkuInfo.keyword" size="small" style="width: 60%; margin-left: 20px">
        <el-button slot="append" icon="el-icon-search" @click="handleSearchEditSku"></el-button>
      </el-input>
      <el-table style="width: 100%; margin-top: 20px" :data="editSkuInfo.stockList" border>
        <el-table-column label="SKU编号" align="center" width="200">
          <template slot-scope="scope">
            <el-input v-model="scope.row.skuCode" :disabled="true"></el-input>
          </template>
        </el-table-column>
        <el-table-column v-for="(item, index) in editSkuInfo.productAttr" :label="item.productAttributeName" :key="item.id" align="center">
          <template slot-scope="scope">
            {{ getProductSkuSp(scope.row, index) }}
          </template>
        </el-table-column>
        <el-table-column label="销售价格" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.price"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="商品库存" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.stock"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="锁定库存" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.lockStock" :disabled="true"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="库存预警值" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.lowStock"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editSkuInfo.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditSkuConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
  </div>
</template>

<script>
import {
  categorypagelist,
  categorylist,
  batchOperate,
  productList,
  bapprove,
  querySkuList,
  getListDetails,
  updateSkuStockList,
} from '@/api/shop/goods'
import elSelectObject from '@/components/formBase/el-selectObject'
// import packageDetail from './detail/index'
export default {
  name: 'Good',
  components: {
    elSelectObject,
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 【请填写功能名称】表格数据
      mealList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        productName: null,
        productSn: null,
        productCategoryId: null,
        publishStatus: null,
        approveStatus: null,
      },
      //机构列表
      institutionsList: [],
      //商品分类列表
      productCateOptions: [],
      //状态列表
      statusList: [
        {
          name: '下架',
          value: 0,
        },
        {
          name: '上架',
          value: 1,
        },
      ],
      //原因列表
      seasonList: [
        {
          name: '待审核',
          value: 'pending_approval',
        },
        {
          name: '审核通过',
          value: 'approved',
        },
        {
          name: '审核不通过',
          value: 'rejected',
        },
      ],
      dialogVisible: false,
      editSkuInfo: {
        dialogVisible: false,
        productId: null,
        productSn: '',
        productAttributeCategoryId: null,
        stockList: [],
        productAttr: [],
        keyword: null,
      },
    }
  },
  created() {
    this.getList()
    this.categorylist()
  },
  activated() {
    const time = this.$route.query.t
    if (time != null && time != this.uniqueId) {
      this.uniqueId = time
      this.queryParams.pageNum = Number(this.$route.query.pageNum)
      this.getList()
    }
  },
  methods: {
    /** 查询【请填写功能名称】列表 */
    getList() {
      this.loading = true
      categorypagelist(this.queryParams).then((res) => {
        this.mealList = res.data.records
        this.total = res.data.total
        this.loading = false
      })
    },
    // 商品审核
    approveHandler(type, row) {
      let title = type === 'approved' ? '通过商品' : '拒绝通过'
      let params = {
        ids: row ? [row.id] : this.ids,
        approvalResults: type,
        approvalComment: null,
      }
      console.log(params)
      if (type === 'approved') {
        this.$confirm('是否确认通过该商品?', title, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          bapprove(params).then((res) => {
            this.$modal.msgSuccess('操作成功')
            this.getList()
          })
        })
      }
      if (type === 'rejected') {
        this.$prompt('拒绝原因', title, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          params.approvalComment = value
          bapprove(params).then((res) => {
            this.$modal.msgSuccess('操作成功')
            this.getList()
          })
        })
      }
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
    /**转换状态 */
    goSTATUS(e, v) {
      let obj = ''
      e.forEach((item) => {
        if (item.value === v) {
          obj = item.name
        }
      })
      return obj
    },
    /**获取最后一级id */
    handleCascaderChange(value) {
      if (value && value.length > 0) {
        const lastLevelId = value[value.length - 1]
        this.queryParams.productCategoryId = lastLevelId
        console.log('最后一级的 ID:', lastLevelId)
      }
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      const id = 1
      this.$router.push({
        name: `GoodsDetail`,
        query: {
          id: id,
        },
      })
    },
    openInventoryList(index, row) {
      this.editSkuInfo.dialogVisible = true
      this.editSkuInfo.productId = row.id
      this.editSkuInfo.productSn = row.productSn
      this.editSkuInfo.productAttributeCategoryId =
        row.productAttributeCategoryId
      this.editSkuInfo.keyword = null
      querySkuList(row.id).then((response) => {
        this.editSkuInfo.stockList = response.data
      })
      if (row.productAttributeCategoryId != null) {
        getListDetails(row.productAttributeCategoryId).then((response) => {
          this.editSkuInfo.productAttr = []
          const list = response.data
          list.forEach((item) => {
            if (item.type === 'attribute') {
              this.editSkuInfo.productAttr.push(item)
            }
          })
        })
      }
    },
    //转换
    getProductSkuSp(row, index) {
      let spData = JSON.parse(row.spData)
      if (spData != null && index < spData.length) {
        return spData[index].value
      } else {
        return null
      }
    },
    //库存列表搜索
    handleSearchEditSku() {
      querySkuList(this.editSkuInfo.productId, {
        keyword: this.editSkuInfo.keyword,
      }).then((response) => {
        this.editSkuInfo.stockList = response.data
      })
    },
    handleEditSkuConfirm() {
      if (
        this.editSkuInfo.stockList == null ||
        this.editSkuInfo.stockList.length <= 0
      ) {
        this.$message({
          message: '暂无sku信息',
          type: 'warning',
          duration: 1000,
        })
        return
      }
      this.$confirm('是否要进行修改', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        updateSkuStockList(this.editSkuInfo.stockList).then((response) => {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000,
          })
          this.editSkuInfo.dialogVisible = false
        })
      })
    },
    /**查看按钮操作 */
    handleDetail(row) {
      const id = 3
      this.$router.push({
        name: `GoodsDetail`,
        query: {
          id: id,
          rowsId: row.id,
        },
      })
    },
    handleClose() {},
    // 上下架
    openor(item, row) {
      console.log(item, row)
      if (item == 1) {
        //上架
        this.listing(row)
      } else {
        //下架
        this.delist(row)
      }
    },
    /**上架按钮 */
    listing(row) {
      const ids = row ? [row.id] : this.ids
      this.$modal
        .confirm('是否上架该条数据？')
        .then(function () {
          return batchOperate({
            idlist: ids,
            operateType: 3,
          })
        })
        .then(() => {
          this.$refs.multipleTable.clearSelection()
          this.getList()
          this.$modal.msgSuccess('上架成功')
        })
        .catch(() => {})
    },
    /**下架按钮 */
    delist(row) {
      const ids = row ? [row.id] : this.ids
      this.$modal
        .confirm(`是否下架该条数据？`)
        .then(function () {
          return batchOperate({
            idlist: ids,
            operateType: 2,
          })
        })
        .then(() => {
          this.$refs.multipleTable.clearSelection()
          this.getList()
          this.$modal.msgSuccess('下架成功')
        })
        .catch(() => {})
    },
    /**新品上架按钮 */
    saveData(e, value, tabIndex) {
      console.log('e', e)
      let data
      if (tabIndex === 0) {
        data = {
          id: value,
          publishStatus: Number(e),
        }
      } else {
        data = {
          id: value,
          newStatus: Number(e),
        }
        productList(data).then((res) => {
          // this.getList()
        })
      }
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const id = 2
      this.$router.push({
        name: `GoodsDetail`,
        query: {
          id: id,
          rowsId: row.id,
        },
      })
    },
    // 行数据的 Key 用于多选框的复选
    getRowKeys(row) {
      return row.id
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row ? [row.id] : this.ids
      this.$modal
        .confirm('是否删除已选数据？')
        .then(function () {
          return batchOperate({
            idlist: ids,
            operateType: 1,
          })
        })
        .then(() => {
          this.$refs.multipleTable.clearSelection()
          this.getList()
          this.$modal.msgSuccess('删除成功')
        })
        .catch(() => {})
    },
  },
}
</script>
