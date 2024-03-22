<template>
  <div class="app-container">
    <!-- 功能 按钮 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain size="mini" @click="handleAdd()" v-hasPermi="['attribute:list:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" plain size="mini" @click="handleReturn('模板')">返回模板列表</el-button>
      </el-col>
    </el-row>
    <!-- 模板表格 -->
    <el-table v-show="type == '模板'" v-loading="loading" :data="evaluationList" @selection-change="handleSelectionChange" tooltip-effect="dark">
      <el-table-column type="index" width="55" align="center" label="序号" />
      <el-table-column label="编号" align="center" prop="id" width="170" />
      <el-table-column label="模板名称" align="center" prop="attributeCategoryName" />
      <el-table-column label="属性数量" align="center" prop="attributeCount" />
      <el-table-column label="参数数量" align="center" prop="paramCount" />
      <el-table-column label="设置" align="center" prop="phone" width="200">
        <template slot-scope="scope">
          <el-button size="mini" @click="settingHandler('属性',scope.row)">属性列表</el-button>
          <el-button size="mini" @click="settingHandler('参数',scope.row)">参数列表</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="handleUpdate('模板',scope.row, false)" v-hasPermi="['attribute:list:edit']">编辑</el-button>
          <el-button size="mini" type="text" @click="handleDelete('模板',scope.row)" v-hasPermi="['attribute:list:del']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 属性列表 -->
    <el-table v-show="type == '属性'" v-loading="loading" :data="evaluationList" @selection-change="handleSelectionChange" tooltip-effect="dark">
      <el-table-column type="index" width="55" align="center" label="序号" />
      <el-table-column label="编号" align="center" prop="id" width="170" />
      <el-table-column label="属性名称" align="center" prop="productAttributeName" />
      <el-table-column label="商品类型" align="center" prop="productAttributeCategoryName" />
      <el-table-column label="属性值" align="center" prop="inputList" />
      <el-table-column label="排序" align="center" prop="sort">
        <template slot-scope="scope">
          {{scope.row.sort}}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="handleUpdate('属性',scope.row, false)" v-hasPermi="['attribute:list:edit']">编辑</el-button>
          <el-button size="mini" type="text" @click="handleDelete('属性',scope.row)" v-hasPermi="['attribute:list:del']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 参数列表 -->
    <el-table v-show="type == '参数'" v-loading="loading" :data="evaluationList" @selection-change="handleSelectionChange" tooltip-effect="dark">
      <el-table-column type="index" width="55" align="center" label="序号" />
      <el-table-column label="编号" align="center" prop="id" width="170" />
      <el-table-column label="参数名称" align="center" prop="productAttributeName" />
      <el-table-column label="商品类型" align="center" prop="productAttributeCategoryName" />
      <el-table-column label="可选参数表" align="center" prop="inputList" />
      <el-table-column label="选择性" align="center" prop="selectType">
        <template slot-scope="scope">
          {{scope.row.selectType == 'single'?'单选':scope.row.selectType == 'multiple'?'多选':''}}
        </template>
      </el-table-column>
      <el-table-column label="录入方式" align="center" prop="inputType">
        <template slot-scope="scope">
          {{scope.row.inputType == 'select'?'从列表中选取':scope.row.inputType == 'input'?'手工录入':''}}
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="handleUpdate('参数',scope.row, false)" v-hasPermi="['attribute:list:edit']">编辑</el-button>
          <el-button size="mini" type="text" @click="handleDelete('参数',scope.row)" v-hasPermi="['attribute:list:del']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" :page-sizes="[1, 10, 20, 30]" @pagination="getList" />

    <!-- 添加或修改评价对话框 -->
    <elDialogs ref="elDialogs" :title="title" :width="'50%'">
      <template slot="form">
        <el-form ref="form" label-position="left" :rules="rules" :model="form" label-width="140px">
          <template v-if="type == '模板'">
            <el-form-item label="商品模板:" prop="attributeCategoryName">
              <el-input v-model="form.attributeCategoryName" placeholder="商品模板" />
            </el-form-item>
          </template>
          <template v-if="type == '属性'">
            <el-form-item label="属性名称:" prop="productAttributeName">
              <el-input v-model="form.productAttributeName" placeholder="属性名称" />
            </el-form-item>
            <el-form-item label="商品类型" prop="productAttributeCategoryName">
              <el-input disabled v-model="form.productAttributeCategoryName" placeholder="商品类型" />
            </el-form-item>
            <el-form-item label="属性值可选列表" prop="inputList">
              <el-input v-model="form.inputList" placeholder="属性值可选列表" />
            </el-form-item>
            <el-form-item label="手动新增属性值" prop="handAddStatus">
              <el-radio v-model="form.handAddStatus" :label="1">是</el-radio>
              <el-radio v-model="form.handAddStatus" :label="0">否</el-radio>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
              <el-input-number v-model="form.sort" :min="0" label="排序"></el-input-number>
            </el-form-item>
          </template>
          <template v-if="type == '参数'">
            <el-form-item label="参数名称:" prop="productAttributeName">
              <el-input v-model="form.productAttributeName" placeholder="参数名称" />
            </el-form-item>
            <el-form-item label="商品类型" prop="productAttributeCategoryName">
              <el-input disabled v-model="form.productAttributeCategoryName" placeholder="商品类型" />
            </el-form-item>
            <el-form-item label="参数值录入方式" prop="inputType">
              <el-radio v-model="form.inputType" label="input">手工录入</el-radio>
              <el-radio v-model="form.inputType" label="select">从下面列表中选择</el-radio>
            </el-form-item>
            <template v-if="form.inputType=='select'">
              <el-form-item label="参数值可选列表" prop="inputList">
                <el-input v-model="form.inputList" placeholder="参数值可选列表" />
              </el-form-item>
              <el-form-item label="是否支持手动新增" prop="handAddStatus">
                <el-radio v-model="form.handAddStatus" :label="1">是</el-radio>
                <el-radio v-model="form.handAddStatus" :label="0">否</el-radio>
              </el-form-item>
              <el-form-item label="参数值选择性" prop="selectType">
                <el-radio v-model="form.selectType" label="single">单选</el-radio>
                <el-radio v-model="form.selectType" label="multiple">多选</el-radio>
              </el-form-item>
            </template>
            <el-form-item label="排序" prop="sort">
              <el-input-number v-model="form.sort" :min="0" label="排序"></el-input-number>
            </el-form-item>
          </template>
        </el-form>
      </template>
      <template slot="submit">
        <el-button type="primary" @click="submitHandle(type)">确 定</el-button>
      </template>
    </elDialogs>
  </div>
