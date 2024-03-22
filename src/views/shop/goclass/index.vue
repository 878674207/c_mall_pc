<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          size="mini"
          @click="handleAdd"
          v-hasPermi="['goclass:list:add']"
          >新增</el-button
        >
      </el-col>
    </el-row>
    <el-table
      :data="dataList"
      size="medium"
      style="width: 100%"
      border
      v-loading="loading"
      class="table"
      :row-key="tableRowKey"
      :expand-row-keys="expandRowKeys"
      @expand-change="tableExpandChange"
      @row-click="tableExpandChange"
      :row-class-name="tableRowClassName"
    >
      <el-table-column type="expand" width="55">
        <template slot-scope="scope">
          <!-- 自定义编写 -->
          <div class="expand-content">
            <template v-if="CurRowList.length > 0">
              <div
                class="flex"
                v-for="(cur, index) in CurRowList"
                :key="cur.id"
              >
                <div class="cell" style="flex: 0 0 55px"></div>
                <div class="cell" style="flex: 0 0 55px">{{ index + 1 }}</div>
                <div class="cell" style="flex: 1">{{ cur.categoryName }}</div>
                <div class="cell" style="flex: 1">
                  {{ cur.level === 0 ? "一级" : "二级" }}
                </div>
                <div class="cell" style="flex: 1">
                  <el-switch
                    v-model="cur.showStatus"
                    active-color="#13ce66"
                    :active-value="1"
                    :inactive-value="0"
                    @change="changeStatus(cur, scope.row)"
                  />
                </div>
                <div class="cell" style="flex: 1">{{ cur.sort }}</div>
                <div
                  class="cell"
                  style="
                    flex: 0 0 250px;
                    text-align: right;
                    padding-right: 10px;
                  "
                >
                  <el-button
                    type="text"
                    icon="el-icon-edit"
                    size="small"
                    @click.stop="childEdit(cur, scope.row)"
                    v-hasPermi="['goclass:list:edit']"
                    >编辑</el-button
                  >
                  <el-button
                    type="text"
                    icon="el-icon-delete"
                    size="small"
                    @click.stop="del(cur, scope.row)"
                    v-hasPermi="['goclass:list:del']"
                    >删除</el-button
                  >
                </div>
              </div>
            </template>
            <template v-else>
              <div style="text-align: center">暂无子级</div>
            </template>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="编号" type="index" width="55"> </el-table-column>
      <el-table-column
        label="分类名称"
        show-overflow-tooltip
        prop="categoryName"
      >
      </el-table-column>
      <el-table-column label="级别">
        <template slot-scope="scope">
          <span>{{ scope.row.level === 0 ? "一级" : "二级" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="是否显示"
        show-overflow-tooltip
        prop="personTotal"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.showStatus"
            active-color="#13ce66"
            :active-value="1"
            :inactive-value="0"
            @change="changeStatus(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="排序" show-overflow-tooltip prop="sort">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="right"
        width="250"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            icon="el-icon-view"
            size="small"
            @click.stop="tableExpandChange(scope.row)"
            >下级</el-button
          >
          <el-button
            type="text"
            icon="el-icon-edit"
            size="small"
            @click.stop="
              edit(scope.row, 1, true, scope.row), (title = '添加子级')
            "
            v-hasPermi="['goclass:list:add']"
            >添加子级</el-button
          >
          <el-button
            type="text"
            icon="el-icon-edit"
            size="small"
            @click.stop="edit(scope.row, scope.row.level), (title = '编辑分类')"
            v-hasPermi="['goclass:list:edit']"
            >编辑</el-button
          >
          <el-button
            type="text"
            icon="el-icon-delete"
            size="small"
            @click.stop="del(scope.row)"
            v-hasPermi="['goclass:list:del']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      :page-sizes="[1, 10, 20, 30]"
      @pagination="getList"
    />
    <!-- 添加或修改评价对话框 -->
    <elDrawers ref="drawer" :title="title">
      <template slot="form">
        <el-form
          ref="form"
          :inline="true"
          :model="form"
          :rules="rules"
          label-width="80px"
          class="demo-form-inline"
        >
          <el-form-item label="分类名称" prop="categoryName">
            <el-input v-model="form.categoryName" placeholder="分类名称" />
          </el-form-item>
          <el-form-item label="分类级别" prop="level">
            <elSelectObject
              :options="options"
              :value="form.level"
              :disabled="leveldisabled"
              placeholder="分类级别"
              dictValue="sys_user_sex"
              valueLabel="level"
              @change="changeType"
            />
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input-number
              v-model="form.sort"
              :min="0"
              label="排序"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="是否显示" prop="showStatus">
            <el-radio v-model="form.showStatus" :label="1">显示</el-radio>
            <el-radio v-model="form.showStatus" :label="0">不显示</el-radio>
          </el-form-item>
          <el-form-item label="关键词" prop="keywords">
            <el-input v-model="form.keywords" placeholder="关键词" />
          </el-form-item>
          <el-form-item label="图标" prop="icon" v-if="form.level === 1">
            <ImageUpload
              :limit="1"
              :value="form.iconurl"
              @input="selectMainImage"
            />
          </el-form-item>
        </el-form>
      </template>
      <template slot="submit">
        <el-button type="primary" @click="handleAudit()">确认</el-button>
      </template>
    </elDrawers>
  </div>
</template>
<script>
import {
  categorypagelist,
  categorylist,
  bcategorysave,
  bcategorydelete,
} from "@/api/shop/index.js";
import elDatePicker from "@/components/formBase/el-datePicker";
import elSelectDicts from "@/components/formBase/el-selectDicts";
import elSelectObject from "@/components/formBase/el-selectObject";
import elDrawers from "@/components/formBase/el-drawers";
export default {
  name: "Goclass",
  components: {
    elDatePicker: elDatePicker,
    elSelectDicts: elSelectDicts,
    elSelectObject: elSelectObject,
    elDrawers: elDrawers,
  },
  data() {
    return {
      searchForm: {
        areaStatus: "0",
        responsibilityTeam: "",
      },
      loading: false,
      areaStatusList: [
        {
          label: "全部",
          value: "0",
        },
        {
          label: "新增",
          value: "1",
        },
        {
          label: "已删除",
          value: "2",
        },
      ], // 区域状态
      responsibilityTeamList: [], // 责任区队
      dataList: [],
      CurRowList: [], // 二级的数据
      tableRowKey: "id",
      expandRowKeys: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 总条数
      total: 0,
      // 弹出层标题
      title: "添加分类",
      // 表单参数
      form: {
        id: null,
        parentId: null,
        categoryName: null,
        level: null,
        showStatus: 0,
        sort: null,
        keywords: null,
        icon: null,
        iconurl: null,
      },
      options: [
        { name: "一级分类", value: 0 },
        { name: "二级分类", value: 1 },
      ],
      leveldisabled: true,
      rules: {
        categoryName: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
        level: [
          { required: true, message: "请选择分类级别", trigger: "change" },
        ],
        showStatus: [
          { required: true, message: "请选择是否展示", trigger: "change" },
        ],
        icon: [{ required: true, message: "请上传分类图标", trigger: "blur" }],
      },
      copeyform: null,
      isnoView: false,
    };
  },
  mounted() {
    this.getList();
  },
  computed: {},
  methods: {
    changeStatus(row, parent) {
      // 修改显示状态
      let params = { id: row.id, showStatus: row.showStatus };
      bcategorysave(params).then(() => {
        this.$modal.msgSuccess("修改成功");
        if (row.level == 1) {
          // 如果是1级分类，则刷新1级分类列表
          categorylist(parent.id).then((response) => {
            this.CurRowList = response.data;
          });
        } else {
          this.queryParams.pageNum = 1;
          this.getList();
        }
      });
    },
    /** 确认操作 */
    handleAudit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          bcategorysave(this.form).then((response) => {
            this.$modal.msgSuccess("新增成功");
            this.$refs.drawer.drawer = false;
            if (this.isnoView) {
              categorylist(this.copeyform.id).then((response) => {
                this.CurRowList = response.data;
              });
            } else {
              this.queryParams.pageNum = 1;
              this.getList();
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /**选择小图 */
    selectMainImage(e) {
      console.log(e);
      this.form.iconurl = e;
      this.form.icon = e.length > 0 ? e[0].fileUrl : null;
    },
    changeType(val, label) {
      this.form[label] = val.value;
    },
    handleAdd() {
      this.title = "添加分类";
      this.$refs.drawer.drawer = true;
      this.form = {
        id: null,
        parentId: null,
        categoryName: null,
        level: 0,
        showStatus: 0,
        sort: null,
        keywords: null,
        icon: null,
        iconurl: null,
      };
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      categorypagelist(this.queryParams)
        .then((response) => {
          this.dataList = response.data.records;
          this.total = response.data.total;
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    childEdit(row, parent) {
      this.title = "编辑分类";
      // 如果是1级分类，新增或编辑时 默认选择一级
      this.isnoView = true;
      this.copeyform = { ...parent };
      this.form = { ...row };
      this.form.iconurl = [{ name: "图标", fileUrl: row.icon }];
      this.$refs.drawer.drawer = true;
    },
    // 编辑 isnoView是否回显 是否需要调用查看详情接口
    edit(row, level, isnoView, parent) {
      // 如果是1级分类，新增或编辑时 默认选择一级
      this.isnoView = isnoView ? isnoView : false;
      if (isnoView) {
        // 是否需要调用 categorylist
        this.form = {
          id: null,
          parentId: row.id,
          categoryName: null,
          level: level,
          showStatus: 0,
          sort: null,
          keywords: null,
          icon: null,
          iconurl: [],
        };
        this.copeyform = { ...parent };
        this.$refs.drawer.drawer = true;
      } else {
        this.form = { ...row };
        this.form.iconurl = [{ name: "图标", fileUrl: row.icon }];
        this.form.level = level;
        this.$refs.drawer.drawer = true;
      }
    },
    // 删除
    del(row, parent) {
      this.$confirm(`确定删除所选项吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        bcategorydelete(row.id).then(() => {
          if (row.level == 1) {
            // 删除二级分类
            categorylist(parent.id).then((response) => {
              this.CurRowList = response.data;
            });
          } else {
            this.queryParams.pageNum = 1;
            this.getList();
          }
        });
      });
    },
    // 展开行
    tableExpandChange(expandedRows) {
      categorylist(expandedRows.id).then((response) => {
        this.CurRowList = response.data;
        this.expandCurRow(expandedRows);
      });
    },
    // 点击展开/收缩当前行
    expandCurRow(row) {
      if (this.expandRowKeys.length) {
        // 点击已展开的行 就要收起
        if (this.expandRowKeys.indexOf(row[this.tableRowKey]) >= 0) {
          this.expandRowKeys = [];
          return;
        }
      }
      this.expandRowKeys = [row[this.tableRowKey]];
    },
    tableRowClassName({ row, rowIndex }) {
      return "warning-row";
    },
  },
};
</script>
<style lang="scss" scoped>
.expand-content {
}
</style>
