<template>
  <div class="app-container">
    <div class="contents" v-if="form.storeType=='1'&&!isOk">
      <p class="tc">
        易养老商城平台商家入驻协议
      </p>
      <pre class="tc">
一、商户入驻条件
商户必须具有合法的经营资质和营业执照，且经营范围符合平台要求。
商户必须遵守平台的规定和相关法律法规，不得从事违法违规的经营活动。
商户必须保证所售商品的品质和服务质量，确保消费者的权益。
商户必须配合平台的管理和运营，积极参与促销活动和营销策略。
商户必须遵守平台的费用结算规定，按时缴纳相关费用。
二、商户权利和义务
商户有权在平台上展示和销售自己的商品，享受平台提供的各项服务。
商户有义务保证所售商品的品质和服务质量，积极响应消费者的投诉和退换货要求。
商户有义务遵守平台的规定和相关法律法规，不得从事违法违规的经营活动。
商户有义务配合平台的管理和运营，积极参与促销活动和营销策略。
商户有义务按时缴纳相关费用，并配合平台的费用结算规定。
三、平台权利和义务
平台有权审核商户的资质和营业执照，并决定是否接受商户入驻。
平台有权对商户的经营行为进行监督和管理，保障消费者的权益。
平台有权对商户的商品和服务进行评价和监督，保障消费者的权益。
平台有权对商户的费用结算进行管理和监督，保障平台的利益。
四、协议的变更和解释
本协议的变更必须经双方协商一致，并以书面形式进行。
本协议的解释权归属于平台，如有争议，应当协商解决。
五、其他
本协议自双方签署之日起生效，有效期为一年。协议期满前，双方如有意愿继续合作，可协商续签。
        </pre>
      <div class="tc">
        <el-button type="primary" @click="isOk=!isOk">商家已知晓</el-button>
      </div>
    </div>
    <el-form ref="form" :inline="true" :model="form" :rules="rules" label-position="top" label-width="100px" class="demo-form-inline">
      <div v-if="form.storeType=='0'" class="contents">
        <p>店铺联系人</p>
        <el-form-item label="联系人姓名" prop="storeContactPerson">
          <el-input v-model="form.storeContactPerson" placeholder="联系人姓名" maxlength="20" />
        </el-form-item>
        <el-form-item label="联系人电话" prop="contactPhone">
          <el-input v-model="form.contactPhone" maxlength="11" placeholder="联系人电话" />
        </el-form-item>
        <el-form-item label="联系人邮箱" prop="contactMail">
          <el-input v-model="form.contactMail" placeholder="联系人邮箱" />
        </el-form-item>
        <el-form-item label="身份证正面" prop="frontId">
          <ImageUpload :limit="1" :isShowTip="false" @input="selectMainImage($event,'frontId')" />
        </el-form-item>
        <el-form-item label="身份证反面" prop="backId">
          <ImageUpload :limit="1" :isShowTip="false" @input="selectMainImage($event,'backId')" />
        </el-form-item>
      </div>
      <template v-if="form.storeType=='1'&&isOk">
        <div class="contents">
          <p>基本信息</p>
          <el-form-item label="公司全称" prop="entName">
            <el-input v-model="form.entName" placeholder="公司全称" />
          </el-form-item>
          <el-form-item label="公司简介" prop="entProfile">
            <el-input v-model="form.entProfile" placeholder="公司简介" />
          </el-form-item>
          <el-form-item label="入驻来源" prop="sourceEntry">
            <elSelectDicts :value="form.sourceEntry" placeholder="入驻来源" dictValue="entry_source" valueLabel="sourceEntry" @change="changeType" />
          </el-form-item>
          <el-form-item label="公司地址" prop="entAddress">
            <el-input v-model="form.entAddress" placeholder="公司地址" />
          </el-form-item>
          <el-form-item label="成立时间" prop="establishmentTime">
            <el-date-picker v-model="form.establishmentTime" value-format="yyyy-MM-dd" type="date" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="企业注册号" prop="entRegistNumber">
            <el-input v-model="form.entRegistNumber" placeholder="企业注册号" />
          </el-form-item>
          <el-form-item label="统一社会信用代码" prop="socialCreditCode">
            <el-input v-model="form.socialCreditCode" placeholder="统一社会信用代码" />
          </el-form-item>
          <el-form-item label="法人" prop="legalPerson">
            <el-input v-model="form.legalPerson" placeholder="法人" maxlength="20" />
          </el-form-item>
          <el-form-item label="法人身份证号" prop="legalPersonId">
            <el-input v-model="form.legalPersonId" maxlength="18" placeholder="法人身份证号" />
          </el-form-item>
          <el-form-item label="营业执照经营范围" prop="businessScope">
            <el-input v-model="form.businessScope" placeholder="营业执照经营范围" />
          </el-form-item>
          <el-form-item label="注册资本" prop="registeredCapital">
            <el-input v-model="form.registeredCapital" placeholder="注册资本" />
          </el-form-item>
          <el-form-item label="相关资质证明" prop="attest">
            <ImageUpload :limit="3" @input="selectAttestImage($event,'attest')" />
          </el-form-item>
        </div>
        <div class="contents">
          <p>店铺信息</p>
          <el-form-item label="联系人姓名" prop="storeContactPerson">
            <el-input v-model="form.storeContactPerson" placeholder="联系人姓名" maxlength="20" />
          </el-form-item>
          <el-form-item label="联系人电话" prop="contactPhone">
            <el-input v-model="form.contactPhone" maxlength="11" placeholder="联系人电话" />
          </el-form-item>
          <el-form-item label="联系人邮箱" prop="contactMail">
            <el-input v-model="form.contactMail" placeholder="联系人邮箱" />
          </el-form-item>
          <el-form-item label="实际办公地址" prop="actualOfficeAddress">
            <el-input v-model="form.actualOfficeAddress" placeholder="实际办公地址" />
          </el-form-item>
          <el-form-item label="身份证正面" prop="frontId">
            <ImageUpload :limit="1" @input="selectMainImage($event,'frontId')" />
          </el-form-item>
          <el-form-item label="身份证反面" prop="backId">
            <ImageUpload :limit="1" @input="selectMainImage($event,'backId')" />
          </el-form-item>
        </div>
        <div class="contents">
          <p>结算信息</p>
          <el-form-item label="结算方式" prop="settlementMethod">
            <el-input v-model="form.settlementMethod" placeholder="结算方式" />
          </el-form-item>
          <el-form-item label="结算开户行" prop="openingBank">
            <el-input v-model="form.openingBank" placeholder="结算开户行" />
          </el-form-item>
          <el-form-item label="结算银行账号" prop="settlementBankAccount">
            <el-input v-model="form.settlementBankAccount" placeholder="结算银行账号" />
          </el-form-item>
          <el-form-item label="银行开户名" prop="categoryName">
            <el-input v-model="form.categoryName" placeholder="银行开户名" />
          </el-form-item>
          <el-form-item label="结算银行开户支行名称" prop="nameSettlementBank">
            <el-input v-model="form.nameSettlementBank" placeholder="结算银行开户支行名称" />
          </el-form-item>
        </div>
      </template>
      <div class="tc" v-if="(form.storeType=='1'&&isOk) || form.storeType=='0'">
        <el-button @click="resetForm('form')">重 置</el-button>
        <el-button type="primary" :disabled="storedisable" @click="submitForm('form')">确 定</el-button>
      </div>

    </el-form>
  </div>
