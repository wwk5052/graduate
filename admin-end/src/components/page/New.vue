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
        <el-button type="primary" @click="addNew">添加新闻</el-button>
      </div>
      <el-table
        :data="tablePageData"
        border
        class="table"
        ref="multipleTable"
        header-cell-class-name="table-header"
      >
        <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
        <el-table-column prop="title" label="新闻标题"></el-table-column>
        <el-table-column prop="type" label="新闻类型" width="100">
          <template slot-scope="scope">
            <span>{{scope.row.type === 0 ? '公司新闻':'行业新闻'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="头像(查看大图)" align="center">
          <template slot-scope="scope">
            <el-image
              class="table-td-thumb"
              :src="scope.row.imgurl"
              :preview-src-list="[scope.row.imgurl]"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="content" width="400" label="新闻描述"></el-table-column>
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
    <el-dialog title="新闻信息" :visible.sync="editVisible" width="50%">
      <el-form ref="form" :model="form" label-width="70px">
        <el-form-item label="新闻标题">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="新闻标题">
          <el-select v-model="form.type" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="新闻描述">
          <el-input type="textarea" :rows="10" v-model="form.content"></el-input>
        </el-form-item>
        <el-form-item label="新闻图片">
          <el-input v-model="form.imgurl"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加新闻 -->
    <el-dialog title="新闻信息" :visible.sync="addVisible" width="50%">
      <el-form ref="addForm" :model="form" label-width="70px">
        <el-form-item label="新闻标题">
          <el-input v-model="addForm.title"></el-input>
        </el-form-item>
        <el-form-item label="新闻标题">
          <el-select v-model="addForm.type" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="新闻描述">
          <el-input type="textarea" :rows="10" v-model="addForm.content"></el-input>
        </el-form-item>
        <el-form-item label="新闻图片">
          <el-input v-model="addForm.imgurl"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveNewEdit">添 加</el-button>
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
      options: [
        {
          value: 0,
          label: '公司新闻'
        },
        {
          value: 1,
          label: '行业新闻'
        }
      ],
      editVisible: false,
      addVisible: false,
      form: {},
      addForm: {},
      idx: -1,
      id: -1
    }
  },
  mounted() {
    this.getNewsList()
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
    saveNewEdit() {
      this.$axios
        .post('/api/new/create', this.addForm)
        .then(res => {
          const resData = res.data
          if (resData.errno === 0) {
            this.$message.success('添加成功!')
            this.getNewsList()
            this.addVisible = false
            this.addForm = {}
          }
        })
        .catch(err => {
          this.$message.error('添加失败')
        })
    },
    getNewsList() {
      this.$axios
        .get('/api/new/list')
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
          console.log('请求新闻列表失败', err)
        })
    },
    deleteNew(proId) {
      this.$axios
        .delete('/api/new/del', {
          params: {
            id: proId
          }
        })
        .then(res => {
          const resData = res.data
          if (resData.errno === 0) {
            this.$message.success('删除成功')
            this.getNewsList()
          }
        })
        .catch(err => {
          this.$message.error('删除New失败')
        })
    },
    // 删除操作
    handleDelete(index, row) {
      // 二次确认删除
      this.$confirm('确定要删除吗？', '提示', {
        type: 'warning'
      })
        .then(() => {
          this.deleteNew(row.id)
        })
        .catch(() => {})
    },
    addNew() {
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
        .post('/api/new/update', this.form)
        .then(res => {
          const resData = res.data
          if (resData.errno === 0) {
            this.$message.success('修改成功')
            this.getNewsList()
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
  width: 200px;
  height: 100px;
}
.addButton {
  text-align: right;
  margin: 20px;
}
</style>
