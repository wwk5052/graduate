<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> admin列表
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="addButton">
        <el-button type="primary" @click="addCase">添加管理员</el-button>
      </div>
      <el-table
        :data="tableData"
        border
        class="table"
        ref="multipleTable"
        header-cell-class-name="table-header"
      >
        <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column label="账户状态">
          <template slot-scope="scope">
            <el-tag
              :type="
                scope.row.state === '成功'
                  ? 'success'
                  : scope.row.state === '失败'
                  ? 'danger'
                  : ''
              "
            >{{ scope.row.state === 1 ? '异常' : '正常' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-tag
              :type="
                scope.row.state === '成功'
                  ? 'success'
                  : scope.row.state === '失败'
                  ? 'danger'
                  : ''
              "
            >{{ scope.row.state === 1 ? '离职' : '在职' }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="date" label="注册时间">{{ '2020-06-12' }}</el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
            <!-- <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>-->
            <el-popconfirm
              confirmButtonText="确定"
              cancelButtonText="取消"
              @onConfirm="handleDelete(scope.$index, scope.row)"
              icon="el-icon-info"
              iconColor="red"
              title="确定删除？"
              :style="{'margin-left':'10px'}"
            >
              <el-button slot="reference" type="text" icon="el-icon-delete" class="red">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :current-page="query.pageIndex"
          :page-size="query.pageSize"
          :total="pageTotal"
          @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>

    <!-- 添加弹出框 -->
    <el-dialog title="添加" :visible.sync="editVisibleAdd" width="30%">
      <el-form ref="addForm" :model="form" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="saveEditAdd">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
      <el-form ref="form" :model="form" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="form.username">{{}}</el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-popover placement="bottom" width="200" trigger="click" content="密码不支持修改，详情请联系后台管理员">
            <el-input slot="reference" disabled value="******"></el-input>
          </el-popover>
          <!-- <el-input v-model="form.password" disabled>******</el-input> -->
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchData } from '../../api/index'
export default {
  name: 'basetable',
  data() {
    return {
      query: {
        address: '',
        name: '',
        pageIndex: 1,
        pageSize: 10
      },
      tableData: [],
      multipleSelection: [],
      delList: [],
      editVisibleAdd: false,
      editVisible: false,
      pageTotal: 0,
      addForm: {},
      form: {},
      idx: -1,
      id: -1
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    getUserList() {
      this.$axios
        .get('/api/user/list')
        .then(res => {
          const resData = res.data
          if (resData.errno === 0) {
            this.tableData = resData.data
          }
        })
        .catch(err => {
          console.log('请求新闻列表失败', err)
        })
    },
    // 触发搜索按钮
    handleSearch() {
      this.$set(this.query, 'pageIndex', 1)
      this.getData()
    },
    // 删除操作
    handleDelete(index, row) {
      console.log(index, row)
      this.$axios
        .delete('/api/user/del', {
          params: {
            id: row.id
          }
        })
        .then(res => {
          console.log(res.data)
          if (res.data.errno === 0) {
            this.$message.success(res.data.message)
          } else {
            this.$message.error(res.data.message)
          }
          this.getUserList()
        })
        .catch(err => {
          this.$message.error('删除失败')
        })
      // 二次确认删除
      // this.$confirm('确定要删除吗？', '提示', {
      //   type: 'warning'
      // })
      //   .then(() => {
      //     this.$message.success('删除成功');
      //     this.tableData.splice(index, 1);
      //   })
      //   .catch(() => {});
    },
    // 编辑操作
    handleEdit(index, row) {
      this.idx = index
      this.form = row
      this.editVisible = true
      this.form = row
    },
    // 保存编辑
    saveEdit() {
      this.editVisible = false
      this.$axios
        .post('/api/user/update', this.form)
        .then(res => {
          this.getUserList()
          this.$message.success('修改成功！')
        })
        .catch(err => {
          console.log('修改失败！')
        })
    },
    // 确定添加
    saveEditAdd() {
      this.editVisibleAdd = false
      this.$axios
        .post('/api/user/reg', this.addForm)
        .then(res => {
          if (res.data.errno === 0) {
            this.getUserList()
            this.$message.success(res.data.message)
          } else {
            this.$message.error('注册失败！用户名已存在！')
          }
          this.getUserList()
          this.addForm = {}
        })
        .catch(err => {
          console.log('注册失败')
        })
    },
    // 分页导航
    handlePageChange(val) {
      this.$set(this.query, 'pageIndex', val)
      this.getData()
    },
    addCase() {
      this.editVisibleAdd = true
    }
  }
}
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #ff0000;
}
.mr10 {
  margin-right: 10px;
}
.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
.addButton {
  text-align: right;
  margin: 20px;
}
</style>
