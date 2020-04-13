<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 表单管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="container">
      <div class="addButton">
        <el-button type="primary" @click="addProduct">添加产品</el-button>
      </div>
      <el-table
        :data="tablePageData"
        border
        class="table"
        ref="multipleTable"
        header-cell-class-name="table-header"
      >
        <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
        <el-table-column prop="title" label="产品标题"></el-table-column>
        <el-table-column label="头像(查看大图)" align="center">
          <template slot-scope="scope">
            <el-image
              class="table-td-thumb"
              :src="scope.row.thumb"
              :preview-src-list="[scope.row.thumb]"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="content" width="400" label="产品描述"></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :page-size="size"
          :total="total"
          :current-page="current"
          @current-change="onPageIndexChange"
        />
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="产品信息" :visible.sync="editVisible" width="50%">
      <el-form ref="form" :model="form" label-width="70px">
        <el-form-item label="产品标题">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="产品描述">
          <el-input type="textarea" :rows="10" v-model="form.content"></el-input>
        </el-form-item>
        <el-form-item label="产品图片">
          <el-input v-model="form.imgurl"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加产品 -->
    <el-dialog title="产品信息" :visible.sync="addVisible" width="50%">
      <el-form ref="addForm" :model="form" label-width="70px">
        <el-form-item label="产品标题">
          <el-input v-model="addForm.title"></el-input>
        </el-form-item>
        <el-form-item label="产品描述">
          <el-input type="textarea" :rows="10" v-model="addForm.content"></el-input>
        </el-form-item>
        <el-form-item label="产品图片">
          <el-input v-model="addForm.imgurl"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveProductEdit">添 加</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      size: 5,
      current: 1,
      pageTotal: 0,
      tableData: [],
      editVisible: false,
      addVisible: false,
      form: {},
      addForm: {},
      idx: -1,
      id: -1
    }
  },
  mounted() {
    this.getProductsList()
  },
  computed: {
    total() {
      return this.tableData.length
    },
    tablePageData() {
      let start = (this.current - 1) * this.size
      let end = start + this.size
      return this.tableData.slice(start, end)
    }
  },
  methods: {
    saveProductEdit() {
      this.$axios
        .post('/api/pro/add', this.addForm)
        .then(res => {
          const resData = res.data
          if (resData.errno === 0) {
            this.$message.success('添加成功!')
            this.getProductsList()
            this.addVisible = false
            this.addForm = {}
          }
        })
        .catch(err => {
          this.$message.error('添加失败')
        })
    },
    getProductsList() {
      this.$axios
        .get('/api/pro/list')
        .then(res => {
          const resData = res.data
          if (resData.errno === 0) {
            this.tableData = resData.data
            this.size = 5
            this.current = 1
            this.pageTotal = 0
          }
        })
        .catch(err => {
          console.log('请求产品列表失败', err)
        })
    },
    deleteProduct(proId) {
      this.$axios
        .delete('/api/pro/del', {
          params: {
            id: proId
          }
        })
        .then(res => {
          const resData = res.data
          if (resData.errno === 0) {
            this.$message.success('删除成功')
            this.getProductsList()
          }
        })
        .catch(err => {
          this.$message.error('删除product失败')
        })
    },
    // 删除操作
    handleDelete(index, row) {
      // 二次确认删除
      this.$confirm('确定要删除吗？', '提示', {
        type: 'warning'
      })
        .then(() => {
          this.deleteProduct(row.id)
          // this.tableData.splice(index, 1)
        })
        .catch(() => {})
    },
    addProduct() {
      this.addVisible = true
    },
    // 编辑操作
    handleEdit(index, row) {
      this.idx = row.id
      this.form = row
      this.editVisible = true
    },
    // 保存编辑
    saveEdit() {
      this.$axios
        .post('/api/pro/update', this.form)
        .then(res => {
          const resData = res.data
          if (resData.errno === 0) {
            this.$message.success('修改成功')
            this.getProductsList()
            this.editVisible = false
          }
        })
        .catch(err => {
          this.$message.error('修改失败')
        })
    },
    // 分页导航
    onPageIndexChange(index) {
      this.current = index
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
