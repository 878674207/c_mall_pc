<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="售后编号" prop="afterSalesNo">
        <el-input v-model="queryParams.afterSalesNo" placeholder="请输入售后编号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="订单编号" prop="orderNo">
        <el-input v-model="queryParams.orderNo" placeholder="请输入订单编号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="收货人" prop="receiverInfo">
        <el-input v-model="queryParams.receiverInfo" placeholder="请输入收货人" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="商品名称" prop="productName">
        <el-input v-model="queryParams.productName" placeholder="请输入商品名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="售后方式" prop="afterSalesMethods">
        <el-select v-model="queryParams.afterSalesMethods" placeholder="全部" clearable>
          <el-option v-for="item in seasonList" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table v-loading="loading" ref="multipleTable" :row-key="getRowKeys" :data="evaluationList" @selection-change="handleSelectionChange">
      <el-table-column fixed="left" type="index" label="序号" align="center" />
      <el-table-column fixed="left" label="商品信息" align="left" width="380">
        <template slot-scope="scope">
          <div class="flex-spb">
            <span>订单编号: <p>{{ scope.row.orderNo }}</p> </span>
            <span>时间: <p>{{ scope.row.createTime }}</p> </span>
          </div>
          <div v-for="(item, index) in scope.row.afterSalesItemList" :key="index" class="flex align-c">
            <img :src="item.productPic" style="height: 80px;width: 80px;">
            <div style="text-align: left; margin-left: 20px;">
              <p>商品名称:{{ item.productName }}</p>
              <p>{{ setRule(item.productAttr) }}</p>
              <p></p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="商品单价" align="center">
        <template slot-scope="scope">
          <div style="padding-top:74px">
            <p v-for="(item, index) in scope.row.afterSalesItemList" :key="index" style="line-height:88px;margin:0">
              {{ item.productPrice }}
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="售后方式" align="center">
        <template slot-scope="scope">
          <div style="padding-top:74px">
            <p v-for="(item, index) in scope.row.afterSalesItemList" :key="index" style="line-height:88px;margin:0">
              {{ item.afterSalesMethods==='return'?'退货':'换货' }}
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="售后编号" align="center" width="250">
        <template slot-scope="scope">
          <span>{{ scope.row.afterSalesNo}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="所属品牌" align="center" prop="brand" /> -->
      <el-table-column label="订单编号" align="center" width="240">
        <template slot-scope="scope">
          <p>{{ scope.row.orderNo }}</p>
        </template>
      </el-table-column>
      <el-table-column label="买家信息" align="left" width="240">
        <template slot-scope="scope">
          <p>付款账号：{{ scope.row.buyerInfoVo.paymentAccount }}</p>
          <p>收货人：{{ scope.row.buyerInfoVo.receiverName}}</p>
          <p>联系方式：{{ scope.row.buyerInfoVo.receiverPhone }}</p>
        </template>
      </el-table-column>
      <el-table-column label="申请时间" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="售后状态" align="center" prop="onShelfTime">
        <template slot-scope="scope">
          <span>{{ afterSales(scope.row.afterSalesStatus) }}</span>
        </template>
      </el-table-column>
      <!--  <el-table-column label="下架原因" align="center" prop="offShelfReasonLable" /> -->
      <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="detileBtn(scope.row)">{{scope.row.afterSalesStatus==='apply'?'处理':'查看'}}</el-button>
          <el-button size="mini" type="text" @click="moreBtn(scope.row)">备注</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
  </div>
</template>

<script>
import {
  listfterSsales,
  getorder,
  delOrder,
  refOrder,
  appOrder,
  addremark,
} from '@/api/order/order.js'
import elDatePicker from '@/components/formBase/el-datePicker'
import elSelectDicts from '@/components/formBase/el-selectDicts'
import elSelectObject from '@/components/formBase/el-selectObject'
import elDrawers from '@/components/formBase/el-drawers'
export default {
  name: 'Orders',
  components: {
    elDatePicker: elDatePicker,
    elSelectDicts: elSelectDicts,
    elSelectObject: elSelectObject,
    elDrawers: elDrawers,
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 评价表格数据
      evaluationList: [],
      // 弹出层标题
      title: '订单列表/详情',
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        afterSalesNo: null,
        orderNo: null,
        receiverInfo: null,
        productName: null,
        afterSalesMethods: null,
      },
      // 表单参数
      form: {},
      options: [],
      brandoptions: [],
      seasonList: [
        {
          dictValue: 'return',
          dictLabel: '退货',
        },
        {
          dictValue: 'exchange',
          dictLabel: '换货',
        },
      ],
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 提交备注
    moreBtn(row) {
      this.$prompt('添加备注', '备注', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        if (value) {
          let params = {
            afterSalesId: row.id,
            remark: value,
          }
          addremark(params).then((res) => {
            this.$modal.msgSuccess('备注成功')
          })
        } else {
          this.$modal.msgError(`请先填写备注信息~~`)
        }
      })
    },
    //  点击详情按钮跳转
    detileBtn(row) {
      // 详情页面跳转路径
      this.$router.push({ path: '/shop/order/afterSalesDetail?id=' + row.id })
    },
    // 售后状态文字转换
    afterSales(item) {
      switch (item) {
        case 'apply':
          return '已申请'
        case 'completed':
          return '已处理'
        case 'rejected':
          return '已拒绝'
      }
    },
    // 字段过滤
    setRule(item) {
      let arr = JSON.parse(item)
      let str = ''
      arr.forEach((element) => {
        str += element.key + '【' + element.value + '】'
      })
      return str
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids.join(',')
      this.$modal
        .confirm('是否删除已选数据？')
        .then(function () {
          return delOrder(ids)
        })
        .then(() => {
          this.$refs.multipleTable.clearSelection()
          this.handleQuery()
          this.$modal.msgSuccess('删除成功')
        })
    },
    // 下单时间选择
    changeDate(time) {
      this.queryParams.begDate = time[0]
      this.queryParams.endDate = time[1]
      this.queryParams.pageNum = 1
      this.getList()
    },
    changeType(val, label) {
      this.queryParams[label] = val.dictValue
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 查询评价列表 */
    getList() {
      this.loading = true
      listfterSsales(this.queryParams)
        .then((response) => {
          this.evaluationList = response.data.list
          this.total = response.data.total
          this.loading = false
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 行数据的 Key 用于多选框的复选
    getRowKeys(row) {
      return row.id
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
    /** 查看按钮操作 */
    handleUpdate(row) {
      const id = row.id
      this.$refs.drawer.drawer = true
      getorder(id).then((response) => {
        this.form = response.data
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        'pc/intention-order/export',
        {
          ...this.queryParams,
        },
        `订单列表导出_${new Date().getTime()}.xlsx`
      )
    },
    /** 退款按钮操作 */
    handleRefund(row) {
      this.$confirm('该笔订单已交易成功, 是否退款?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          const params = {
            id: row.id,
            updateType: '4',
          }
          refOrder(params).then((res) => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '退款成功!',
              })
              this.getList()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退款',
          })
        })
    },
    /**审核按钮操作 */
    handleApprove(row) {
      this.$confirm('该笔订单是否退款?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          const params = {
            id: row.id,
            approvalResults: 'approved',
          }
          appOrder(params).then((res) => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '审核成功!',
              })
              this.getList()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消审核',
          })
        })
    },
  },
}
</script>
