<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="资讯ID" prop="id">
        <el-input v-model="queryParams.id" placeholder="请输入资讯ID" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="资讯标题" prop="title">
        <el-input v-model="queryParams.title" placeholder="请输入资讯标题" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="状态" clearable style="width: 240px">
          <el-option v-for="dict in dict.type.sys_info_status" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="上架时间" prop="groundingTime">
        <el-date-picker clearable v-model="queryParams.groundingTime" type="date" value-format="yyyy-MM-dd" placeholder="请选择上架时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="发布时间">
        <el-date-picker v-model="dateRange" style="width: 240px" value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" size="mini" @click="handleAdd" v-hasPermi="['custom:info:add']">新增</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['custom:info:edit']"
        >修改</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button type="danger" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['custom:info:remove']">批量删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" size="mini" @click="handleExport" v-hasPermi="['custom:info:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="infoList" @selection-change="handleSelectionChange" tooltip-effect="dark">
      <el-table-column type="selection" width="55" align="center" :selectable="selectable" />
      <!--      <el-table-column label="主键id" align="center" prop="id" />-->
      <el-table-column label="资讯ID" align="center" prop="id" width="80" />
      <el-table-column label="资讯标题" align="center" prop="title" show-overflow-tooltip />
      <!-- <el-table-column label="资讯内容" align="center">
        <template #default="scope">
          <div v-html="scope.row.content"/>
        </template>
      </el-table-column> -->
      <el-table-column label="填写人" align="center" prop="writeBy" width="150" />
      <el-table-column label="状态" align="center" width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.status != 1 ? "下架" : "上架" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上架时间" align="center" prop="groundingTime" width="180">
        <template slot-scope="scope">
          <span>{{
            parseTime(scope.row.groundingTime, "{y}-{m}-{d} {h}:{m}:{s}")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="阅读量" align="center" prop="reading" width="100" />
      <el-table-column label="图片链接" align="center" prop="imageUrl" width="150">
        <template slot-scope="scope">
          <img :src="scope.row.imageUrl" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="handleDetail(scope.row)" v-hasPermi="['custom:info:edit']">查看</el-button>
          <el-button size="mini" type="text" @click="handleUpdate(scope.row)" v-hasPermi="['custom:info:edit']" v-if="scope.row.status === '0'">修改</el-button>
          <el-button size="mini" type="text" @click="handleStatus(scope.row)" v-hasPermi="['custom:info:edit']">
            <span>{{ scope.row.status != 1 ? "上架" : "下架" }}</span>
          </el-button>
          <el-button size="mini" type="text" @click="handleDelete(scope.row)" v-hasPermi="['custom:info:remove']" v-if="scope.row.status === '0'">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改资讯管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="900px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="资讯标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入资讯标题" />
        </el-form-item>
        <!-- <el-form-item label="图片链接" prop="imageUrl">
          <el-input v-model="form.imageUrl" placeholder="请输入图片链接" />
        </el-form-item> -->
        <el-form-item label="咨询logo" prop="imageUrl">
          <ImageUpload :limit="1" :value="form.imageUrls" @input="selectMainImage" />
        </el-form-item>
        <el-form-item label="资讯内容" prop="content">
          <editor v-model="form.content" :min-height="192" />
        </el-form-item>
        <!-- <el-form-item label="填写人" prop="writeBy">
          <el-input v-model="form.writeBy" placeholder="请输入填写人" disabled />
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" v-show="showButton">确 定</el-button>
        <el-button @click="cancel" v-show="showButton">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listInfo,
  getInfo,
  delInfo,
  addInfo,
  updateInfo,
} from '@/api/custom/info'
import cache from '@/plugins/cache'

export default {
  name: 'Info',
  dicts: ['sys_info_status'],
  data() {
    return {
      showButton: true,
      // 日期范围
      dateRange: [],
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
      // 资讯管理表格数据
      infoList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: null,
        title: null,
        content: null,
        writeBy: null,
        status: null,
        publishTime: null,
        groundingTime: null,
        reading: null,
        imageUrl: null,
        imageUrls: [],
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [{ required: true, message: '请输入资讯标题', trigger: 'blur' }],
        imageUrl: [
          { required: true, message: '请输入资讯内容', trigger: 'blur' },
        ],
        content: [
          { required: true, message: '请输入资讯内容', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /**选择小图 */
    selectMainImage(e) {
      console.log(e)
      this.form.imageUrls = e
      this.form.imageUrl = null
      if (e.length > 0) {
        this.form.imageUrl = e[0].fileUrl
      }
    },
    /** 查询资讯管理列表 */
    getList() {
      this.loading = true
      listInfo(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          this.infoList = response.rows
          this.total = response.total
          this.loading = false
        }
      )
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        title: null,
        content: null,
        writeBy: null,
        status: null,
        publishTime: null,
        groundingTime: null,
        reading: null,
        imageUrl: null,
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    selectable(row) {
      return row.status === '0'
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.showButton = true
      this.reset()
      this.open = true
      this.title = '添加资讯管理'
    },
    /** 查看按钮操作 */
    handleDetail(row) {
      this.showButton = false
      this.reset()
      const id = row.id || this.ids
      getInfo(id).then((response) => {
        this.form = response.data
        this.open = true
        this.title = '查看资讯管理'
        this.form.imageUrls = [{ fileUrl: this.form.imageUrl }]
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.showButton = true
      this.reset()
      const id = row.id || this.ids
      getInfo(id).then((response) => {
        this.form = response.data
        this.form.imageUrls = [{ fileUrl: this.form.imageUrl }]
        this.open = true
        this.title = '修改资讯管理'
      })
    },
    handleStatus(row) {
      let params = JSON.parse(JSON.stringify(row))
      if (params.status === '1') {
        params.status = '0'
      } else {
        params.status = '1'
      }

      this.$modal
        .confirm(`是否${params.status === '0' ? '下架' : '上架'}该条数据？`)
        .then(function () {
          return updateInfo(params)
        })
        .then(() => {
          this.$modal.msgSuccess(
            params.status === '0' ? '下架' : '上架' + '成功'
          )
          this.handleQuery()
        })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateInfo(this.form).then((response) => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addInfo(this.form).then((response) => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids
      this.$modal
        .confirm('是否删除已选数据？')
        .then(function () {
          return delInfo(ids)
        })
        .then(() => {
          this.handleQuery()
          this.$modal.msgSuccess('删除成功')
        })
        .catch(() => {})
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        'custom/info/export',
        {
          ...this.queryParams,
        },
        `info_${new Date().getTime()}.xlsx`
      )
    },
  },
}
</script>