</template>

<script>
import {
  battributelist,
  battributesave,
  battributedelete,
  battribute2list,
  battribute2save,
  battribute2delete,
} from '@/api/shop/index.js'
import elDatePicker from '@/components/formBase/el-datePicker'
import elSelectDicts from '@/components/formBase/el-selectDicts'
import elSelectObject from '@/components/formBase/el-selectObject'
import elDialogs from '@/components/formBase/el-dialogs'
export default {
  name: 'Evaluation',
  components: {
    elDatePicker: elDatePicker,
    elSelectDicts: elSelectDicts,
    elDialogs: elDialogs,
    elSelectObject: elSelectObject,
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
      title: '新增/编辑',
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        productAttributeCategoryId: null, //属性分类id，即外层列表id
        type: null, //属性的类型：attribute-属性；params-参数
      },
      // 表单参数
      form: {},
      type: '模板', // 添加按钮的类型
      options: [],
      brandoptions: [],
      ids: [],
      showAudit: false,
      rules: {
        attributeCategoryName: [
          { required: true, message: '请输入', trigger: 'blur' },
        ],
        productAttributeName: [
          { required: true, message: '请输入', trigger: 'blur' },
        ],
        inputList: [{ required: true, message: '请输入', trigger: 'blur' }],
        inputType: [{ required: true, message: '请选择', trigger: 'change' }],
        handAddStatus: [
          { required: true, message: '请选择', trigger: 'change' },
        ],
        selectType: [{ required: true, message: '请选择', trigger: 'change' }],
      },
      options: [
        { name: '一级分类', value: 0 },
        { name: '二级分类', value: 1 },
      ],
    }
  },
  created() {
    this.getList()
  },
  methods: {
    change(e, ind) {
      console.log(e, ind)
    },
    handleReturn(type) {
      this.type = type
      this.queryParams.pageNum = 1
      this.getList()
    },
    // 添加
    handleAdd() {
      this.title = '添加' + this.type
      if (this.type == '模板') {
      }
      if (this.type == '属性') {
        let params = {
          productAttributeCategoryId: this.form.productAttributeCategoryId, //商品属性分类id
          productAttributeCategoryName: this.form.productAttributeCategoryName, //属性分类名称
          productAttributeName: null, //属性名称
          inputList: null, //属性值
          handAddStatus: 1, //是否支持手动新增；0->不支持；1->支持
          sort: 1, //排序字段
          type: this.queryParams.type,
        }
        this.form = { ...params }
      }
      if (this.type == '参数') {
        let params = {
          id: null,
          productAttributeCategoryId: this.form.productAttributeCategoryId, //商品属性分类id
          productAttributeCategoryName: this.form.productAttributeCategoryName, //属性分类名称
          productAttributeName: null, //参数名称
          inputType: 'input',
          inputList: null, //属性值
          handAddStatus: 0, //是否支持手动新增；0->不支持；1->支持
          selectType: 'single', //参数选择类型：single-单选；multiple-多选
          sort: 1, //排序字段
          type: this.queryParams.type,
        }
        this.form = { ...params }
      }
      this.$refs.elDialogs.dialog = true
    },
    /** 删除按钮操作 */
    handleDelete(type, row) {
      this.type = type
      let title = `是否删除已选数据`
      const ids = row.id || this.ids.join(',')
      this.$modal
        .confirm(title)
        .then(function () {
          if (type == '模板') {
            return battributedelete(row.id)
          }
          if (type == '属性' || type == '参数') {
            return battribute2delete(row.id)
          }
        })
        .then(() => {
          if (type == '模板') {
            this.handleQuery()
            this.$modal.msgSuccess('删除成功')
          }
          if (type == '属性' || type == '参数') {
            this.queryParams.pageNum = 1
            this.getList2()
            this.$modal.msgSuccess('删除成功')
          }
        })
    },
    // table 设置项按钮点击事件
    settingHandler(type, row) {
      this.type = type
      this.queryParams.pageNum = 1
      this.queryParams.productAttributeCategoryId = row.id
      if (type == '属性') {
        this.queryParams.type = 'attribute'
        this.form.productAttributeCategoryId = row.id
        this.form.productAttributeCategoryName = row.attributeCategoryName
      }
      if (type == '参数') {
        this.queryParams.type = 'params'
        this.form.productAttributeCategoryId = row.id
        this.form.productAttributeCategoryName = row.attributeCategoryName
      }
      this.getList2()
    },
    /** 查看按钮操作 */
    handleUpdate(type, row, val) {
      this.type = type
      const id = row.id
      this.title = '编辑' + type
      this.form = { ...row }
      this.$refs.elDialogs.dialog = true
    },
    // 确认按钮
    submitHandle(type) {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (type == '模板') {
            battributesave(this.form).then(() => {
              this.$modal.msgSuccess('操作成功')
              this.$refs.elDialogs.dialog = false
              this.queryParams.pageNum = 1
              this.getList()
            })
          }
          if (type == '属性' || type == '参数') {
            battribute2save(this.form).then(() => {
              this.$modal.msgSuccess('操作成功')
              this.$refs.elDialogs.dialog = false
              this.queryParams.pageNum = 1
              this.queryParams.productAttributeCategoryId =
                this.form.productAttributeCategoryId
              this.getList2()
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 评价时间选择
    changeDate(time) {
      this.queryParams.startDate = time[0]
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
      battributelist(this.queryParams).then((response) => {
        this.evaluationList = response.data.records
        this.total = response.data.total
        this.loading = false
      })
    },
    /** 查询评价列表 */
    getList2() {
      this.loading = true
      battribute2list(this.queryParams).then((response) => {
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
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        'pc/wechat/export',
        {
          ...this.queryParams,
        },
        `评价列表_${new Date().getTime()}.xlsx`
      )
    },
  },
}
</script>
