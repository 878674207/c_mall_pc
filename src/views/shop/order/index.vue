<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="订单搜索" prop="id">
        <el-input v-model="queryParams.orderNo" placeholder="请输入订单编号搜索" clearable @keyup.enter.native="handleQuery"
          oninput="value=value.replace(/[^0-9.]/g,'')" />
      </el-form-item>
      <el-form-item label="收货人" prop="name">
        <el-input v-model="queryParams.receiverInfo" placeholder="请输入收货人姓名或手机号" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="下单时间">
        <formDataPicker @change="fixTime" :begDate="queryParams.startTime" />
      </el-form-item>
      <el-form-item label="商品名称" prop="mealStatus">
        <el-input v-model="queryParams.productName" placeholder="请输入商品名称搜索" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="付款方式" prop="offShelfReason">
        <el-select v-model="queryParams.offShelfReason" placeholder="全部" clearable>
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
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="全部" name="all">
      </el-tab-pane>
      <el-tab-pane label="待支付" name="waiting_pay">
      </el-tab-pane>
      <el-tab-pane label="待发货" name="waiting_delivery">
      </el-tab-pane>
      <el-tab-pane label="已发货" name="delivered"></el-tab-pane>
      <el-tab-pane label="已完成" name="completed"></el-tab-pane>
      <el-tab-pane label="已关闭" name="closed"></el-tab-pane>
    </el-tabs>
    <el-table v-loading="loading" ref="multipleTable" :row-key="getRowKeys" :data="moneyList"
      @selection-change="handleSelectionChange">
      <el-table-column fixed="left" label="商品信息" align="left" width="380">
        <template slot-scope="scope">
          <div class="flex-spb">
            <span>订单编号: <p>{{ scope.row.orderNo }}</p> </span>
            <span>时间: <p>{{ scope.row.createTime }}</p> </span>
          </div>
          <div v-for="(item, index) in scope.row.orderItemList" :key="index" class="flex align-c">
            <img :src="item.productPic" style="height: 80px;width: 80px;">
            <div style="text-align: left; margin-left: 20px;">
              <p>商品名称:{{ item.productName }}</p>
              <p>{{ setRule(item.productAttr) }}</p>
              <p></p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="单价" align="center">
        <template slot-scope="scope">
          <span v-for="(item, index) in scope.row.orderItemList" :key="index"
            style="display: flex; flex-direction: column;margin-top: 80px;">
            <span>{{ item.productPrice }}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="数量" align="center">
        <template slot-scope="scope">
          <span v-for="(item, index) in scope.row.orderItemList" :key="index"
            style="display: flex; flex-direction: column; margin-top: 80px;">
            <span>{{ item.quantity }}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="售后状态" align="center">
        <template slot-scope="scope">
          <span>{{ afterSales(scope.row.afterSalesStatus) }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="所属品牌" align="center" prop="brand" /> -->
      <el-table-column label="卖家信息" align="left" width="240">
        <template slot-scope="scope">
          <p>付款账号 {{ scope.row.buyerInfoVo.paymentAccount }}</p>
          <p>收货人 {{ scope.row.buyerInfoVo.receiverName }}</p>
          <p>联系方式 {{ scope.row.buyerInfoVo.receiverPhone }}</p>
        </template>
      </el-table-column>
      <el-table-column label="实付价格" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.totalAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" align="center">
        <template slot-scope="scope">
          <span>{{ conversion(scope.row.orderStatus) }}</span>
          <p><button v-if="scope.row.orderStatus == 'waiting_delivery'"
              style="background-color: orange; color: #fff; border: none;padding: 5px 10px;"
              @click="confirmDelivery(scope.row.id)">确认发货</button></p>
        </template>
      </el-table-column>
      <!-- <el-table-column label="上架时间" align="center" prop="onShelfTime" />
      <el-table-column label="下架原因" align="center" prop="offShelfReasonLable" /> -->
      <el-table-column label="操作" fixed="right" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="detileBtn(scope.row)">详情</el-button>
          <el-button size="mini" type="text" @click="moreBtn(scope.row)">备注</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="orderUpdate" />

    <!--备注弹框-->
    <el-dialog title="备注" :visible.sync="moreBtnFlag" width="600px" :beforeclose="moreBtnFlag == false" append-to-body
      style="font-weight: 700;">
      <el-form label-width="30px">
        <el-row>
          <el-col :span="23">
            <el-form-item label="" prop="disableReason">
              <el-input type="textarea" :rows="5" placeholder="添加备注" v-model="remark">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="moreFunction">确 定</el-button>
        <el-button @click="moreBtnFlag = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import {
//   listMoney,
//   getMoney,
//   delMoney,
//   addMoney,
//   updateMoney,
// } from '@/api/organizaManagement/earnestMoney'
import formDataPicker from '@/components/formBase/el-datePicker' //时间组件
import { orderUpdate, confirmDelivery, addOrderRemark } from '@/api/order/order.js'
export default {
  name: 'Order',
  components: {
    formDataPicker,
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
      moneyList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageSize: 10,
        pageNum: 1,
        orderNo: null,
        productName: null,
        receiverInfo: null,
        orderStatus: null,
      },
      activeName: 'all', //一开始默认第一个
      //状态列表
      statusList: [
        {
          name: '下架',
          value: 0,
        },
        {
          name: '已上架',
          value: 1,
        },
        {
          name: '已发布',
          value: 2,
        },
      ],
      //原因列表
      seasonList: [],
      moreBtnFlag: false, //备注弹框
      remark: null, //备注
      rowId:null//点击备注存下来的id
    }
  },
  mounted() {
    this.orderUpdate()
    this.getDict()
  },
  methods: {
    // 点击tab
    handleClick(tab, event) {
      // console.log(this.activeName)
      this.queryParams.pageNum = 1
      this.queryParams.orderStatus =
        this.activeName === 'all' ? null : this.activeName
      this.orderUpdate()
    },
    // 查询订单接口
    orderUpdate() {
      orderUpdate(this.queryParams).then((res) => {
        if (res.code == 200) {
          if (res.data && res.data.list) {
            this.moneyList = res.data.list
            this.total = res.data.total
            this.loading = false
          }
        }
      })
    },
    //  点击详情按钮跳转
    detileBtn(row) {
      // 详情页面跳转路径
      this.$router.push({ path: '/shop/order/orderDetail?id=' + row.id })
    },
    // 点击备注按钮弹框
    moreBtn(row) {
      this.moreBtnFlag = true
      this.rowId = row.id
    },
    // 备注接口
    moreFunction() {
      this.moreBtnFlag = false
        let data = {
          orderId: this.rowId,
          remark: this.remark
        }
        addOrderRemark(data).then(res => {
          console.log(res);
          if(res.code==200){
            this.$modal.msgSuccess(res.msg)
          }
        })
      
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
    // 中文转换
    conversion(item) {
      switch (item) {
        case 'waiting_pay':
          return '待支付'
        case 'waiting_delivery':
          return '待发货'
        case 'delivered':
          return '已发货'
        case 'completed':
          return '已完成'
        case 'closed':
          return '已关闭'
      }
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
    /**获取字典值 */
    getDict() {
      this.getDicts('meal_off_shelf_reason').then((res) => {
        this.seasonList = res.data
      })
    },
    /**选择后的时间进行处理 */
    fixTime(e) {
      this.queryParams.startTime = e[0]
      this.queryParams.endTime = e[1]
    },
    /** 搜索按钮操作 */
    handleQuery() {
      // console.log(this.activeName);
      this.queryParams.pageNum = 1
      this.queryParams.orderStatus =
        this.activeName === 'all' ? null : this.activeName
      this.orderUpdate()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.pageNum = null
      this.queryParams.orderNo = null
      this.queryParams.productName = null
      this.queryParams.receiverInfo = null
      this.queryParams.productName = null
      this.queryParams.orderStatus = null
      this.queryParams.startTime = null
      this.queryParams.endTime = null
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 确认发货按钮
    confirmDelivery(id) {
      confirmDelivery(id).then(res => {
        console.log(res);
        if (res.code == 200) {
          this.$modal.msgSuccess(res.msg)
        }
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /**查看按钮操作 */
    handleDetail(row) {
      const id = 3
      this.$router.push({
        name: `MoneyDetail`,
        query: {
          id: id,
          rowsId: row.id,
        },
      })
    },
    /** 新增按钮操作 */
    handleAdd() {
      const id = 1
      this.$router.push({
        name: `MoneyDetail`,
        query: {
          id: id,
        },
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const id = 2
      this.$router.push({
        name: `MoneyDetail`,
        query: {
          id: id,
          rowsId: row.id,
        },
      })
    },
    /**上架按钮 */
    listing(row) {
      let params = {
        status: 1,
        id: row.id,
      }
      this.$modal
        // .confirm(`是否${params.status === '0' ? '下架' : '上架'}该条数据？`)
        .then(function () {
          return updateMoney(params)
        })
        .then(() => {
          this.$modal.msgSuccess('上架成功')
          this.handleQuery()
        })
    },
    /**下架按钮 */
    delist(row) {
      let params = {
        status: 0,
        id: row.id,
      }
      this.$modal
        // .confirm(`是否${params.status === '0' ? '下架' : '上架'}该条数据？`)
        .then(function () {
          return updateMoney(params)
        })
        .then(() => {
          this.$modal.msgSuccess('下架成功')
          this.handleQuery()
        })
    },
    // 行数据的 Key 用于多选框的复选
    getRowKeys(row) {
      return row.id
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids
      this.$modal
        .confirm('是否删除已选数据？')
        .then(function () {
          return delMoney(ids)
        })
        .then(() => {
          this.$refs.multipleTable.clearSelection()
          this.orderUpdate()
          this.$modal.msgSuccess('删除成功')
        })
        .catch(() => { })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.downloads(
        'pc/money/export',
        {
          ...this.queryParams,
        },
        `money_${new Date().getTime()}.xlsx`
      )
    },
  },
}
</script>
<style scoped>
/* ::v-deep .el-table_1_column_1.is-center.el-table__cell{
  display: flex;
  justify-content: center;
   img{
    display: inline-block;
   }
} */
/* ::v-deep .el-form-item.el-form-item--medium{} */
</style>
