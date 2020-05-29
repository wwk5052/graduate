<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="20">
        <el-card shadow="hover" class="mgb20" style="height:250px;margin:20px;">
          <div class="user-info">
            <img src="../../assets/img/img.jpg" class="user-avator" alt />
            <div class="user-info-cont">
              <div class="user-info-name">{{name}}</div>
              <div>{{role}}</div>
            </div>
          </div>
          <div class="user-info-list">
            上次登录时间：
            <span>2020-06-02</span>
          </div>
          <div class="user-info-list">
            上次登录地点：
            <span>陕西 西安</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="20">
        <el-card shadow="hover" style="height:400px;margin:20px;">
          <div slot="header" class="clearfix">
            <span>待办事项</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="handleAddTodo">添加</el-button>
          </div>
          <el-table :show-header="false" :data="todoList" style="width:100%;">
            <el-table-column width="40">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.status" @change="todoStatusChange(scope.row)"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <div
                  class="todo-item"
                  :class="{'todo-item-del': scope.row.status}"
                >{{scope.row.title}}</div>
              </template>
            </el-table-column>
            <el-table-column width="100">
              <template slot-scope="scope">
                <i class="el-icon-edit editIcon" @click="handleEditTodo(scope.row)"></i>
                <i class="el-icon-delete editIcon" @click="handleDeleteTodo(scope.row.id)"></i>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <!-- 待办事项编辑框 -->
    <el-dialog title="待办详情" :visible.sync="editVisible" width="50%">
      <el-form ref="form" :model="form" label-width="70px">
        <el-form-item label="待办内容">
          <el-input type="textarea" :rows="10" v-model="form.title"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible=false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 待办事项添加弹框 -->
    <el-dialog title="待办详情" :visible.sync="visible" width="50%">
      <el-form ref="form" :model="addForm" label-width="70px">
        <el-form-item label="待办内容">
          <el-input type="textarea" :rows="10" v-model="addForm.title"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="saveAdd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import bus from '../common/bus'
export default {
  name: 'dashboard',
  data() {
    return {
      visible: false,
      editVisible: false,
      form: {},
      addForm: {},
      name: localStorage.getItem('ms_username'),
      todoList: []
    }
  },
  created() {
    this.getTodoList()
  },
  computed: {
    role() {
      return this.name === 'root' ? '超级管理员' : '普通用户'
    }
  },

  methods: {
    getTodoList() {
      this.$axios
        .get('/api/todo/list')
        .then(res => {
          const resData = res.data
          if (resData.errno === 0) {
            this.todoList = resData.data
          } else {
            this.$message.error('请求todo列表失败！')
          }
        })
        .catch(err => {
          this.$message.error('获取todo列表失败！')
        })
    },
    handleEditTodo(detail) {
      this.form = detail
      this.editVisible = true
    },
    saveEdit() {
      this.$axios
        .post('/api/todo/update', this.form)
        .then(res => {
          const resData = res.data
          if (resData.errno === 0) {
            this.$message.success('修改成功！')
            this.editVisible = false
            this.form = {}
          }
        })
        .catch(err => {
          this.$message.error('修改失败！')
        })
    },
    todoStatusChange(detail) {
      console.log('这是detail', detail)
      this.$axios
        .post('/api/todo/update', detail)
        .then(res => {
          const resData = res.data
        })
        .catch(err => {})
    },
    saveAdd() {
      this.addForm.status = false
      this.$axios
        .post('/api/todo/add', this.addForm)
        .then(res => {
          const resData = res.data
          if (resData.errno === 0) {
            this.$message.success('添加成功!')
            this.getTodoList()
            this.visible = false
            this.addForm = {}
          }
        })
        .catch(err => {
          this.$message.error('添加失败')
          this.visible = false
        })
    },
    handleDeleteTodo(id) {
      this.$axios
        .delete('/api/todo/del', {
          params: {
            id
          }
        })
        .then(res => {
          const resData = res.data
          if (resData.errno === 0) {
            this.$message.success('删除成功！')
            this.getTodoList()
          } else {
            this.$message.error('删除失败！')
          }
        })
        .catch(err => {
          this.$message.error('删除失败！')
        })
    },
    handleAddTodo() {
      this.visible = true
    }
  }
}
</script>


<style scoped>
.el-col-20 {
  width: 100%;
}
.el-row {
  margin-bottom: 20px;
}

.grid-content {
  display: flex;
  align-items: center;
  height: 100px;
}

.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #999;
}

.grid-num {
  font-size: 30px;
  font-weight: bold;
}

.grid-con-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
}

.grid-con-1 .grid-con-icon {
  background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
  background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
  background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
  color: rgb(242, 94, 67);
}

.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}

.user-avator {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.user-info-cont {
  padding-left: 50px;
  flex: 1;
  font-size: 14px;
  color: #999;
}

.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
}

.user-info-list {
  font-size: 14px;
  color: #999;
  line-height: 25px;
}

.user-info-list span {
  margin-left: 70px;
}

.mgb20 {
  margin-bottom: 20px;
}

.todo-item {
  font-size: 14px;
}

.todo-item-del {
  text-decoration: line-through;
  color: #999;
}

.schart {
  width: 100%;
  height: 300px;
}

.editIcon {
  font-size: 16px;
  margin: 10px;
}
</style>
