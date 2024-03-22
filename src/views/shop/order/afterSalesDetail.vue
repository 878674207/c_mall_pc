<template>
  <div class="app-container" v-loading="loading" v-if="params">
    <div class="right-list-box">
      <div class="right-top">
        <div class="te-title">售后信息</div>
        <el-table :data="params.afterSalesItemList" border>
          <el-table-column label="商品图片" align="center" width="150">
            <template slot-scope="scope">
              <img :src="scope.row.productPic" style="height: 100px;width: 100px;">
            </template>
          </el-table-column>
          <el-table-column label="商品名称" align="center" prop="productName">
          </el-table-column>
          <el-table-column label="属性" align="center" prop="productName">
            <template slot-scope="scope">
              {{ setRule(scope.row.productAttr) }}
            </template>
          </el-table-column>
          <el-table-column label="SKU编号" align="center" prop="productSkuCode">
          </el-table-column>
          <el-table-column label="单价" align="center" prop="productPrice" width="150">
          </el-table-column>
          <el-table-column label="数量" align="center" prop="quantity" width="150">
          </el-table-column>
          <!-- <el-table-column label="小计" align="center" prop="productPrice">
          </el-table-column> -->
          <el-table-column label="售后方式" align="center" width="150">
            <template slot-scope="scope">
              <span>{{ scope.row.afterSalesMethods==='return'?'退货':'换货' }}</span>
            </template>
          </el-table-column>
        </el-table>

        <div class="bgitem" style="margin-top:24px">
          <div class="itembottom">
            <div>
              <span>退款编号</span>
              <span>{{params.afterSalesNo}}</span>
            </div>
            <div>
              <span>申请时间</span>
              <span>{{ params.createTime }}</span>
            </div>
            <div>
              <span>售后状态</span>
              <span>{{ afterSales(params.afterSalesStatus) }}</span>
            </div>
          </div>
          <div class="itembottom">
            <div>
              <span>售后原因</span>
              <span>{{ params.afterSalesReason }}</span>
            </div>
            <div>
              <span>问题描述</span>
              <span>{{ params.afterSalesRemark }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="right-top flex-spb">
        <div class="flex1">
          <div class="te-title">订单信息</div>
          <div class="info-top  flex-col flex-spb" style="height:120px;">
            <div class="flex align-c">
              <span>订单编号</span>
              <span>{{ params.orderInfo.orderNo }}</span>
            </div>
            <div class="flex align-c">
              <span>发货时间</span>
              <span>{{ params.orderInfo.createTime }}</span>
            </div>
            <div class="flex align-c">
              <span>发货地址</span>
              <span>{{ params.orderInfo.afterSalesRemark }}</span>
            </div>
            <div class="flex align-c">
              <span>买家备注</span>
              <span>{{ params.orderInfo.remark }}</span>
            </div>
          </div>
        </div>
        <div class="flex1">
          <div class="te-title">收货人信息</div>
          <div class="info-top flex-col flex-spb" style="height:120px;">
            <div class="flex align-c">
              <span>收货人</span>
              <span>{{ params.orderAddress.receiverName }}</span>
            </div>
            <div class="flex align-c">
              <span>收获地址</span>
              <span>{{params.orderAddress.province}}{{params.orderAddress.city}}{{params.orderAddress.region}}{{params.orderAddress.address}}</span>
            </div>
            <div class="flex align-c">
              <span>手机号码</span>
              <span>{{ params.orderAddress.receiverPhone }}</span>
            </div>
          </div>
        </div>
        <div class="flex1">
          <div class="te-title">付款信息</div>
          <div class="info-top  flex-col flex-spb" style="height:120px;">
            <div class="flex align-c">
              <span>商品总价</span>
              <span>{{ params.orderInfo.totalAmount }}</span>
            </div>
            <div class="flex align-c">
              <span>运费</span>
              <span>{{ params.orderInfo.promotionAmount }}</span>
            </div>
            <div class="flex align-c">
              <span>实付款</span>
              <span>{{ params.orderInfo.payAmount }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="right-top">
        <div class="te-title">售后处理</div>

        <div class="bgitem">
          <div>
            <span>售后方式</span>
            <span v-for="(item,index) in params.afterSalesItemList" :key="index">{{ item.afterSalesMethods==='return'?'退货':'换货' }}</span>
          </div>
          <div style="padding: 24px 0;">
            <el-button size="small" type="danger" :disabled="params.afterSalesStatus!=='apply'" @click="submitCom('rejected')">拒 绝</el-button>
            <el-button size="small" type="primary" :disabled="params.afterSalesStatus!=='apply'" @click="submitCom('completed')">同 意</el-button>
          </div>
        </div>
      </div>
      <div class="right-top">
        <div class="te-title">操作日志</div>
        <el-table :data="params.afterSalesRemarkLogList" border>
          <el-table-column label="操作者" align="center" prop="createBy">
          </el-table-column>
          <el-table-column label="操作时间" align="center" prop="createTime">
          </el-table-column>
          <el-table-column label="售后状态" align="center">
            <template slot-scope="scope">
              <span>{{ afterSales(scope.row.afterSalesStatus) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="备注" align="center" prop="remark">
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import { afterSsalesdetail, afterdeal } from '@/api/order/order.js'
export default {
  data() {
    return {
      routeId: null,
      params: null,
      loading: true,
    }
  },
  created() {
    this.routeId = this.$route.query.id
    this.getDetails(this.routeId)
  },
  methods: {
    // 按钮拒绝 / 同意
    submitCom(value) {
      let params = {
        id: this.routeId,
        afterSalesStatus: value,
      }
      let str = this.params.afterSalesItemList.map((item) => {
        return item.afterSalesMethods === 'return' ? '退货' : '换货'
      })
      this.$confirm('请确认售后方式 ' + str, '售后处理', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(function () {
          return afterdeal(params)
        })
        .then(() => {
          this.$message.success('操作成功')
          this.close()
        })
    },
    /** 关闭按钮 */
    close() {
      const obj = {
        path: '/shop/afterSales',
        query: { t: Date.now(), pageNum: this.$route.query.pageNum },
      }
      this.$tab.closeOpenPage(obj)
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
    getDetails() {
      // 售后详情
      afterSsalesdetail(this.routeId).then((response) => {
        this.params = response.data
        this.loading = false
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.app-container {
  padding: 0 0 0 16px;
  height: 100%;
  background: #f3f5f7;
  overflow: hidden;
  p {
    padding: 0;
    margin: 0;
  }
  .box-card {
    height: 100%;
    font-weight: bold;
    line-height: 24px;
    width: 230px;
    background: #ffffff;
    border-radius: 6px;
    margin: 16px;
    .user-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      overflow: hidden;
      margin: 36px auto 16px;
    }
    .user-name {
      font-size: 16px;
      font-family: PingFangSC, PingFang SC;
      font-weight: bold;
      color: #000000;
      line-height: 16px;
    }
    .user-sale {
      display: inline-block;
      min-width: 99px;
      height: 30px;
      padding: 0 8px;
      margin-top: 14px;
      border-radius: 4px;
      border: 1px solid #409eff;
      font-size: 14px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      color: #409eff;
      line-height: 28px;
      text-align: center;
    }
    .list-group {
      padding: 20px !important;
      margin: 0 !important;
    }
    .list-title-items {
      margin-bottom: 12px;
      font-size: 14px;
      font-family: PingFangSC, PingFang SC;
      font-weight: bold;
      color: #000000;
      line-height: 14px;
      .user-sex {
        width: 14px;
        height: 14px;
        margin-right: 11px;
      }
      .agecss {
        color: #606266;
      }
    }
    .list-items {
      display: flex;
      align-items: flex-start;
      margin-bottom: 8px;
      font-size: 14px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      color: #606266;
      line-height: 22px;
      .list-img {
        flex: 0 0 14px;
        height: 14px;
        margin-top: 4px;
        margin-right: 6px;
      }
    }
    .text-center {
      margin: 0 20px;
      padding-bottom: 20px;
      border-bottom: 1px dashed #e9e9e9;
    }
  }
  .right-list-box {
    padding: 16px 0;
    flex-grow: 1;
    height: 100%;
    overflow-y: auto;
    .right-top {
      padding: 20px;
      margin-bottom: 20px;
      background: #ffffff;
      border-radius: 6px;

      .info-top {
        div {
          .infotyle {
            margin: 0;
            display: inline-block;
            padding: 5px 9px;
            background: #f0f5ff;
            border-radius: 4px;
            font-size: 14px;
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            color: #409eff;
            line-height: 14px;
          }
          span {
            display: inline-block;
            margin-right: 24px;
            min-width: 84px;
            font-size: 14px;
            font-family: PingFangSC, PingFang SC;
            font-weight: 500;
            color: #606266;
            line-height: 14px;
          }
          & span:last-child {
            font-weight: 400 !important;
            color: #606266 !important;
          }
        }
      }
      .bgitem {
        padding: 24px 24px 0;
        background: #fbfbfb;
        border-radius: 6px;
        .itembottom {
          display: flex;
          padding-bottom: 24px;
          div {
            width: 33.3%;
          }
        }
        span {
          margin-right: 24px;
          font-size: 14px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 500;
          color: #606266;
          line-height: 14px;
        }
        & span:last-child {
          font-weight: 400 !important;
          color: #606266 !important;
        }
      }
    }
    .te-title {
      padding-bottom: 20px;
      height: 16px;
      font-size: 16px;
      font-family: PingFangSC, PingFang SC;
      font-weight: bold;
      color: #000000;
      line-height: 16px;
      box-sizing: content-box;
      display: flex;
      justify-content: start;
    }
    .tc {
      margin-top: 20px;
    }
  }
}
</style>
