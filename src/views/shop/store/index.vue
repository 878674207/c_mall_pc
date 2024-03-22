<template>
  <div class="app-container">
    <!-- 店铺管理 查询表单 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="88px">
      <el-form-item label="店铺账号" prop="storeAccount">
        <el-input v-model="queryParams.storeAccount" placeholder="请输入店铺账号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="店铺类型" prop="storeType">
        <elSelectDicts :value="queryParams.storeType" placeholder="店铺类型" dictValue="store_type" valueLabel="storeType" @change="changeType" />
      </el-form-item>
      <el-form-item label="店铺状态" prop="storeStatus">
        <elSelectDicts :value="queryParams.storeStatus" placeholder="店铺状态" dictValue="store_status" valueLabel="storeStatus" @change="changeType" />
      </el-form-item>
      <el-form-item label="店铺负责人" prop="storeContactPerson">
        <el-input v-model="queryParams.storeContactPerson" placeholder="请输入店铺负责人" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="入驻时间" prop="endTime">
        <elDatePicker :begDate="queryParams.endTime" @change="changeDate" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">
          搜索
        </el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">
          重置
        </el-button>
      </el-form-item>
    </el-form>
    <!-- 功能 按钮 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain size="mini" @click="handleAdd" v-hasPermi="['store:list:add']">添加</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <!-- 表格 -->
    <el-table v-loading="loading" :data="evaluationList">
      <el-table-column type="index" label="序号" width="55" align="center" />
      <el-table-column label="店铺名称" align="center" prop="storeName" />
      <el-table-column label="店铺类型" align="center" prop="storeType">
        <template slot-scope="scope">
          {{ scope.row.storeType === "0" ? "自营" : "入驻" }}
        </template>
      </el-table-column>
      <el-table-column label="店铺账号" align="center" prop="storeAccount" width="110" />
      <el-table-column label="店铺状态" align="center" prop="storeStatus">
        <template slot-scope="scope">
          {{ scope.row.storeStatus === "0" ? "正常" : "停用" }}
        </template>
      </el-table-column>
      <el-table-column label="店铺负责人" align="center" prop="storeContactPerson" />
      <el-table-column label="联系人电话" align="center" prop="contactPhone" />
      <el-table-column label="入驻时间" align="center" prop="addTime" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="100">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="handleUpdate(scope.row, false)" v-hasPermi="['store:list:detail']">查看</el-button>
          <el-button size="mini" type="text" @click="handleComfig(scope.row, false)" v-hasPermi="['store:list:comfig']">管理</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" :page-sizes="[1, 10, 20, 30]" @pagination="getList" />
    <!-- 选择入驻类型 -->
    <el-dialog title="选择店铺类型" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <div class="flex align-c">
        <p style="padding-right: 20px">店铺类型:</p>
        <el-select v-model="storeType" placeholder="请选择店铺类型">
          <el-option label="自营" value="0"></el-option>
          <el-option label="入驻" value="1"></el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="comfigHandel">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 管理操作的弹框 -->
    <el-dialog title="管理" :visible.sync="storedialogVisible" width="40%" :before-close="handleClose">
      <div class="flex align-c">
        <p style="width: 100px">店铺状态:</p>
        <el-radio v-model="form.storeStatus" :label="item.dictValue" v-for="item in storeoptions" :key="item.dictValue">{{ item.dictLabel }}</el-radio>
      </div>
      <div class="flex align-c" v-if="form.storeStatus === '1'">
        <p style="width: 100px">禁用理由:</p>
        <el-input v-model="form.forbidReason" placeholder="请输入禁用理由" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="storedialogVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="storedisabled" @click="comfigStoreHandel">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { pstorepage, storeforbid } from '@/api/shop/index.js'
import elSelectDicts from '@/components/formBase/el-selectDicts'
import elDatePicker from '@/components/formBase/el-datePicker'
export default {
  name: 'Store',
  components: {
    elSelectDicts: elSelectDicts,
    elDatePicker: elDatePicker,
  },
  data() {
    return {
      dialogVisible: false,
      storedialogVisible: false,
      // 遮罩层
      loading: true,
      // 非单个禁用
      showSearch: true,
      // 总条数
      total: 0,
      // 评价表格数据
      evaluationList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        storeAccount: null,
        storeType: null,
        storeStatus: null,
        storeContactPerson: null,
        endTime: null,
        startTime: null,
      },
      storeType: null, //弹框选择店铺类型
      storeoptions: [],
      form: {},
      storedisabled: false, //禁用按钮
    }
  },
  created() {
    this.getList()
    this.DictList()
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
    DictList() {
      this.getDicts('store_status').then((res) => {
        this.storeoptions = res.data
      })
    },
    /** 管理按钮操作 */
    handleComfig(row) {
      this.storedialogVisible = true
      this.form = {
        id: row.id,
        storeStatus: row.storeStatus,
        forbidReason: null,
      }
    },
    /** 查看按钮操作 */
    handleUpdate(row, val) {
      this.$router.push('/shop/store/detail?id=' + row.id)
    },
    changeType(val, label, dictLabel) {
      if (dictLabel) {
        this.queryParams[label] = val[dictLabel]
      } else {
        this.queryParams[label] = val.dictValue
      }
      // this.queryParams.pageNum = 1
      // this.getList()
    },
    /** 查询评价列表 */
    getList() {
      this.loading = true
      pstorepage(this.queryParams).then((response) => {
        this.evaluationList = response.data.records
        this.total = response.data.total
        this.loading = false
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.queryParams.startTime = null
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.dialogVisible = true
    },
    handleClose() {
      this.dialogVisible = false
      this.storedialogVisible = false
    },
    // 下单时间选择
    changeDate(time) {
      this.queryParams.startTime = time[0]
      this.queryParams.endTime = time[1]
      // this.queryParams.pageNum = 1
      // this.getList()
    },
    comfigStoreHandel() {
      this.storedisabled = true
      storeforbid(this.form).then((res) => {
        this.$message.success('操作成功')
        this.getList()
        this.storedialogVisible = false
        this.storedisabled = false
      })
    },
    comfigHandel() {
      if (this.storeType == null) {
        this.$message.error('请选择店铺类型')
        return
      } else {
        this.dialogVisible = false
        this.$router.push('/shop/store/settleIn?storeType=' + this.storeType)
      }
    },
  },
}
</script>
