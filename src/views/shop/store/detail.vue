<template>
  <div class="app-container">
    <div class="contents">
      <el-form ref="form" :model="form" :rules="rules" label-position="top" class="demo-form-inline">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="店铺信息" name="first">
            <div class="info-top flex-spb align-c">
              <div>
                <span>店铺名称</span>
                <span>{{form.storeName}}</span>
              </div>
              <div class="flex align-c">
                <span>店铺类型</span>
                <p class="infotyle"> {{form.storeType==='0'?'自营':'入驻'}}</p>
              </div>
              <div class="flex align-c">
                <span>店铺LOGO</span>
                <el-image style="width: 48px;height: 48px;border-radius: 4px;" :src="form.logo" fit="fit"></el-image>
              </div>
            </div>
            <div class="info-top flex">
              <div>
                <span>实际办公地址</span>
                <span>{{form.actualOfficeAddress || '--'}}</span>
              </div>
            </div>
            <div class="bgitem">
              <div class="itembottom">
                <span>主营范围</span>
                <span>{{form.mainBusiness || '--'}}</span>
              </div>
              <div class="itembottom">
                <div>
                  <span>店铺账户</span>
                  <span>{{form.storeAccount || '--'}}</span>
                </div>
                <div>
                  <span>店铺状态</span>
                  <span>{{form.storeStatus==='0'?'正常':'停用'}}</span>
                </div>
              </div>
              <div class="itembottom">
                <div>
                  <span>店铺联系人</span>
                  <span>{{form.storeContactPerson || '--'}}</span>
                </div>
                <div>
                  <span>联系人电话</span>
                  <span>{{form.contactPhone}}</span>
                </div>
                <div>
                  <span>联系人邮箱</span>
                  <span>{{form.contactMail}}</span>
                </div>
              </div>

            </div>
            <div>
              <p class="lable" style="padding-bottom:16px">身份证正反面</p>
              <div class="flex">
                <div>
                  <el-image style="width: 224px;height: 134px;margin-right:24px;background: linear-gradient(92deg, #F7FBFE 0%, #FBF8FB 62%, #F4FDFE 100%);border-radius: 10px;" :src="form.frontId" :preview-src-list="[form.frontId]" />
                  <p class="lable tc" style="padding-top:16px">身份证正面</p>
                </div>
                <div>
                  <el-image style="width: 224px;height: 134px;margin-right:24px;background: linear-gradient(92deg, #F7FBFE 0%, #FBF8FB 62%, #F4FDFE 100%);border-radius: 10px;" :src="form.backId" :preview-src-list="[form.backId]" />
                  <p class="lable tc" style="padding-top:16px">身份证反面</p>
                </div>
              </div>
              <div class="info-bottom flex align-c">
                <div>
                  <span>入驻时间</span>
                  <span>{{form.addTime}}</span>
                </div>
                <p class="line"></p>
                <div>
                  <span>审批人</span>
                  <span>{{form.approvedBy || '--'}}</span>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="认证信息" name="second" v-if="form.storeType==='1'">
            <el-form-item label="相关资质证明" prop="attest">
              <el-image style="width: 224px;height: 134px;margin-right:24px;background: linear-gradient(92deg, #F7FBFE 0%, #FBF8FB 62%, #F4FDFE 100%);border-radius: 10px;" v-for="(item,index) in form.attest" :key="index" :src="item.filePath" :preview-src-list="getfilePath()">
              </el-image>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="结算方式" name="third" v-if="form.storeType==='1'">
            <div class="box-item">
              <p>结算方式</p>
              <p>{{form.settlementMethod}}</p>
            </div>
            <div class="box-item">
              <p>结算开户行</p>
              <p>{{form.openingBank}}</p>
            </div>
            <div class="box-item">
              <p>结算银行账号</p>
              <p>{{form.settlementBankAccount}}</p>
            </div>
            <div class="box-item">
              <p>银行开户名</p>
              <p>{{form.openingBank}}</p>
            </div>
            <div class="box-item">
              <p>结算银行开户支行名称</p>
              <p>{{form.nameSettlementBank}}</p>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </div>
  </div>
</template>

<script>
import { pselectById } from '@/api/shop/index.js'
import elDatePicker from '@/components/formBase/el-datePicker'
import elSelectDicts from '@/components/formBase/el-selectDicts'
import elSelectObject from '@/components/formBase/el-selectObject'
import elDrawers from '@/components/formBase/el-drawers'
export default {
  components: {
    elDatePicker: elDatePicker,
    elSelectDicts: elSelectDicts,
    elSelectObject: elSelectObject,
    elDrawers: elDrawers,
  },
  data() {
    return { activeName: 'first', form: {}, rules: {} }
  },
  computed: {},
  created() {
    this.id = this.$route.query.id
    this.getUser()
  },
  methods: {
    getfilePath() {
      return this.form.attest.map((r) => r.filePath)
    },
    selectMainImage() {},
    changeType() {},
    handleClick(tab) {
      this.activeName = tab.name
    },
    getUser() {
      pselectById(this.id).then((response) => {
        this.form = response.data
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.app-container {
  padding: 18px;
  min-height: 100%;
  background: #f3f5f7;
  .contents {
    padding: 16px;
    margin-bottom: 20px;
    background: #ffffff;
    border-radius: 6px;
    .lable {
      margin: 0;
      padding: 0;
      font-size: 14px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      color: #606266;
      line-height: 14px;
    }
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
          min-width: 84px;
          font-size: 14px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 500;
          color: #606266;
          line-height: 14px;
        }
        & span:last-child {
          padding-left: 24px;
          font-weight: 400 !important;
          color: #606266 !important;
        }
      }
    }
    .bgitem {
      margin: 24px 0;
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
        font-size: 14px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        color: #606266;
        line-height: 14px;
      }
      & span:last-child {
        padding-left: 24px;
        font-weight: 400 !important;
        color: #606266 !important;
      }
    }
    .info-bottom {
      padding: 24px;
      margin-top: 24px;
      background: #fafcff;
      border-radius: 6px;
      .line {
        margin: 0 48px;
        width: 1px;
        height: 14px;
        background: #606266;
      }
      div {
        span {
          font-size: 14px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 500;
          color: #606266;
          line-height: 14px;
        }
        & span:last-child {
          display: inline-block;
          padding-left: 24px;
          font-weight: 400 !important;
          color: #606266 !important;
        }
      }
    }
    .box-item {
      width: 33.3%;
      padding: 16px 14px;
      margin-bottom: 16px;
      background: #fbfbfb;
      border-radius: 4px;
      p {
        margin: 0;
        padding: 0;
        font-size: 14px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        color: #333333;
        line-height: 14px;
      }
      & p:last-child {
        padding-top: 18px;
        font-weight: 400 !important;
        color: #828282 !important;
      }
    }
  }
}
</style>