</template>

<script>
import { psaveStore } from '@/api/shop/index.js'
import elSelectDicts from '@/components/formBase/el-selectDicts'
import elSelectObject from '@/components/formBase/el-selectObject'
import elDrawers from '@/components/formBase/el-drawers'
export default {
  components: {
    elSelectDicts: elSelectDicts,
    elSelectObject: elSelectObject,
    elDrawers: elDrawers,
  },
  data() {
    return {
      activeName: 'first',
      form: {
        actualOfficeAddress: null,
        addPeople: null,
        attest: [],
        backId: null,
        contactMail: null,
        contactPhone: null,
        entAddress: null,
        entName: null,
        entProfile: null,
        entRegistNumber: null,
        establishmentTime: null,
        frontId: null,
        legalPerson: null,
        legalPersonId: null,
        mainBusiness: null,
        nameSettlementBank: null,
        openingBank: null,
        registeredCapital: null,
        settlementBankAccount: null,
        settlementMethod: null,
        socialCreditCode: null,
        sourceEntry: null,
        storeType: null,
      },
      rules: {
        contactPhone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value) {
                console.log(value)
                let newValue = value.replace(/[^0-9]/gi, '')
                if (value !== newValue) {
                  callback(new Error('请输入正确的手机号'))
                } else if (newValue.length !== 11) {
                  callback(new Error('请输入正确的手机号'))
                } else {
                  callback()
                }
              } else {
                callback()
              }
            },
            trigger: 'blur',
          },
        ],
        legalPersonId: [
          { required: true, message: '请输入身份证号', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value) {
                let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
                if (!reg.test(value)) {
                  callback(new Error('请输入正确的身份证号'))
                } else {
                  callback()
                }
              } else {
                callback()
              }
            },
            trigger: 'blur',
          },
        ],
        contactMail: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value) {
                let reg =
                  /^([a-zA-Z0-9_\.\-])+\@([a-zA-Z0-9\-])+\.[a-zA-Z0-9]{2,4}$/
                if (!reg.test(value)) {
                  callback(new Error('请输入邮箱'))
                } else {
                  callback()
                }
              } else {
                callback()
              }
            },
            trigger: 'blur',
          },
        ],
      },
      isOk: false,
      storedisable: false,
    }
  },
  computed: {},
  created() {
    this.form.storeType = this.$route.query.storeType
    // this.getUser()
  },
  methods: {
    /**选择小图 */
    selectMainImage(e, lable) {
      this.form[lable] = e[0].fileUrl
    },
    selectAttestImage(e, label) {
      this.form[label] = e.map((item) => {
        return { filePath: item.fileUrl }
      })
    },
    changeType(val) {
      this.form.sourceEntry = val.dictValue
    },
    handleClick(tab) {
      this.activeName = tab.name
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.storedisable = true
          psaveStore(this.form).then((response) => {
            this.storedisable = false
            this.$message.success('保存成功')
            this.close()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    /** 关闭按钮 */
    close() {
      const obj = {
        path: '/store',
        query: { t: Date.now(), pageNum: this.$route.query.pageNum },
      }
      this.$tab.closeOpenPage(obj)
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    getUser() {
      userdetail(this.id).then((response) => {
        this.user = response.data
        this.allOperationRecords = response.data.allOperationRecords
        this.userPortrait =
          response.data.latestVisitRecords.length > 0
            ? response.data.latestVisitRecords[0]
            : {}
        for (let index = 0; index < this.setplist.length; index++) {
          const element = this.setplist[index]
          if (element.status === this.user.nodeStatus) {
            this.setinde = index
            return
          }
        }
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

    .bgitem {
      padding: 5px 10px;
      background: #fbfbfb;
      border-radius: 6px;
    }
    p {
      padding: 0;
      margin: 0;
      font-weight: 700;
      font-style: normal;
      font-size: 28px;
      &::after {
        content: '';
        display: block;
        width: 100%;
        height: 1px;
        background: #c0c0c0;
        margin: 20px 0 10px;
      }
    }
  }
  .el-form-item {
    width: 31%;
  }
}
</style>